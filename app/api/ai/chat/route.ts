import { streamText } from "ai"
import { NextResponse } from "next/server"
import { getGoogleModel } from "@/lib/ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null)
    if (!json) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const { messages, tone, level, attachedTask, model } = json

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "`messages` must be an array" }, { status: 400 })
    }

    // Normalize messages to standard format without custom properties
    const normalizedMessages = messages.filter(Boolean).map((m: any) => ({
      id: m.id ?? crypto.randomUUID(),
      role: m.role === "user" || m.role === "assistant" ? m.role : "user",
      content: typeof m.content === "string" ? m.content : String(m.content ?? ""),
    }))

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY in environment" }, { status: 500 })
    }

    // Build system prompt
    let systemPrompt = `You are an expert IELTS writing tutor. Help students improve their writing by:
- Analyzing essays using TR/CC/LR/GRA criteria
- Suggesting better vocabulary and phrasing
- Explaining grammar rules clearly
- Providing specific, actionable feedback

Tone: ${tone || "neutral"}
Student Level: ${level || "B2"}`

    if (attachedTask?.prompt || attachedTask?.essay) {
      systemPrompt += `

Attached Task Context:
Prompt: ${attachedTask?.prompt ?? ""}
Essay: ${attachedTask?.essay ?? ""}`
    }

    const result = await streamText({
      model: getGoogleModel(typeof model === "string" && model.trim() ? model : undefined),
      system: systemPrompt,
      messages: normalizedMessages,
      temperature: 0.7,
      maxTokens: 2000,
    })

    return result.toDataStreamResponse()
  } catch (err: any) {
    console.error("[/api/ai/chat] error:", err?.stack || err?.message || err)
    return NextResponse.json({ error: err?.message ?? "Failed to process chat" }, { status: 500 })
  }
}
