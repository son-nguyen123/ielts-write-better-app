import { convertToModelMessages, streamText, type UIMessage } from "ai"
import { ensureGeminiApiKey, resolveModel } from "@/lib/ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, tone, level, attachedTask, model } = await req.json()

    ensureGeminiApiKey()

    let systemPrompt = `You are an expert IELTS writing tutor. Help students improve their writing by:
- Analyzing essays using TR/CC/LR/GRA criteria
- Suggesting better vocabulary and phrasing
- Explaining grammar rules clearly
- Providing specific, actionable feedback

Tone: ${tone || "neutral"}
Student Level: ${level || "B2"}`

    if (attachedTask) {
      systemPrompt += `\n\nAttached Task Context:\nPrompt: ${attachedTask.prompt}\nEssay: ${attachedTask.essay}`
    }

    const prompt = convertToModelMessages([{ role: "system", content: systemPrompt } as UIMessage, ...messages])

    const result = streamText({
      model: resolveModel(model),
      prompt,
      temperature: 0.7,
      maxOutputTokens: 2000,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] Error in chat:", error)
    const message = error instanceof Error ? error.message : "Failed to process chat"
    return Response.json({ error: message }, { status: 500 })
  }
}
