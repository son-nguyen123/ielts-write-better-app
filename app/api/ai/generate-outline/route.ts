import { generateObject } from "ai"
import { getGoogleModel } from "@/lib/ai"
import { retryWithBackoff, GEMINI_RETRY_CONFIG } from "@/lib/retry-utils"
import { withRateLimit } from "@/lib/server-rate-limiter"
import { createDiagnosticErrorResponse, diagnoseError } from "@/lib/error-utils"
import { z } from "zod"

export const maxDuration = 30

const outlineSchema = z.object({
  introduction: z.object({
    hook: z.string(),
    background: z.string(),
    thesis: z.string(),
  }),
  body1: z.object({
    topic: z.string(),
    points: z.array(z.string()),
  }),
  body2: z.object({
    topic: z.string(),
    points: z.array(z.string()),
  }),
  counterArgument: z.object({
    point: z.string(),
    rebuttal: z.string(),
  }),
  conclusion: z.object({
    summary: z.string(),
    finalThought: z.string(),
  }),
})

export async function POST(req: Request) {
  try {
    const { topic, targetBand } = await req.json()

    if (!topic) {
      return Response.json({ error: "Topic is required" }, { status: 400 })
    }

    // Use server-side rate limiting to prevent quota exhaustion
    const { object } = await withRateLimit(() =>
      retryWithBackoff(
        () =>
          generateObject({
            model: getGoogleModel(),
            schema: outlineSchema,
            prompt: `Create a detailed essay outline for an IELTS Task 2 essay targeting band ${targetBand || "7.0"}.

Topic: "${topic}"

Generate a complete outline with:
1. Introduction (hook, background, thesis statement)
2. Body Paragraph 1 (topic sentence + 3 supporting points)
3. Body Paragraph 2 (topic sentence + 3 supporting points)
4. Counter-argument (opposing view + rebuttal)
5. Conclusion (summary + final thought)

Make it specific to the topic and appropriate for the target band score.`,
            temperature: 0.7,
          }),
        GEMINI_RETRY_CONFIG
      )
    )

    return Response.json({ outline: object })
  } catch (error: any) {
    console.error("[v0] Error generating outline:", error)
    
    // Diagnose error with detailed information
    const diagnostics = diagnoseError(error)
    
    // Log detailed diagnostic information
    console.error("[generate-outline] Diagnostic information:", {
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
