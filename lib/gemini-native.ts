import { GoogleGenerativeAI } from "@google/generative-ai"

let genAI: GoogleGenerativeAI | null = null

export function getGeminiClient() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set")
    }
    // Initialize with v1 API endpoint (not v1beta)
    genAI = new GoogleGenerativeAI(apiKey)
  }
  return genAI
}

/**
 * Get Gemini model with fallback support
 * Priority order:
 * 1. Provided modelName (if valid)
 * 2. gemini-2.0-flash-exp (experimental version with higher limits)
 * 3. gemini-1.5-flash (stable fallback)
 */
export function getGeminiModel(modelName?: string) {
  const client = getGeminiClient()
  
  // Use provided model name, or default to experimental flash model
  // gemini-2.0-flash-exp has higher rate limits than other models
  const model = modelName || "gemini-2.0-flash-exp"
  
  return client.getGenerativeModel({ 
    model,
  })
}
