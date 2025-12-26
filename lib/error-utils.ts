/**
 * Utility functions for handling API errors
 */

/**
 * Check if an error message indicates a missing API key
 */
export function isMissingApiKeyError(errorMessage: string): boolean {
  const errorString = errorMessage.toLowerCase()
  return (
    errorString.includes("gemini_api_key") ||
    (errorString.includes("api key") && errorString.includes("not set")) ||
    (errorString.includes("missing") && errorString.includes("api"))
  )
}

/**
 * Check if an error message indicates a rate limit error
 */
export function isRateLimitError(error: any): boolean {
  const errorMessage = error?.message || error?.toString() || ""
  const errorString = errorMessage.toLowerCase()
  
  return (
    error?.status === 429 ||
    error?.response?.status === 429 ||
    errorString.includes("resource_exhausted") ||
    errorString.includes("too many requests") ||
    (errorString.includes("rate limit") && !errorString.includes("unlimited")) ||
    errorMessage.includes("429")
  )
}

/**
 * Create a standardized API error response for missing API key
 */
export function createMissingApiKeyResponse() {
  return {
    error: "Missing GEMINI_API_KEY in environment",
    message: "The GEMINI_API_KEY environment variable is not configured. Please set up your API key to use AI features.",
    setupInstructions: "Create a .env.local file in the project root and add: GEMINI_API_KEY=your_api_key_here",
    docsUrl: "https://aistudio.google.com/app/apikey",
    errorType: "MISSING_API_KEY"
  }
}

/**
 * Format client-side error message for missing API key
 */
export function formatMissingApiKeyMessage(): string {
  return (
    "⚠️ **Configuration Required**\n\n" +
    "The AI features are not configured. Please ask the administrator to set up the GEMINI_API_KEY in the .env.local file.\n\n" +
    "Get your API key at: https://aistudio.google.com/app/apikey"
  )
}

/**
 * Format client-side error message for rate limit
 */
export function formatRateLimitMessage(): string {
  return "Xin lỗi, AI đang vượt giới hạn sử dụng. Vui lòng thử lại sau vài phút."
}
