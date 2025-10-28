"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { FileText, Flame, PenLine, MessageSquare, TrendingUp, Target, Loader2 } from "lucide-react"

import { TopNav } from "@/components/navigation/top-nav"
import { SecondaryNav } from "@/components/navigation/secondary-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadarChart } from "@/components/dashboard/radar-chart"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/components/auth/auth-provider"
import { subscribeToTasks } from "@/lib/firebase-firestore"
import type { TaskDocument, CriterionKey } from "@/types/tasks"

const CRITERIA_ORDER: CriterionKey[] = ["TR", "CC", "LR", "GRA"]

const formatTimestamp = (value?: TaskDocument["updatedAt"] | TaskDocument["createdAt"]) => {
  if (!value) {
    return "—"
  }

  try {
    const date = "toDate" in (value as any) ? (value as any).toDate() : new Date(value as unknown as string)
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date)
  } catch (error) {
    console.error("[v0] Failed to format dashboard timestamp:", error)
    return "—"
  }
}

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "scored":
      return "success"
    case "submitted":
      return "default"
    case "draft":
      return "outline"
    default:
      return "outline"
  }
}

const toDayString = (value?: TaskDocument["updatedAt"] | TaskDocument["createdAt"]) => {
  if (!value) {
    return null
  }

  try {
    const date = "toDate" in (value as any) ? (value as any).toDate() : new Date(value as unknown as string)
    return date.toISOString().slice(0, 10)
  } catch (error) {
    console.error("[v0] Failed to normalise day string:", error)
    return null
  }
}

