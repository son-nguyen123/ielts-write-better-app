"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { DEFAULT_GOOGLE_MODEL } from "@/lib/ai"

interface ApiModel {
  id: string
  model: string
  displayName: string
  description?: string
  inputTokenLimit?: number
  outputTokenLimit?: number
}

interface AiModelOption {
  value: string
  label: string
  description?: string
  inputTokenLimit?: number
  outputTokenLimit?: number
}

const STORAGE_KEY = "preferred-ai-model"

export function useAiModelSelection() {
  const [models, setModels] = useState<AiModelOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setSelectedModel(stored)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    let active = true

    async function loadModels() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/ai/models")
        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || "Failed to load AI models")
        }

        const data = (await response.json()) as { models?: ApiModel[] }
        const options: AiModelOption[] = (data.models ?? []).map((model) => ({
          value: model.model,
          label: model.displayName || model.model,
          description: model.description,
          inputTokenLimit: model.inputTokenLimit,
          outputTokenLimit: model.outputTokenLimit,
        }))

        if (!options.some((option) => option.value === DEFAULT_GOOGLE_MODEL)) {
          options.unshift({
            value: DEFAULT_GOOGLE_MODEL,
            label: "Gemini 2.5 Flash (Image)",
            description: "Default fast multimodal model",
          })
        }

        if (!active) {
          return
        }

        setModels(options)

        setSelectedModel((current) => {
          if (current && options.some((option) => option.value === current)) {
            return current
          }
          return options[0]?.value ?? DEFAULT_GOOGLE_MODEL
        })
      } catch (err) {
        if (!active) {
          return
        }
        const message = err instanceof Error ? err.message : "Failed to load AI models"
        setError(message)
        setModels((options) => {
          if (options.length > 0) {
            return options
          }
          return [
            {
              value: DEFAULT_GOOGLE_MODEL,
              label: "Gemini 2.5 Flash (Image)",
              description: "Default fast multimodal model",
            },
          ]
        })
        setSelectedModel((current) => current ?? DEFAULT_GOOGLE_MODEL)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadModels()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || !selectedModel) {
      return
    }
    window.localStorage.setItem(STORAGE_KEY, selectedModel)
  }, [selectedModel])

  const onChange = useCallback((value: string) => {
    setSelectedModel(value)
  }, [])

  const modelMap = useMemo(() => {
    return models.reduce<Record<string, AiModelOption>>((acc, option) => {
      acc[option.value] = option
      return acc
    }, {})
  }, [models])

  return {
    models,
    selectedModel: selectedModel ?? DEFAULT_GOOGLE_MODEL,
    setSelectedModel: onChange,
    isLoading: loading,
    error,
    modelDetails: modelMap[selectedModel ?? DEFAULT_GOOGLE_MODEL] ?? null,
    isReady: hydrated && !loading,
  }
}
