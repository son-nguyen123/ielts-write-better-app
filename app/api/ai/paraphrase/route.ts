import { generateObject } from "ai"
import { z } from "zod"
import { ensureGeminiApiKey, resolveModel } from "@/lib/ai"

export const maxDuration = 30

const paraphraseSchema = z.object({
  paraphrases: z.array(
    z.object({
      text: z.string(),
      style: z.enum(["Concise", "Formal", "Band-up vocab", "Academic", "Expanded"]),
      description: z.string(),
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
      schema: paraphraseSchema,
      prompt: `Paraphrase the following text in 5 different styles for IELTS writing:

Original: "${text}"

Provide exactly 5 paraphrases with these styles:
1. Concise - Shorter, more direct
2. Formal - More academic register
3. Band-up vocab - Higher-level vocabulary
4. Academic - Sophisticated academic style
5. Expanded - More detailed expression

Each paraphrase should maintain the original meaning while demonstrating the specified style.`,
      temperature: 0.8,
    })

    return Response.json({ paraphrases: object.paraphrases })
  } catch (error) {
    console.error("[v0] Error generating paraphrases:", error)
    const message = error instanceof Error ? error.message : "Failed to generate paraphrases"
    return Response.json({ error: message }, { status: 500 })
  }
}
