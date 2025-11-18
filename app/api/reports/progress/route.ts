import { NextRequest } from "next/server"
import { getTasks } from "@/lib/firebase-firestore"
import type { TaskDocument } from "@/types/tasks"
import type { ProgressReportData } from "@/types/reports"
import {
  filterTasksByDateRange,
  calculateOverallScoreTrend,
  calculateCriteriaTrends,
  calculateCriteriaBreakdown,
  extractCommonIssues,
  generatePersonalizedFeedback,
  calculateOverallTrendString
} from "@/lib/report-analytics"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { userId, dateRange } = await req.json()

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 })
    }

    if (!dateRange || ![7, 30, 90].includes(dateRange)) {
      return Response.json({ error: "Invalid dateRange. Must be 7, 30, or 90" }, { status: 400 })
    }

    // Fetch all tasks for the user
    const allTasks = (await getTasks(userId)) as TaskDocument[]
    
    // Filter tasks that have been scored (have overallBand)
    const scoredTasks = allTasks.filter(task => 
      task.overallBand !== undefined && 
      task.status === "submitted" &&
      task.createdAt
    )

    if (scoredTasks.length === 0) {
      // Return empty state
      return Response.json({
        overallScoreTrend: [],
        criteriaTrends: { TR: [], CC: [], LR: [], GRA: [] },
        practiceTime: {
          hoursThisWeek: 0,
          hoursThisMonth: 0,
          tasksCompleted: 0
        },
        criteriaBreakdown: {
          range: dateRange === 7 ? "7d" : dateRange === 30 ? "30d" : "90d",
          TR: 0,
          CC: 0,
          LR: 0,
          GRA: 0
        },
        commonIssues: [],
        personalizedFeedback: {
          overallSummary: "No essays submitted yet. Start writing to get personalized feedback!",
          strengths: [],
          weaknesses: [],
          recommendations: []
        },
        overallScoreTrendValue: "+0.0 since start"
      } as ProgressReportData)
    }

    // Filter tasks by date range for specific calculations
    const filteredTasks = filterTasksByDateRange(scoredTasks, dateRange)

    // Calculate all analytics
    const overallScoreTrend = calculateOverallScoreTrend(scoredTasks)
    const criteriaTrends = calculateCriteriaTrends(scoredTasks)
    const criteriaBreakdown = calculateCriteriaBreakdown(scoredTasks, dateRange)
    const commonIssues = extractCommonIssues(scoredTasks, dateRange)
    const personalizedFeedback = generatePersonalizedFeedback(
      filteredTasks, 
      criteriaBreakdown, 
      commonIssues
    )
    const overallScoreTrendValue = calculateOverallTrendString(overallScoreTrend)

    // Calculate practice time metrics
    const practiceTime = calculatePracticeTime(allTasks)

    const reportData: ProgressReportData = {
      overallScoreTrend,
      criteriaTrends,
      practiceTime,
      criteriaBreakdown,
      commonIssues,
      personalizedFeedback,
      overallScoreTrendValue
    }

    return Response.json(reportData)
  } catch (error) {
    console.error("[progress-report] Error:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to generate progress report" },
      { status: 500 }
    )
  }
}

/**
 * Calculate practice time metrics based on tasks
 */
function calculatePracticeTime(tasks: TaskDocument[]) {
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  // Filter tasks by time period
  const tasksThisWeek = tasks.filter(task => {
    if (!task.createdAt) return false
    return task.createdAt.toDate() >= oneWeekAgo
  })

  const tasksThisMonth = tasks.filter(task => {
    if (!task.createdAt) return false
    return task.createdAt.toDate() >= oneMonthAgo
  })

  // Estimate hours based on word count (average 20 words per minute)
  const estimateHours = (taskList: TaskDocument[]) => {
    const totalWords = taskList.reduce((sum, task) => sum + (task.wordCount || 0), 0)
    const minutes = totalWords / 20
    return Math.round((minutes / 60) * 10) / 10
  }

  return {
    hoursThisWeek: estimateHours(tasksThisWeek),
    hoursThisMonth: estimateHours(tasksThisMonth),
    tasksCompleted: tasks.filter(task => task.status === "submitted").length
  }
}
