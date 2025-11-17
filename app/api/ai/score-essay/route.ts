import { getGeminiModel } from "@/lib/gemini-native"
import { z } from "zod"

export const maxDuration = 60

const feedbackSchema = z.object({
  overallBand: z.number().min(0).max(9),
  summary: z.string(),
  criteria: z.object({
    TR: z.object({
      score: z.number().min(0).max(9),
      strengths: z.array(z.string()),
      issues: z.array(z.string()),
      suggestions: z.array(z.string()),
      examples: z.array(z.string()),
    }),
    CC: z.object({
      score: z.number().min(0).max(9),
      strengths: z.array(z.string()),
      issues: z.array(z.string()),
      suggestions: z.array(z.string()),
      examples: z.array(z.string()),
    }),
    LR: z.object({
      score: z.number().min(0).max(9),
      strengths: z.array(z.string()),
      issues: z.array(z.string()),
      suggestions: z.array(z.string()),
      examples: z.array(z.string()),
    }),
    GRA: z.object({
      score: z.number().min(0).max(9),
      strengths: z.array(z.string()),
      issues: z.array(z.string()),
      suggestions: z.array(z.string()),
      examples: z.array(z.string()),
    }),
  }),
  actionItems: z.array(z.string()),
})

export async function POST(req: Request) {
  try {
    const { essay, taskType, prompt } = await req.json()

    if (!essay || !taskType) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get model names from environment or use defaults
    const primaryModel = process.env.GEMINI_SCORE_MODEL || "gemini-1.5-flash"
    const fallbackModel = process.env.GEMINI_SCORE_MODEL_FALLBACK || "gemini-1.5-flash"
    
    const model = getGeminiModel(primaryModel)

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

Provide detailed, actionable feedback with specific examples from the text.

Return your response as a JSON object with this exact structure:
{
  "overallBand": number (0-9, can use .5 increments),
  "summary": "brief overall assessment",
  "criteria": {
    "TR": {
      "score": number (0-9),
      "strengths": ["strength 1", "strength 2"],
      "issues": ["issue 1", "issue 2"],
      "suggestions": ["suggestion 1", "suggestion 2"],
      "examples": ["example 1", "example 2"]
    },
    "CC": { same structure },
    "LR": { same structure },
    "GRA": { same structure }
  },
  "actionItems": ["action 1", "action 2", "action 3"]
}`

    const userPrompt = `PROMPT (This is what the essay MUST respond to):
${prompt}

ESSAY SUBMISSION:
${essay}

Provide a comprehensive IELTS evaluation following the JSON structure specified. Pay special attention to whether the essay addresses the specific prompt above.`

    // Try primary model first, fallback to secondary if it fails
    let result
    let usedModel = primaryModel
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
          maxOutputTokens: 1024, // Limit output tokens to reduce costs
        },
      })
    } catch (primaryError) {
      console.error(`[v0] Primary model (${primaryModel}) failed:`, primaryError)
      console.log(`[v0] Attempting fallback to ${fallbackModel}`)
      
      // Try fallback model
      const fallbackModelInstance = getGeminiModel(fallbackModel)
      usedModel = fallbackModel
      result = await fallbackModelInstance.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt + "\n\n" + userPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json",
          maxOutputTokens: 1024, // Limit output tokens to reduce costs
        },
      })
    }

    console.log(`[v0] Successfully used model: ${usedModel}`)

    const response = result.response
    const text = response.text()

    console.log("[v0] Raw Gemini response:", text)

    // Parse and validate the JSON response
    let parsedResponse
    try {
      parsedResponse = JSON.parse(text)
    } catch (parseError) {
      console.error("[v0] Failed to parse JSON:", parseError)
      console.error("[v0] Response text:", text)
      throw new Error("Invalid JSON response from AI")
    }

    // Validate with Zod schema
    const validatedFeedback = feedbackSchema.parse(parsedResponse)

    return Response.json({ feedback: validatedFeedback })
  } catch (error) {
    console.error("[v0] Error scoring essay:", error)
    return Response.json({ error: error instanceof Error ? error.message : "Failed to score essay" }, { status: 500 })
  }
}
