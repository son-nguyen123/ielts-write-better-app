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

export function getGeminiModel(modelName = "gemini-2.0-flash-exp") {
  const client = getGeminiClient()
  return client.getGenerativeModel({ model: modelName })
}
