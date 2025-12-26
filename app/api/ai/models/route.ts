import { NextResponse } from "next/server"
import { createMissingApiKeyResponse, createDiagnosticErrorResponse, diagnoseError } from "@/lib/error-utils"

const GEMINI_MODELS_ENDPOINT = "https://generativelanguage.googleapis.com/v1/models"

interface GeminiModel {
  name?: string
  displayName?: string
  description?: string
  modelState?: string
  supportedGenerationMethods?: string[]
}

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return NextResponse.json(createMissingApiKeyResponse(), { status: 500 })
  }

  try {
    const response = await fetch(`${GEMINI_MODELS_ENDPOINT}?key=${apiKey}`, {
      // cache briefly to avoid hammering the API
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error("[GET /api/ai/models] Failed to list models", response.status, errorBody)
      
      // Create error object for diagnosis
      const error = new Error(`Failed to fetch models: ${errorBody}`)
      ;(error as any).status = response.status
      ;(error as any).responseData = errorBody
      
      const diagnostics = diagnoseError(error)
      console.error("[models] Diagnostic information:", {
        errorType: diagnostics.errorType,
        statusCode: diagnostics.statusCode,
        isCodeIssue: diagnostics.isCodeIssue,
        isApiIssue: diagnostics.isApiIssue,
      })
      
      return NextResponse.json(
        createDiagnosticErrorResponse(error),
        { status: diagnostics.statusCode || 502 },
      )
    }

    const payload = (await response.json()) as { models?: GeminiModel[] }

    const models = (payload.models ?? [])
      .filter((model) =>
        model.supportedGenerationMethods?.includes("generateContent") &&
        (model.modelState ?? "").toUpperCase() !== "STOPPED",
      )
      .map((model) => {
        const id = model.name?.replace(/^models\//, "") ?? ""

        return {
          id,
          displayName: model.displayName ?? (id || "Unnamed model"),
          description: model.description ?? "",
        }
      })
      .filter((model) => model.id)

    if (models.length === 0) {
      return NextResponse.json(
        { error: "No Gemini models available" },
        { status: 404 },
      )
    }

    const defaultModelId = models.find((model) => model.id.includes("flash"))?.id ?? models[0]?.id

    return NextResponse.json({ models, defaultModelId })
  } catch (error: any) {
    console.error("[GET /api/ai/models] Unexpected error", error)
    
    // Diagnose error with detailed information
    const diagnostics = diagnoseError(error)
    
    console.error("[models] Diagnostic information:", {
      errorType: diagnostics.errorType,
      statusCode: diagnostics.statusCode,
      isCodeIssue: diagnostics.isCodeIssue,
      isApiIssue: diagnostics.isApiIssue,
      timestamp: diagnostics.timestamp,
    })
    
    return NextResponse.json(
      createDiagnosticErrorResponse(error),
      { status: diagnostics.statusCode || 500 },
    )
  }
}