const calculatePracticeStreak = (tasks: TaskDocument[]) => {
  if (!tasks.length) {
    return 0
  }

  const uniqueDays = new Set<string>()
  tasks.forEach((task) => {
    const day = toDayString(task.updatedAt || task.createdAt)
    if (day) {
      uniqueDays.add(day)
    }
  })

  if (!uniqueDays.size) {
    return 0
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let streak = 0
  const ONE_DAY = 24 * 60 * 60 * 1000

  for (let offset = 0; offset < 7; offset++) {
    const day = new Date(today.getTime() - offset * ONE_DAY)
    const dayKey = day.toISOString().slice(0, 10)

    if (uniqueDays.has(dayKey)) {
      streak += 1
    } else {
      break
    }
  }

  return streak
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<TaskDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setTasks([])
      setIsLoading(false)
      setLoadError(null)
      return
    }

    setIsLoading(true)
    setLoadError(null)

    const unsubscribe = subscribeToTasks(
      user.uid,
      (data) => {
        setTasks(data ?? [])
        setIsLoading(false)
        setLoadError(null)
      },
      (error) => {
        console.error("[v0] Dashboard task subscription error:", error)
        setTasks([])
        setIsLoading(false)
        setLoadError("We couldn't load your latest progress. Please try again later.")
      },
    )

    return () => {
      unsubscribe()
    }
  }, [user])

  const latestScoredTask = useMemo(() => {
    return tasks.find((task) => {
      const status = task.status?.toLowerCase()
      const overallBand = task.overallBand ?? task.feedback?.overallBand
      return status === "scored" || typeof overallBand === "number"
    })
  }, [tasks])

  const latestOverallBand = useMemo(() => {
    const band = latestScoredTask?.overallBand ?? latestScoredTask?.feedback?.overallBand
    return typeof band === "number" ? band : null
  }, [latestScoredTask])

  const previousBand = useMemo(() => {
    const previousTask = tasks.find((task) => {
      if (!latestScoredTask || task.id === latestScoredTask.id) {
        return false
      }

      const status = task.status?.toLowerCase()
      const band = task.overallBand ?? task.feedback?.overallBand
      return status === "scored" || typeof band === "number"
    })

    const band = previousTask?.overallBand ?? previousTask?.feedback?.overallBand
    return typeof band === "number" ? band : null
  }, [latestScoredTask, tasks])

  const streak = useMemo(() => calculatePracticeStreak(tasks), [tasks])

  const tasksInProgress = useMemo(() => {
    return tasks.filter((task) => (task.status ?? "").toLowerCase() !== "scored").length
  }, [tasks])

  const recentActivity = useMemo(() => tasks.slice(0, 3), [tasks])

  const radarScores = useMemo(() => {
    const criteria = latestScoredTask?.feedback?.criteria
    if (!criteria) {
      return undefined
    }

    return CRITERIA_ORDER.reduce<Partial<Record<CriterionKey, number>>>((acc, key) => {
      const score = criteria[key]?.score
      if (typeof score === "number") {
        acc[key] = score
      }
      return acc
    }, {})
  }, [latestScoredTask])

  const bandDelta = useMemo(() => {
    if (latestOverallBand == null || previousBand == null) {
      return null
    }
    return latestOverallBand - previousBand
  }, [latestOverallBand, previousBand])

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <TopNav />
        <SecondaryNav />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.displayName || "User"}</h1>
            <p className="text-muted-foreground">
              Your target band: <span className="text-primary font-semibold">7.5</span>. Keep going!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="rounded-2xl border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Latest Overall Score</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading…</span>
                  </div>
                ) : latestOverallBand != null ? (
                  <>
                    <div className="text-3xl font-bold text-primary">{latestOverallBand.toFixed(1)}</div>
                    {bandDelta == null ? (
                      <p className="text-xs text-muted-foreground mt-1">
                        First scored task recorded—keep practicing to track your progress!
                      </p>
                    ) : bandDelta === 0 ? (
                      <p className="text-xs text-muted-foreground mt-1">No change from last task</p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className={bandDelta > 0 ? "text-success" : "text-destructive"}>
                          {bandDelta > 0 ? "+" : ""}
                          {bandDelta.toFixed(1)}
                        </span>{" "}
                        from last task
                      </p>
                    )}
                  </>
                ) : loadError ? (
                  <p className="text-sm text-destructive">{loadError}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Score data will appear after your first AI review.</p>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Practice Streak</CardTitle>
                <Flame className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Calculating…</span>
                  </div>
                ) : (
                  <>
                    <div className="text-3xl font-bold">{streak}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {streak === 1 ? "day in a row" : "days in a row"}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tasks in Progress</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading…</span>
                  </div>
                ) : (
                  <>
                    <div className="text-3xl font-bold">{tasksInProgress}</div>
                    <Link href="/tasks" className="text-xs text-primary hover:underline mt-1 inline-block">
                      View all tasks →
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Progress Chart */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card className="rounded-2xl border-border bg-card">
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>Performance across IELTS criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <RadarChart scores={radarScores} isLoading={isLoading} />
                <Link href="/reports">
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Detailed Reports
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border bg-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest submissions and feedback</CardDescription>
              </CardHeader>
              <CardContent>
                {loadError ? (
                  <p className="text-sm text-destructive">{loadError}</p>
                ) : isLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading your recent activity…</span>
                  </div>
                ) : recentActivity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    You haven't submitted any tasks yet. Create a new task to see your progress here.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((task, index) => {
                      const status = (task.status || "draft").toLowerCase()
                      const statusLabel = status.charAt(0).toUpperCase() + status.slice(1)
                      const band = task.overallBand ?? task.feedback?.overallBand
                      const scoreLabel =
                        typeof band === "number" ? `Scored ${band.toFixed(1)}` : status === "scored" ? "Scored" : statusLabel
                      const isLast = index === recentActivity.length - 1

                      return (
                        <div
                          key={task.id}
                          className={`flex items-start gap-3 ${isLast ? "" : "pb-4 border-b border-border"}`}
                        >
                          <div className="rounded-lg bg-primary/10 p-2">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{task.title || task.prompt || "Untitled Task"}</p>
                            <p className="text-xs text-muted-foreground">
                              {(task.taskType || "Unknown Task Type") + " • " + scoreLabel}
                            </p>
                            <p className="text-xs text-muted-foreground">{formatTimestamp(task.updatedAt || task.createdAt)}</p>
                          </div>
                          <Badge variant={getStatusVariant(status)}>
                            {statusLabel}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Start practicing or get help</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                <Link href="/tasks/new" className="block">
                  <Button className="w-full h-auto py-6 flex-col gap-2">
                    <PenLine className="h-6 w-6" />
                    <span>New Task</span>
                  </Button>
                </Link>

                <Link href="/practice/prompts" className="block">
                  <Button variant="outline" className="w-full h-auto py-6 flex-col gap-2 bg-transparent">
                    <FileText className="h-6 w-6" />
                    <span>Pick a Prompt</span>
                  </Button>
                </Link>

                <Link href="/chat" className="block">
                  <Button variant="outline" className="w-full h-auto py-6 flex-col gap-2 bg-transparent">
                    <MessageSquare className="h-6 w-6" />
                    <span>Open Chatbot</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
