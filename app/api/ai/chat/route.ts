import { NextResponse } from "next/server"
import { getGeminiModel } from "@/lib/gemini-native"
import { retryWithBackoff, GEMINI_RETRY_CONFIG } from "@/lib/retry-utils"
import { withRateLimit } from "@/lib/server-rate-limiter"

const STREAM_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
}

// Vietnamese message shown to users when Gemini is rate limited.
// English translation: "Sorry, AI chat is over the usage limit. Please try again in a few minutes."
const RATE_LIMIT_FALLBACK_MESSAGE =
  "Xin lỗi, AI đang vượt giới hạn sử dụng. Vui lòng thử lại sau vài phút."
// Signals to clients that the response is a synthetic fallback rather than a real Gemini reply.
const RATE_LIMIT_FALLBACK_HEADER = "x-ai-fallback"
const RATE_LIMIT_FALLBACK_VALUE = "rate-limit"

export const maxDuration = 30

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Use POST to start an AI chat conversation.",
  })
}

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

    const normalizedMessages = messages.filter(Boolean).map((m: any) => ({
      id: m.id ?? crypto.randomUUID(),
      role: m.role === "user" || m.role === "assistant" ? m.role : "user",
      content: typeof m.content === "string" ? m.content : String(m.content ?? ""),
    }))

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY in environment" }, { status: 500 })
    }

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

    const geminiMessages = normalizedMessages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }))

    const geminiModel = getGeminiModel(typeof model === "string" && model.trim() ? model : undefined)

    const chat = geminiModel.startChat({
      history: geminiMessages.slice(0, -1),
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
    })

    const lastMessage = geminiMessages[geminiMessages.length - 1]
    // Use server-side rate limiting to prevent quota exhaustion
    const result = await withRateLimit(() =>
      retryWithBackoff(
        () => chat.sendMessageStream(lastMessage.parts[0].text),
        GEMINI_RETRY_CONFIG
      )
    )

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            controller.enqueue(encoder.encode(text))
          }
          controller.close()
        } catch (error) {
          console.error("[/api/ai/chat] streaming error:", error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, { headers: STREAM_HEADERS })
  } catch (err: any) {
    console.error("[/api/ai/chat] error:", err?.stack || err?.message || err)
    console.error("[/api/ai/chat] Error details:", {
      status: err?.status,
      message: err?.message,
      timestamp: new Date().toISOString(),
    })
    
    // Check for rate limit / quota errors
    const errorMessage = err?.message || err?.toString() || ""
    const isRateLimitError = 
      err?.status === 429 ||
      err?.response?.status === 429 ||
      errorMessage.toLowerCase().includes("too many requests") ||
      errorMessage.toLowerCase().includes("quota") ||
      errorMessage.toLowerCase().includes("rate limit") ||
      errorMessage.includes("429")
    
    if (isRateLimitError) {
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(RATE_LIMIT_FALLBACK_MESSAGE))
          controller.close()
        },
      })

      const fallbackHeaders = {
        ...STREAM_HEADERS,
        [RATE_LIMIT_FALLBACK_HEADER]: RATE_LIMIT_FALLBACK_VALUE,
      }

      return new Response(stream, { headers: fallbackHeaders })
    }
    
    return NextResponse.json({ 
      error: err?.message ?? "Failed to process chat",
      errorType: "GENERIC"
    }, { status: 500 })
  }
}
