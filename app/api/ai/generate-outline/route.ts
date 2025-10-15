import { generateObject } from "ai"
import { getGoogleModel } from "@/lib/ai"
import { z } from "zod"

export const maxDuration = 30

const outlineSchema = z.object({
  introduction: z.object({
    hook: z.string(),
    background: z.string(),
    thesis: z.string(),
  }),
  body1: z.object({
    topic: z.string(),
    points: z.array(z.string()),
  }),
  body2: z.object({
    topic: z.string(),
    points: z.array(z.string()),
  }),
  counterArgument: z.object({
    point: z.string(),
    rebuttal: z.string(),
  }),
  conclusion: z.object({
    summary: z.string(),
    finalThought: z.string(),
  }),
})

export async function POST(req: Request) {
  try {
    const { topic, targetBand } = await req.json()

    if (!topic) {
      return Response.json({ error: "Topic is required" }, { status: 400 })
    }

    const { object } = await generateObject({
      model: getGoogleModel(),
      schema: outlineSchema,
      prompt: `Create a detailed essay outline for an IELTS Task 2 essay targeting band ${targetBand || "7.0"}.

Topic: "${topic}"

Generate a complete outline with:
1. Introduction (hook, background, thesis statement)
2. Body Paragraph 1 (topic sentence + 3 supporting points)
3. Body Paragraph 2 (topic sentence + 3 supporting points)
4. Counter-argument (opposing view + rebuttal)
5. Conclusion (summary + final thought)

Make it specific to the topic and appropriate for the target band score.`,
      temperature: 0.7,
    })

    return Response.json({ outline: object })
  } catch (error) {
    console.error("[v0] Error generating outline:", error)
    return Response.json({ error: "Failed to generate outline" }, { status: 500 })
  }
}
