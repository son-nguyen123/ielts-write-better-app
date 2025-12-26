import { generateObject } from "ai"
import { getGoogleModel } from "@/lib/ai"
import { retryWithBackoff, GEMINI_RETRY_CONFIG } from "@/lib/retry-utils"
import { withRateLimit } from "@/lib/server-rate-limiter"
import { z } from "zod"

export const maxDuration = 30

const paraphraseSchema = z.object({
  paraphrases: z.array(
    z.object({
      text: z.string(),
      style: z.enum(["Concise", "Formal", "Band-up vocab", "Academic", "Expanded"]),
      description: z.string(),
    }),
  ),
})

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    if (!text) {
      return Response.json({ error: "Text is required" }, { status: 400 })
    }

    // Use server-side rate limiting to prevent quota exhaustion
    const { object } = await withRateLimit(() =>
      retryWithBackoff(
        () =>
          generateObject({
            model: getGoogleModel(),
            schema: paraphraseSchema,
            prompt: `Paraphrase the following text in 5 different styles for IELTS writing:

Original: "${text}"

Provide exactly 5 paraphrases with these styles:
1. Concise - Shorter, more direct
2. Formal - More academic register
3. Band-up vocab - Higher-level vocabulary
4. Academic - Sophisticated academic style
5. Expanded - More detailed expression

Each paraphrase should maintain the original meaning while demonstrating the specified style.`,
            temperature: 0.8,
          }),
        GEMINI_RETRY_CONFIG
      )
    )

    return Response.json({ paraphrases: object.paraphrases })
  } catch (error: any) {
    console.error("[v0] Error generating paraphrases:", error)
    
    // Check for rate limit / quota errors
    const errorMessage = error?.message || error?.toString() || ""
    const errorString = errorMessage.toLowerCase()
    
    // Check if it's a missing API key error
    const isMissingApiKeyError = 
      errorString.includes("gemini_api_key") ||
      errorString.includes("api key") && errorString.includes("not set") ||
      errorString.includes("missing") && errorString.includes("api")
    
    if (isMissingApiKeyError) {
      return Response.json({ 
        error: "Missing GEMINI_API_KEY in environment",
        message: "The GEMINI_API_KEY environment variable is not configured. Please set up your API key to use AI features.",
        setupInstructions: "Create a .env.local file in the project root and add: GEMINI_API_KEY=your_api_key_here",
        docsUrl: "https://aistudio.google.com/app/apikey",
        errorType: "MISSING_API_KEY"
      }, { status: 500 })
    }
    
    const isRateLimitError = 
      error?.status === 429 ||
      error?.response?.status === 429 ||
      errorString.includes("too many requests") ||
      errorString.includes("quota") ||
      errorString.includes("rate limit") ||
      errorMessage.includes("429")
    
    if (isRateLimitError) {
      return Response.json({ 
        error: "AI diễn giải đang vượt giới hạn sử dụng. Vui lòng thử lại sau vài phút.",
        errorType: "RATE_LIMIT"
      }, { status: 429 })
    }
    
    return Response.json({ 
      error: "Failed to generate paraphrases",
      errorType: "GENERIC"
    }, { status: 500 })
  }
}
