import { getGeminiModel } from "@/lib/gemini-native"
import { retryWithBackoff, GEMINI_RETRY_CONFIG } from "@/lib/retry-utils"
import { withRateLimit } from "@/lib/server-rate-limiter"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { originalEssay, feedback, prompt, taskType } = await req.json()

    if (!originalEssay || !feedback) {
      return Response.json({ error: "Missing required fields: originalEssay and feedback" }, { status: 400 })
    }

    const model = getGeminiModel()

    // Build comprehensive feedback summary for the AI
    let feedbackSummary = `Overall Band: ${feedback.overallBand}\nSummary: ${feedback.summary}\n\n`
    
    if (feedback.criteria) {
      for (const [key, criterion] of Object.entries(feedback.criteria)) {
        const crit = criterion as any
        feedbackSummary += `${key} (Score: ${crit.score}):\n`
        if (crit.issues?.length > 0) {
          feedbackSummary += `Issues: ${crit.issues.join(', ')}\n`
        }
        if (crit.suggestions?.length > 0) {
          feedbackSummary += `Suggestions: ${crit.suggestions.join(', ')}\n`
        }
      }
    }

    // Add line-level feedback details
    if (feedback.lineLevelFeedback && feedback.lineLevelFeedback.length > 0) {
      feedbackSummary += `\nDetailed Errors:\n`
      feedback.lineLevelFeedback.forEach((item: any, index: number) => {
        const excerpt = originalEssay.substring(item.startIndex, item.endIndex)
        feedbackSummary += `${index + 1}. "${excerpt}" - ${item.comment}`
        if (item.suggestedRewrite) {
          feedbackSummary += ` → "${item.suggestedRewrite}"`
        }
        feedbackSummary += `\n`
      })
    }

    const systemPrompt = `You are an expert IELTS writing tutor. Your task is to create an improved version of the student's essay that addresses all the identified issues while maintaining the student's core ideas and perspective.

IMPORTANT GUIDELINES:
1. Keep the same essay structure and main arguments as the original
2. Fix all grammar, vocabulary, and coherence issues identified
3. Improve task response by making sure all parts of the prompt are addressed
4. Enhance the writing to achieve a higher band score (aim for Band 7-8)
5. Maintain the student's voice and ideas - do NOT write a completely different essay
6. Apply all the suggested corrections from the line-level feedback
7. Make the essay more coherent and cohesive with better transitions
8. Use more sophisticated vocabulary where appropriate
9. Ensure grammatical accuracy throughout

Return your response as a JSON object with this structure:
{
  "improvedEssay": "The complete improved essay text here",
  "explanation": "A brief explanation (2-3 sentences) of the main improvements made and why this version would score higher"
}`

    const userPrompt = `Original Prompt: ${prompt || "General IELTS Task 2"}

Original Essay:
${originalEssay}

Feedback Summary:
${feedbackSummary}

Task Type: ${taskType || "IELTS Writing Task 2"}

Please generate an improved version of this essay that addresses all the issues identified in the feedback while keeping the student's main ideas intact.`

    // Use server-side rate limiting and retry logic
    let result
    try {
      result = await withRateLimit(() =>
        retryWithBackoff(
          () => model.generateContent({
            contents: [
              {
                role: "user",
                parts: [{ text: systemPrompt + "\n\n" + userPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topP: 0.8,
              topK: 40,
              maxOutputTokens: 2048,
            },
          }),
          GEMINI_RETRY_CONFIG
        )
      )
    } catch (retryError: any) {
      console.error("[generate-improved-essay] Retry failed:", retryError)
      const errorMessage = retryError?.message || retryError?.toString() || ""
      const isRateLimitError = 
        retryError?.status === 429 ||
        errorMessage.toLowerCase().includes("quota") ||
        errorMessage.toLowerCase().includes("rate limit")
      
      if (isRateLimitError) {
        return Response.json({ 
          error: "AI đang vượt giới hạn sử dụng. Vui lòng thử lại sau vài phút.",
          errorType: "RATE_LIMIT"
        }, { status: 429 })
      }
      
      throw retryError
    }

    const text = (result as any).response.text()
    
    // Parse JSON response
    let improvedData
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        improvedData = JSON.parse(jsonMatch[0])
      } else {
        // If no JSON found, treat the whole response as the improved essay
        improvedData = {
          improvedEssay: text,
          explanation: "Essay improved based on feedback"
        }
      }
    } catch (parseError) {
      console.error("[generate-improved-essay] JSON parse error:", parseError)
      // Fallback: use the raw text as the improved essay
      improvedData = {
        improvedEssay: text,
        explanation: "Essay improved based on feedback"
      }
    }

    return Response.json({ 
      improvedEssay: improvedData.improvedEssay,
      explanation: improvedData.explanation || "Essay improved to address identified issues and achieve a higher band score."
    })

  } catch (error: any) {
    console.error("[generate-improved-essay] Error:", error)
    
    const errorMessage = error?.message || error?.toString() || ""
    const isRateLimitError = 
      error?.status === 429 ||
      error?.response?.status === 429 ||
      errorMessage.toLowerCase().includes("too many requests") ||
      errorMessage.toLowerCase().includes("quota") ||
      errorMessage.toLowerCase().includes("rate limit") ||
      errorMessage.includes("429")
    
    if (isRateLimitError) {
      return Response.json({ 
        error: "AI đang vượt giới hạn sử dụng. Vui lòng thử lại sau vài phút.",
        errorType: "RATE_LIMIT"
      }, { status: 429 })
    }
    
    return Response.json({ 
      error: "Không thể tạo bài mẫu cải thiện. Vui lòng thử lại.",
      errorType: "GENERIC"
    }, { status: 500 })
  }
}
