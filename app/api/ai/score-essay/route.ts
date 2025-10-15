import { generateObject } from "ai"
import { z } from "zod"
import { ensureGeminiApiKey, resolveModel } from "@/lib/ai"

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
    const { essay, taskType, prompt, model } = await req.json()

    ensureGeminiApiKey()

    if (!essay || !taskType) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const systemPrompt = `You are an expert IELTS examiner. Evaluate the following ${taskType} essay according to official IELTS criteria:

Task Response (TR): How well the essay addresses the task
Coherence & Cohesion (CC): Organization and logical flow
Lexical Resource (LR): Vocabulary range and accuracy
Grammatical Range & Accuracy (GRA): Grammar complexity and correctness

Provide detailed, actionable feedback with specific examples from the text.`

    const userPrompt = `Prompt: ${prompt}

Essay:
${essay}

Provide a comprehensive IELTS evaluation with:
1. Overall band score (0-9, can use .5 increments)
2. Individual scores for TR, CC, LR, and GRA
3. For each criterion: strengths, issues, specific suggestions, and examples
4. Action items for improvement`

    const { object } = await generateObject({
      model: resolveModel(model),
      schema: feedbackSchema,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
    })

    return Response.json({ feedback: object })
  } catch (error) {
    console.error("[v0] Error scoring essay:", error)
    const message = error instanceof Error ? error.message : "Failed to score essay"
    return Response.json({ error: message }, { status: 500 })
  }
}
