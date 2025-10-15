import { generateObject } from "ai"
import { z } from "zod"
import { ensureGeminiApiKey, resolveModel } from "@/lib/ai"

export const maxDuration = 30

const grammarSchema = z.object({
  issues: z.array(
    z.object({
      line: z.number(),
      original: z.string(),
      suggested: z.string(),
      rule: z.string(),
      explanation: z.string(),
    }),
  ),
})

export async function POST(req: Request) {
  try {
    const { text, model } = await req.json()

    ensureGeminiApiKey()

    if (!text) {
      return Response.json({ error: "Text is required" }, { status: 400 })
    }

    const { object } = await generateObject({
      model: resolveModel(model),
      schema: grammarSchema,
      prompt: `Check the following text for grammar, spelling, and style issues suitable for IELTS writing:

"${text}"

Identify all errors and provide:
- Line number (estimate based on sentence position)
- Original incorrect text
- Suggested correction
- Grammar rule violated
- Clear explanation

Focus on: subject-verb agreement, tense consistency, article usage, prepositions, spelling, punctuation, and word choice.`,
      temperature: 0.2,
    })

    return Response.json({ issues: object.issues })
  } catch (error) {
    console.error("[v0] Error checking grammar:", error)
    const message = error instanceof Error ? error.message : "Failed to check grammar"
    return Response.json({ error: message }, { status: 500 })
  }
}
