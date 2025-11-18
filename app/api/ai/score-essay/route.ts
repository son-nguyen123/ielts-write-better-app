import { getGeminiModel } from "@/lib/gemini-native"
import { retryWithBackoff, GEMINI_RETRY_CONFIG } from "@/lib/retry-utils"
import { withRateLimit } from "@/lib/server-rate-limiter"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { essay, taskType, prompt } = await req.json()

    if (!essay || !taskType) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const model = getGeminiModel()

    const systemPrompt = `You are an expert IELTS examiner. Evaluate the following ${taskType} essay according to official IELTS criteria.

Provide your evaluation in this format:

OVERALL BAND: [score 0-9]

SCORES:
- TR (Task Response): [score 0-9]
- CC (Coherence & Cohesion): [score 0-9]
- LR (Lexical Resource): [score 0-9]
- GRA (Grammatical Range & Accuracy): [score 0-9]

SUMMARY:
[Brief overall assessment]

ACTION ITEMS:
1. [First improvement suggestion]
2. [Second improvement suggestion]
3. [Third improvement suggestion]`

    const userPrompt = `PROMPT:
${prompt}

ESSAY:
${essay}

Please provide your IELTS evaluation.`

    // Use server-side rate limiting to prevent quota exhaustion
    const result = await withRateLimit(() =>
      retryWithBackoff(
        () =>
          model.generateContent({
            contents: [
              {
                role: "user",
                parts: [{ text: systemPrompt + "\n\n" + userPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1500,
            },
          }),
        GEMINI_RETRY_CONFIG
      )
    )

    const response = result.response
    const text = response.text()

    console.log("[score-essay] AI response:", text)

    // Parse the simple text response into a basic feedback structure
    const feedback = {
      overallBand: extractBandScore(text),
      summary: extractSummary(text),
      criteria: extractCriteria(text),
      actionItems: extractActionItems(text),
    }

    return Response.json({ feedback })
  } catch (error: any) {
    console.error("[score-essay] Error:", error)
    
    // Log detailed error information for debugging
    console.error("[score-essay] Raw error details:", {
      status: error?.status,
      responseStatus: error?.response?.status,
      responseData: error?.response?.data,
      message: error?.message,
      timestamp: new Date().toISOString(),
    })
    
    // Check for rate limit / quota errors with more precise detection
    const errorMessage = error?.message || error?.toString() || ""
    const errorString = errorMessage.toLowerCase()
    
    // More precise rate limit detection - avoid false positives
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
        retryAfter: 120 // Suggest retry after 2 minutes
      }, { status: 429 })
    }
    
    // Generic error
    return Response.json({ 
      error: error instanceof Error ? error.message : "Không thể chấm điểm bài viết. Vui lòng kiểm tra kết nối và thử lại.",
      errorType: "GENERIC"
    }, { status: 500 })
  }
}

// Helper functions to parse the simple text response
function extractBandScore(text: string): number {
  // Look for "OVERALL BAND: X" or similar patterns
  const overallMatch = text.match(/overall\s+band[:\s]+(\d+(?:\.\d+)?)/i)
  if (overallMatch) {
    const score = parseFloat(overallMatch[1])
    return Math.min(9, Math.max(0, score))
  }
  
  // Fallback: look for any score pattern
  const match = text.match(/(?:overall|band|score)[:\s]+(\d+(?:\.\d+)?)/i)
  if (match) {
    const score = parseFloat(match[1])
    return Math.min(9, Math.max(0, score))
  }
  return 6.0 // Default fallback
}

function extractSummary(text: string): string {
  // Look for SUMMARY section
  const summaryMatch = text.match(/SUMMARY[:\s]+(.+?)(?=ACTION ITEMS|$)/is)
  if (summaryMatch) {
    return summaryMatch[1].trim().split('\n')[0].trim()
  }
  
  // Fallback: extract the first meaningful paragraph
  const lines = text.split('\n').filter(line => line.trim() && !line.match(/^(OVERALL|SCORES|TR|CC|LR|GRA|ACTION)/i))
  if (lines.length > 0) {
    return lines[0].trim()
  }
  return "Your essay has been evaluated."
}

function extractCriteria(text: string): any {
  // Extract scores for each criterion from the SCORES section
  const criteria = {
    TR: extractCriterionScore(text, 'TR', 'Task Response'),
    CC: extractCriterionScore(text, 'CC', 'Coherence'),
    LR: extractCriterionScore(text, 'LR', 'Lexical'),
    GRA: extractCriterionScore(text, 'GRA', 'Grammar'),
  }
  
  return criteria
}

function extractCriterionScore(text: string, code: string, name: string): any {
  // Look for patterns like "TR (Task Response): 7" or "- TR: 7"
  const patterns = [
    new RegExp(`-?\\s*${code}\\s*\\([^)]+\\)[:\\s]+(\\d+(?:\\.\\d+)?)`, 'i'),
    new RegExp(`-?\\s*${code}[:\\s]+(\\d+(?:\\.\\d+)?)`, 'i'),
    new RegExp(`${name}[:\\s]+(\\d+(?:\\.\\d+)?)`, 'i'),
  ]
  
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      const score = Math.min(9, Math.max(0, parseFloat(match[1])))
      return {
        score,
        strengths: [],
        issues: [],
        suggestions: [],
        examples: [],
      }
    }
  }
  
  // Default fallback
  return {
    score: 6.0,
    strengths: [],
    issues: [],
    suggestions: [],
    examples: [],
  }
}

function extractActionItems(text: string): string[] {
  const items: string[] = []
  
  // Look for ACTION ITEMS section
  const actionMatch = text.match(/ACTION ITEMS[:\s]+(.+?)$/is)
  if (actionMatch) {
    const actionText = actionMatch[1]
    const lines = actionText.split('\n')
    
    for (const line of lines) {
      const cleaned = line.replace(/^\d+\.\s*/, '').replace(/^[-\*\•]\s*/, '').trim()
      if (cleaned && cleaned.length > 10 && !cleaned.match(/^(OVERALL|SCORES|SUMMARY)/i)) {
        items.push(cleaned)
      }
    }
  }
  
  // If no items found in structured format, look for numbered or bulleted lists
  if (items.length === 0) {
    const lines = text.split('\n')
    for (const line of lines) {
      if (line.match(/^[\d\-\*\•]\s*(.+)/)) {
        const cleaned = line.replace(/^[\d\-\*\•]\s*/, '').trim()
        if (cleaned && cleaned.length > 10 && !cleaned.match(/^(TR|CC|LR|GRA|OVERALL|SCORES|SUMMARY)/i)) {
          items.push(cleaned)
        }
      }
    }
  }
  
  // Ensure we have at least some action items
  if (items.length === 0) {
    items.push("Continue practicing IELTS writing tasks")
    items.push("Review grammar and vocabulary resources")
    items.push("Focus on addressing all parts of the task prompt")
  }
  
  return items.slice(0, 5) // Limit to 5 items
}
