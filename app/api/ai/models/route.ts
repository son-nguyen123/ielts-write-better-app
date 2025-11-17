import { NextResponse } from "next/server"

const GEMINI_MODELS_ENDPOINT = "https://generativelanguage.googleapis.com/v1/models"

interface GeminiModel {
  name?: string
  displayName?: string
  description?: string
  modelState?: string
  supportedGenerationMethods?: string[]
}

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY in environment" },
      { status: 500 },
    )
  }

  try {
    const response = await fetch(`${GEMINI_MODELS_ENDPOINT}?key=${apiKey}`, {
      // cache briefly to avoid hammering the API
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error("[GET /api/ai/models] Failed to list models", response.status, errorBody)
      return NextResponse.json(
        { error: "Failed to fetch Gemini models" },
        { status: response.status === 404 ? 404 : 502 },
      )
    }

    const payload = (await response.json()) as { models?: GeminiModel[] }

    const models = (payload.models ?? [])
      .filter((model) =>
        model.supportedGenerationMethods?.includes("generateContent") &&
        (model.modelState ?? "").toUpperCase() !== "STOPPED",
      )
      .map((model) => {
        const id = model.name?.replace(/^models\//, "") ?? ""

        return {
          id,
          displayName: model.displayName ?? (id || "Unnamed model"),
          description: model.description ?? "",
        }
      })
      .filter((model) => model.id)

    if (models.length === 0) {
      return NextResponse.json(
        { error: "No Gemini models available" },
        { status: 404 },
      )
    }

    const defaultModelId = models.find((model) => model.id.includes("flash"))?.id ?? models[0]?.id

    return NextResponse.json({ models, defaultModelId })
  } catch (error) {
    console.error("[GET /api/ai/models] Unexpected error", error)
    return NextResponse.json(
      { error: "Failed to fetch Gemini models" },
      { status: 500 },
    )
  }
}
