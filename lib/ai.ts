import { createGoogleGenerativeAI } from "@ai-sdk/google"

const DEFAULT_GOOGLE_MODEL = "gemini-2.0-flash"

let googleClient: ReturnType<typeof createGoogleGenerativeAI> | undefined

export function ensureGeminiApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set")
  }

  return apiKey
}

function getGoogleClient() {
  if (!googleClient) {
    googleClient = createGoogleGenerativeAI({
      apiKey: ensureGeminiApiKey(),
    })
  }

  return googleClient
}

export function getGoogleModel(modelId?: string) {
  return getGoogleClient()(modelId ?? DEFAULT_GOOGLE_MODEL)
}
