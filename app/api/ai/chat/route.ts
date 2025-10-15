import { convertToModelMessages, streamText, type UIMessage } from "ai"

import { getGoogleModel } from "@/lib/ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, tone, level, attachedTask, modelId } = await req.json()

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
      model: getGoogleModel(modelId ?? "gemini-2.0-flash"),
      prompt,
      temperature: 0.7,
      maxOutputTokens: 2000,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] Error in chat:", error)
    return Response.json({ error: "Failed to process chat" }, { status: 500 })
  }
}
