import { generateObject } from "ai"
import { getGoogleModel } from "@/lib/ai"
import { retryWithBackoff, GEMINI_RETRY_CONFIG } from "@/lib/retry-utils"
import { withRateLimit } from "@/lib/server-rate-limiter"
import { createDiagnosticErrorResponse, diagnoseError } from "@/lib/error-utils"
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
    
    // Diagnose error with detailed information
    const diagnostics = diagnoseError(error)
    
    // Log detailed diagnostic information
    console.error("[paraphrase] Diagnostic information:", {
      errorType: diagnostics.errorType,
      statusCode: diagnostics.statusCode,
      isCodeIssue: diagnostics.isCodeIssue,
      isApiIssue: diagnostics.isApiIssue,
      timestamp: diagnostics.timestamp,
    })
    
    // Create diagnostic response
    const diagnosticResponse = createDiagnosticErrorResponse(error)
    
    // Return with appropriate status code
    const statusCode = diagnostics.statusCode || 500
    return Response.json(diagnosticResponse, { status: statusCode })
  }
}
