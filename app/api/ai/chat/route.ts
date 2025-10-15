import { streamText, type CoreMessage } from "ai"
import { ensureGeminiApiKey, resolveModel } from "@/lib/ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const rawMessages = Array.isArray(body?.messages) ? body.messages : []
    const tone = typeof body?.tone === "string" ? body.tone : undefined
    const level = typeof body?.level === "string" ? body.level : undefined
    const attachedTask = body?.attachedTask
    const model = body?.model

    const normalizedMessages: CoreMessage[] = rawMessages
      .filter(
        (message): message is { role: "user" | "assistant"; content: string } =>
          !!message &&
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string" &&
          message.content.trim().length > 0,
      )
      .map((message) => ({ role: message.role, content: message.content }))

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

    const conversation: CoreMessage[] = [
      { role: "system", content: systemPrompt },
      ...normalizedMessages,
    ]

    const result = streamText({
      model: resolveModel(model),
      messages: conversation,
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
