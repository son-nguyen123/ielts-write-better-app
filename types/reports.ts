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
  relatedCriterion?: "TR" | "CC" | "LR" | "GRA"
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
  // New fields for enhanced reporting
  currentOverallAverage: number
  bestRecentScore: number
  totalSubmissions: number
  taskTypeStats: TaskTypeStats[]
  recentSubmissions: RecentSubmission[]
  // First submission scores for baseline comparison
  firstSubmissionScores?: {
    TR: number
    CC: number
    LR: number
    GRA: number
  } | null
  // Target-based recommendations (optional)
  targetBasedRecommendations?: TargetBasedRecommendations
  userTarget?: UserTarget
}

export interface ProgressReportRequest {
  userId: string
  dateRange: 7 | 30 | 90
  taskType?: string // Filter by task type
}

// Target-related types
export interface UserTarget {
  targetOverallBand: number // 5.0 - 8.5
  deadline?: string // ISO date string
  createdAt: string
  updatedAt: string
}

export interface SkillGap {
  current: number
  target: number
  gap: number
  priority: "high" | "medium" | "low"
}

export interface SkillPriority {
  TR: SkillGap
  CC: SkillGap
  LR: SkillGap
  GRA: SkillGap
  primaryWeakSkill: "TR" | "CC" | "LR" | "GRA"
  secondaryWeakSkill: "TR" | "CC" | "LR" | "GRA"
}

export interface RepeatedSuggestion {
  suggestion: string
  count: number
  relatedSkill: "TR" | "CC" | "LR" | "GRA"
}

export interface StudyPlan {
  weeklyTasksRecommended: number
  focusSkills: Array<"TR" | "CC" | "LR" | "GRA">
  taskTypeRecommendations: string[]
  estimatedTimeToTarget: string // e.g., "4-6 weeks"
}

export interface TargetBasedRecommendations {
  skillPriority: SkillPriority
  repeatedSuggestions: RepeatedSuggestion[]
  studyPlan: StudyPlan
}

export interface TaskTypeStats {
  taskType: string
  averageOverall: number
  count: number
}

export interface RecentSubmission {
  id: string
  title: string
  taskType: string
  overallBand: number
  weakestSkill: "TR" | "CC" | "LR" | "GRA"
  weakestSkillScore: number
  keySuggestion: string
  createdAt: string
}
