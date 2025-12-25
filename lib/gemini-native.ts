import { GoogleGenerativeAI } from "@google/generative-ai"

let genAI: GoogleGenerativeAI | null = null
const DEFAULT_MODEL =
  (process.env.GEMINI_MODEL ?? "").trim() || "gemini-1.5-flash-latest"

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
  const model = (modelName ?? "").trim() || DEFAULT_MODEL
  return client.getGenerativeModel({
    model,
    // Ensure we're using v1 API, not v1beta
  })
}
