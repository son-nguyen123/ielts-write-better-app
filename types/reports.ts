// Types for progress reports and analytics

export interface WeeklyScoreData {
  week: number
  score: number
}

export interface CriteriaScoreData {
  week: number
  score: number
}

export interface CommonIssue {
  name: string
  count: number
  trend: "Improving" | "Worsening" | "Stable"
}

export interface CriteriaBreakdown {
  range: "7d" | "30d" | "90d"
  TR: number
  CC: number
  LR: number
  GRA: number
}

export interface PracticeTimeMetrics {
  hoursThisWeek: number
  hoursThisMonth: number
  tasksCompleted: number
}

export interface PersonalizedFeedback {
  overallSummary: string
  strengths: string[]
  weaknesses: string[]
  recommendations: Array<{
    title: string
    description: string
    relatedCriterion: "TR" | "CC" | "LR" | "GRA" | "Overall"
  }>
}

export interface ProgressReportData {
  overallScoreTrend: WeeklyScoreData[]
  criteriaTrends: {
    TR: CriteriaScoreData[]
    CC: CriteriaScoreData[]
    LR: CriteriaScoreData[]
    GRA: CriteriaScoreData[]
  }
  practiceTime: PracticeTimeMetrics
  criteriaBreakdown: CriteriaBreakdown
  commonIssues: CommonIssue[]
  personalizedFeedback: PersonalizedFeedback
  overallScoreTrendValue: string // e.g., "+1.5 since start"
}

export interface ProgressReportRequest {
  userId: string
  dateRange: 7 | 30 | 90
}
