import { convertToModelMessages, streamText, type UIMessage } from "ai"

import { getGoogleModel } from "@/lib/ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, tone, level, attachedTask } = await req.json()

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
      model: getGoogleModel(),
      prompt,
      temperature: 0.7,
      maxOutputTokens: 2000,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] Error in chat:", error)

    const statusFromError = extractStatusCode(error)

    if (statusFromError === 401 || statusFromError === 403) {
      return Response.json(
        { error: "Gemini API key is invalid or lacks required permissions" },
        { status: statusFromError },
      )
    }

    if (error instanceof Error && error.message.includes("GEMINI_API_KEY is not set")) {
      return Response.json({ error: "GEMINI_API_KEY is not configured" }, { status: 401 })
    }

    const message = error instanceof Error ? error.message.toLowerCase() : ""
    if (message.includes("unauthorized") || message.includes("unauthenticated") || message.includes("401")) {
      return Response.json({ error: "Gemini API key is invalid" }, { status: 401 })
    }

    if (message.includes("permission") || message.includes("forbidden") || message.includes("403")) {
      return Response.json(
        { error: "Gemini API key does not have access to the requested model" },
        { status: 403 },
      )
    }

    return Response.json({ error: "Failed to process chat" }, { status: 500 })
  }
}

function extractStatusCode(error: unknown): number | undefined {
  if (!error || typeof error !== "object") {
    return undefined
  }

  const withStatus = error as { status?: unknown; cause?: unknown }
  if (typeof withStatus.status === "number") {
    return withStatus.status
  }

  if (withStatus.cause && typeof withStatus.cause === "object") {
    const causeWithStatus = withStatus.cause as { status?: unknown }
    if (typeof causeWithStatus.status === "number") {
      return causeWithStatus.status
    }
  }

  return undefined
}
