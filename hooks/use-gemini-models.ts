import { useState, useEffect } from "react"
import type { GeminiModelOption } from "@/types/models"

export function useGeminiModels() {
  const [modelOptions, setModelOptions] = useState<GeminiModelOption[]>([])
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [modelError, setModelError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchModels = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/ai/models")

        if (!response.ok) {
          const { error } = await response.json().catch(() => ({ error: "" }))
          throw new Error(error || "Failed to load Gemini models")
        }

        const data = await response.json()
        const options: GeminiModelOption[] = data.models ?? []

        setModelOptions(options)
        setSelectedModel(data.defaultModelId ?? options[0]?.id ?? "")
        setModelError(null)
      } catch (error) {
        console.error("Failed to load Gemini models", error)
        setModelError(error instanceof Error ? error.message : "Failed to load Gemini models")
      } finally {
        setIsLoading(false)
      }
    }

    fetchModels()
  }, [])

  return {
    modelOptions,
    selectedModel,
    setSelectedModel,
    modelError,
    isLoading,
  }
}
