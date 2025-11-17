import { GoogleGenerativeAI } from "@google/generative-ai"

let genAI: GoogleGenerativeAI | null = null

export function getGeminiClient() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set")
    }
    genAI = new GoogleGenerativeAI(apiKey)
  }
  return genAI
}

export function getGeminiModel(modelName?: string) {
  const client = getGeminiClient()
  // Use provided modelName, or fall back to environment variable, or use default
  const model = modelName || process.env.GEMINI_SCORE_MODEL || "gemini-1.5-flash"
  return client.getGenerativeModel({ model })
}
