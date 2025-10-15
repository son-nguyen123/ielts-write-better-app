export const DEFAULT_GOOGLE_MODEL = "google/gemini-2.5-flash-image"

export function ensureGeminiApiKey(): string {
  const existingGoogleKey = process.env.GOOGLE_API_KEY
  const geminiKey = process.env.GEMINI_API_KEY || existingGoogleKey

  if (!geminiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable")
  }

  if (!existingGoogleKey) {
    process.env.GOOGLE_API_KEY = geminiKey
  }

  return geminiKey
}

export function resolveModel(requestedModel?: string | null): string {
  if (requestedModel && typeof requestedModel === "string" && requestedModel.trim().length > 0) {
    return requestedModel
  }
  return DEFAULT_GOOGLE_MODEL
}
