import { getGeminiModel } from "@/lib/gemini-native"
import type { LineLevelFeedback, TaskFeedback } from "@/types/tasks"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { promptText, taskType, essayText, userId, promptId } = await req.json()

    if (!essayText || !taskType) {
      return Response.json({ error: "Missing required fields: essayText and taskType" }, { status: 400 })
    }

    const model = getGeminiModel()

    const systemPrompt = `You are an expert IELTS examiner. Evaluate the following ${taskType} essay according to official IELTS criteria:

Task Response (TR): How well the essay addresses the task
- For ${taskType}: Check if the essay directly responds to ALL parts of the prompt
- Assess whether the essay stays on topic and doesn't deviate from the given prompt
- Evaluate if the position/response is clear and well-developed
- For Task 2: Check if both views are discussed if required, and opinion is clearly stated
- PENALIZE essays that go off-topic or don't address the specific prompt given

Coherence & Cohesion (CC): Organization and logical flow
Lexical Resource (LR): Vocabulary range and accuracy
Grammatical Range & Accuracy (GRA): Grammar complexity and correctness

IMPORTANT: The Task Response (TR) score should heavily consider:
1. Whether the essay addresses the SPECIFIC prompt given (not a different topic)
2. Whether all parts of the task are answered
3. Relevance to the topic throughout the essay

CRITICAL: You MUST provide line-level feedback for the essay. Analyze the text thoroughly and identify:
- Grammar errors (verb tense, subject-verb agreement, articles, etc.)
- Lexical issues (word choice, collocations, inappropriate vocabulary)
- Coherence problems (unclear references, poor transitions, logical flow issues)
- Task response issues (off-topic sentences, irrelevant information)

For each error found, provide:
- Exact start and end character indices in the essay text
- Category of the error
- Clear explanation of the problem
- A suggested correction/rewrite

Provide detailed, actionable feedback with specific examples from the text.

Return your response as a JSON object with this exact structure:
{
  "overall_band": number (0-9, can use .5 increments),
  "summary": "brief overall assessment",
  "criteria": {
    "TR": {
      "score": number (0-9),
      "strengths": ["strength 1", "strength 2"],
      "areas_for_improvement": ["issue 1", "issue 2"],
      "suggestions": ["suggestion 1", "suggestion 2"],
      "examples": ["example 1", "example 2"]
    },
    "CC": { same structure },
    "LR": { same structure },
    "GRA": { same structure }
  },
  "action_plan": ["action 1", "action 2", "action 3"],
  "line_level_feedback": [
    {
      "start_index": 0,
      "end_index": 54,
      "category": "grammar" | "lexical" | "coherence" | "task_response",
      "comment": "Explain the specific error or issue here.",
      "suggested_rewrite": "Provide the corrected version here."
    }
  ]
}

IMPORTANT: The line_level_feedback array MUST NOT be empty. Always provide at least several specific error corrections or improvement suggestions with exact character positions.`

    const userPrompt = `PROMPT (This is what the essay MUST respond to):
${promptText || "No specific prompt provided"}

ESSAY:
${essayText}

Provide a comprehensive IELTS evaluation following the JSON structure specified. Pay special attention to whether the essay addresses the specific prompt above.`

    let result
    try {
      result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt + "\n\n" + userPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json",
          maxOutputTokens: 2048,
        },
      })
    } catch (apiError) {
      console.error("[evaluate] Gemini API error:", apiError)
      
      const errorMsg = apiError instanceof Error ? apiError.message : String(apiError)
      
      if (errorMsg.includes("quota") || errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("429")) {
        throw new Error("API quota limit reached. Please wait a few minutes and try again. Free tier has limited requests per minute.")
      }
      
      if (errorMsg.includes("API key")) {
        throw new Error("API key configuration error. Please contact support.")
      }
      
      throw apiError
    }

    const response = result.response
    const text = response.text()

    console.log("[evaluate] AI response:", text)

    let parsedFeedback: any
    try {
      parsedFeedback = JSON.parse(text)
    } catch (parseError) {
      console.error("[evaluate] Failed to parse AI response as JSON:", parseError)
      console.error("[evaluate] Raw AI response that failed to parse:", text)
      throw new Error("Không thể phân tích kết quả chấm điểm từ AI. Vui lòng thử lại sau.")
    }
    
    // Validate that required fields are present
    if (!parsedFeedback.overall_band || !parsedFeedback.criteria) {
      console.error("[evaluate] AI response missing required fields:", parsedFeedback)
      throw new Error("Phản hồi từ AI không đầy đủ. Vui lòng thử lại sau.")
    }

    // Transform API response to match our internal format
    const feedback: TaskFeedback = {
      overallBand: parsedFeedback.overall_band,
      summary: parsedFeedback.summary || "Overall assessment of the essay.",
      criteria: transformCriteria(parsedFeedback.criteria),
      actionItems: parsedFeedback.action_plan || [],
      lineLevelFeedback: transformLineLevelFeedback(parsedFeedback.line_level_feedback || [])
    }

    return Response.json({ 
      feedback,
      revisionId: `rev_${Date.now()}`,
      createdAt: new Date().toISOString()
    })
  } catch (error: any) {
    console.error("[evaluate] Error:", error)
    
    const errorMessage = error?.message || error?.toString() || ""
    const errorString = errorMessage.toLowerCase()
    
    const isRateLimitError = 
      error?.status === 429 ||
      error?.response?.status === 429 ||
      errorString.includes("resource_exhausted") ||
      errorString.includes("too many requests") ||
      (errorString.includes("rate limit") && !errorString.includes("unlimited"))
    
    if (isRateLimitError) {
      return Response.json({ 
        error: "AI chấm điểm đang vượt giới hạn sử dụng. Vui lòng thử lại sau 1-2 phút.",
        errorType: "RATE_LIMIT",
        retryAfter: 120
      }, { status: 429 })
    }
    
    return Response.json({ 
      error: error instanceof Error ? error.message : "Không thể chấm điểm bài viết. Vui lòng kiểm tra kết nối và thử lại.",
      errorType: "GENERIC"
    }, { status: 500 })
  }
}

function transformCriteria(criteria: any) {
  const result: any = {}
  const criteriaKeys = ["TR", "CC", "LR", "GRA"]
  
  for (const key of criteriaKeys) {
    const criterionData = criteria[key]
    if (!criterionData || typeof criterionData.score !== 'number') {
      console.error(`[evaluate] Missing or invalid criterion data for ${key}:`, criterionData)
      throw new Error(`Dữ liệu tiêu chí ${key} không hợp lệ từ AI`)
    }
    result[key] = {
      score: criterionData.score,
      strengths: criterionData.strengths || [],
      issues: criterionData.areas_for_improvement || criterionData.issues || [],
      suggestions: criterionData.suggestions || [],
      examples: criterionData.examples || []
    }
  }
  
  return result
}

function transformLineLevelFeedback(feedbackArray: any[]): LineLevelFeedback[] {
  return feedbackArray.map(item => ({
    startIndex: item.start_index || 0,
    endIndex: item.end_index || 0,
    category: item.category || "grammar",
    comment: item.comment || "",
    suggestedRewrite: item.suggested_rewrite
  }))
}
