import { convertToModelMessages, streamText, type UIMessage } from "ai"
import { NextResponse } from "next/server"
import { getGoogleModel } from "@/lib/ai"

export const maxDuration = 30
// export const runtime = "nodejs" // hoặc "edge" nếu bạn dùng Edge Runtime

export async function POST(req: Request) {
  try {
    // 1) Đọc và kiểm tra body
    const json = await req.json().catch(() => null)
    if (!json) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const { messages, tone, level, attachedTask } = json

    // 2) Validate tối thiểu cho messages
    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "`messages` must be an array" }, { status: 400 })
    }
    // Chuẩn hoá thành UIMessage để tránh lỗi convert
    const cleaned: UIMessage[] = messages
      .filter(Boolean)
      .map((m: any) => ({
        id: m.id ?? crypto.randomUUID(),
        role: m.role === "system" || m.role === "user" || m.role === "assistant" ? m.role : "user",
        content: typeof m.content === "string" ? m.content : String(m.content ?? ""),
      }))

    // 3) Kiểm tra ENV để fail sớm, trả thông báo rõ ràng
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY in environment" },
        { status: 500 },
      )
    }

    // 4) Xây system prompt
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

    // 5) Convert messages
    const prompt = convertToModelMessages([
      { role: "system", content: systemPrompt } as UIMessage,
      ...cleaned,
    ])

    // 6) Gọi model (nên await để chắc result hợp lệ)
    const result = await streamText({
      model: getGoogleModel(),
      prompt,
      temperature: 0.7,
      maxOutputTokens: 2000,
    })

    // 7) Trả stream về client
    return result.toUIMessageStreamResponse()
  } catch (err: any) {
    console.error("[/api/ai/chat] error:", err?.stack || err?.message || err)
    return NextResponse.json(
      { error: err?.message ?? "Failed to process chat" },
      { status: 500 },
    )
  }
}
