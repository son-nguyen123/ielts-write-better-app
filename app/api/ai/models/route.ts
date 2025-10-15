import { ensureGeminiApiKey } from "@/lib/ai"

interface GoogleModel {
  name: string
  displayName?: string
  description?: string
  inputTokenLimit?: number
  outputTokenLimit?: number
  supportedGenerationMethods?: string[]
}

export async function GET() {
  try {
    const apiKey = ensureGeminiApiKey()

    const url = new URL("https://generativelanguage.googleapis.com/v1beta/models")
    url.searchParams.set("key", apiKey)

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      // Cache for a short duration to avoid repeated calls.
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => null)
      const message = error?.error?.message || "Failed to load Gemini models"
      return Response.json({ error: message }, { status: response.status })
    }

    const data = (await response.json()) as { models?: GoogleModel[] }
    const models = (data.models ?? [])
      .filter((model) => model.supportedGenerationMethods?.includes("generateContent"))
      .map((model) => {
        const shortName = model.name.replace(/^models\//, "")
        return {
          id: model.name,
          model: `google/${shortName}`,
          displayName: model.displayName || shortName,
          description: model.description,
          inputTokenLimit: model.inputTokenLimit,
          outputTokenLimit: model.outputTokenLimit,
        }
      })

    return Response.json({ models })
  } catch (error) {
    console.error("[v0] Error fetching Gemini models:", error)
    const message = error instanceof Error ? error.message : "Failed to fetch models"
    return Response.json({ error: message }, { status: 500 })
  }
}
