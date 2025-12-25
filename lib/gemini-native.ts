import { GoogleGenerativeAI } from "@google/generative-ai"

let genAI: GoogleGenerativeAI | null = null
const FALLBACK_MODEL = "gemini-2.0-flash"
// Accepts typical Gemini model patterns like gemini-2.0-flash, gemini-1.5-flash-latest, gemini-1.5-pro-002
const MODEL_PATTERN = /^gemini-[a-z0-9][a-z0-9.-]*$/i

function normalizeModelName(modelName?: string) {
  const rawModel = (modelName ?? process.env.GEMINI_MODEL ?? "").trim()
  let normalized = rawModel || FALLBACK_MODEL

  if (!normalized.startsWith("gemini-")) {
    normalized = `gemini-${normalized}`
  }

  if (!MODEL_PATTERN.test(normalized)) {
    console.warn(
      `[gemini] Invalid model name "${normalized}", falling back to ${FALLBACK_MODEL}`
    )
    return FALLBACK_MODEL
  }

  return normalized
}

export function getGeminiClient() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set")
    }
    // Initialize with v1 API endpoint (not v1beta)
    genAI = new GoogleGenerativeAI(apiKey, { apiVersion: "v1" })
  }
  return genAI
}

export function getGeminiModel(modelName?: string) {
  const client = getGeminiClient()
  const model = normalizeModelName(modelName)
  return client.getGenerativeModel({
    model,
    // Ensure we're using v1 API, not v1beta
  })
}
