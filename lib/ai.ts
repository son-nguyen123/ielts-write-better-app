import { createGoogleGenerativeAI } from "@ai-sdk/google"

const DEFAULT_GOOGLE_MODEL = "gemini-1.5-flash"

export function ensureGeminiApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set")
  }

  return apiKey
}

const google = createGoogleGenerativeAI({
  apiKey: ensureGeminiApiKey(),
})

export function getGoogleModel(modelId?: string) {
  return google(modelId ?? DEFAULT_GOOGLE_MODEL)
}
