import { NextResponse } from "next/server"

const GEMINI_MODELS_ENDPOINT = "https://generativelanguage.googleapis.com/v1/models"

interface GeminiModel {
  name?: string
  displayName?: string
  description?: string
  modelState?: string
  supportedGenerationMethods?: string[]
}

// Fallback models in case API fetch fails
const FALLBACK_MODELS = [
  {
    id: "gemini-2.0-flash-exp",
    displayName: "Gemini 2.0 Flash (Experimental)",
    description: "Fast and efficient model with higher rate limits"
  },
  {
    id: "gemini-1.5-flash",
    displayName: "Gemini 1.5 Flash",
    description: "Stable and reliable flash model"
  },
  {
    id: "gemini-1.5-pro",
    displayName: "Gemini 1.5 Pro",
    description: "Most capable model with advanced reasoning"
  }
]

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
      
      // Return fallback models instead of failing completely
      console.log("[GET /api/ai/models] Using fallback models")
      return NextResponse.json({ 
        models: FALLBACK_MODELS, 
        defaultModelId: "gemini-2.0-flash-exp",
        fallback: true
      })
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
      // Return fallback models instead of failing
      console.log("[GET /api/ai/models] No models found, using fallback")
      return NextResponse.json({ 
        models: FALLBACK_MODELS, 
        defaultModelId: "gemini-2.0-flash-exp",
        fallback: true
      })
    }

    // Prefer experimental flash model for better rate limits
    const defaultModelId = models.find((model) => 
      model.id.includes("2.0-flash-exp")
    )?.id ?? models.find((model) => 
      model.id.includes("flash")
    )?.id ?? models[0]?.id

    return NextResponse.json({ models, defaultModelId })
  } catch (error) {
    console.error("[GET /api/ai/models] Unexpected error", error)
    
    // Return fallback models instead of failing completely
    console.log("[GET /api/ai/models] Error occurred, using fallback models")
    return NextResponse.json({ 
      models: FALLBACK_MODELS, 
      defaultModelId: "gemini-2.0-flash-exp",
      fallback: true
    })
  }
}
