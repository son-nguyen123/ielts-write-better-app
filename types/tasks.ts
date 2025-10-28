import type { Timestamp } from "firebase/firestore"

export type CriterionKey = "TR" | "CC" | "LR" | "GRA"

export interface CriterionFeedback {
  score: number
  strengths: string[]
  issues: string[]
  suggestions: string[]
  examples: string[]
}

export interface TaskFeedback {
  overallBand: number
  summary: string
  criteria: Record<CriterionKey, CriterionFeedback>
  actionItems: string[]
}

export interface TaskDocument {
  id: string
  title?: string
  prompt?: string
  taskType?: string
  response?: string
  status?: string
  overallBand?: number
  feedback?: TaskFeedback
  wordCount?: number
  summary?: string
  actionItems?: string[]
  createdAt?: Timestamp
  updatedAt?: Timestamp
}
