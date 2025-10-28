"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Copy, GitCompare, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-provider"
import { getTask } from "@/lib/firebase-firestore"
import type { CriterionKey, TaskDocument, TaskFeedback } from "@/types/tasks"
import { EmptyState } from "@/components/ui/empty-state"

interface TaskDetailProps {
  taskId: string
}

export function TaskDetail({ taskId }: TaskDetailProps) {
  const { toast } = useToast()
  const { user, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<CriterionKey>("TR")
  const [task, setTask] = useState<TaskDocument | null>(null)
  const [loadingTask, setLoadingTask] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchTask = async () => {
      if (!user) {
        setTask(null)
        setLoadingTask(false)
        return
      }

      setLoadingTask(true)
      setLoadError(null)

      try {
        const data = await getTask(user.uid, taskId)
        if (!isMounted) return
        const typedTask = data as TaskDocument | null
        setTask(typedTask)

        const criteriaKeys = typedTask?.feedback?.criteria
          ? (Object.keys(typedTask.feedback.criteria) as CriterionKey[])
          : []
        if (criteriaKeys.length > 0) {
          setActiveTab(criteriaKeys[0])
        }
      } catch (error) {
        console.error("[v0] Failed to load task:", error)
        if (!isMounted) return
        setLoadError("Unable to load this task. Please try again later.")
      } finally {
        if (isMounted) {
          setLoadingTask(false)
        }
      }
    }

    if (!authLoading) {
      fetchTask()
    }

    return () => {
      isMounted = false
    }
  }, [authLoading, taskId, user])

  const handleCopy = () => {
    if (!task?.response) {
      return
    }
    navigator.clipboard
      .writeText(task.response)
      .then(() => {
        toast({
          title: "Copied",
          description: "Response copied to clipboard.",
        })
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "We couldn't copy the response to your clipboard.",
          variant: "destructive",
        })
      })
  }

  const criteriaLabels: Record<CriterionKey, string> = {
    TR: "Task Response",
    CC: "Coherence & Cohesion",
    LR: "Lexical Resource",
    GRA: "Grammar & Accuracy",
  }

  type CriterionEntry = [CriterionKey, TaskFeedback["criteria"][CriterionKey]]

  const criteriaEntries = useMemo<CriterionEntry[]>(() => {
    if (!task?.feedback?.criteria) {
      return []
    }
    return (Object.entries(task.feedback.criteria) as CriterionEntry[]).filter(([key, value]) => {
      return Boolean(key && value)
    })
  }, [task])

  const overallBand = task?.overallBand ?? task?.feedback?.overallBand ?? null
  const actionItems = useMemo(() => {
    if (Array.isArray(task?.actionItems) && task.actionItems.length > 0) {
      return task.actionItems
    }
    if (Array.isArray(task?.feedback?.actionItems) && task.feedback.actionItems.length > 0) {
      return task.feedback.actionItems
    }
    return []
  }, [task])

  const tabsColumnClass = useMemo(() => {
    const count = Math.max(1, Math.min(criteriaEntries.length, 4))
    switch (count) {
      case 1:
        return "grid-cols-1"
      case 2:
        return "grid-cols-2"
      case 3:
        return "grid-cols-3"
      default:
        return "grid-cols-4"
    }
  }, [criteriaEntries.length])

  useEffect(() => {
    if (criteriaEntries.length > 0) {
      const keys = criteriaEntries.map(([key]) => key)
      if (!keys.includes(activeTab)) {
        setActiveTab(keys[0])
      }
    }
  }, [activeTab, criteriaEntries])

  if (authLoading || loadingTask) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Sign in to view this task"
        description="You need to be signed in to view detailed IELTS feedback."
        action={{
          label: "Go to tasks",
          onClick: () => (window.location.href = "/tasks"),
        }}
      />
    )
  }

  if (loadError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Unable to load task"
        description={loadError}
        action={{
          label: "Back to tasks",
          onClick: () => (window.location.href = "/tasks"),
        }}
      />
    )
  }

  if (!task) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Task not found"
        description="We couldn't find the task you're looking for."
        action={{
          label: "View all tasks",
          onClick: () => (window.location.href = "/tasks"),
        }}
      />
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tasks">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{task.title || `${task.taskType ?? "Task"} Submission`}</h1>
          <p className="text-sm text-muted-foreground">{task.taskType || "IELTS Writing"}</p>
        </div>
        <Link href={`/tasks/${taskId}/compare`}>
          <Button variant="outline" className="bg-transparent">
            <GitCompare className="mr-2 h-4 w-4" />
            Compare Versions
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Response */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Response</CardTitle>
                <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!task.response}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg mt-2">
                <strong>Prompt:</strong> {task.prompt || "No prompt provided"}
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{task.response}</div>
              </div>
            </CardContent>
          </Card>

          {/* Revisions Timeline */}
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle>Revisions Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                No revisions have been recorded for this task yet.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Feedback */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle>Overall Band Estimate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="text-6xl font-bold text-primary mb-2">
                  {typeof overallBand === "number" ? overallBand.toFixed(1) : "-"}
                </div>
                <p className="text-sm text-muted-foreground">
                  {task.summary || task.feedback?.summary || "Submit your task to receive a full IELTS assessment."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle>Criteria Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {criteriaEntries.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Feedback will appear here once the AI has scored your essay.
                </p>
              ) : (
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CriterionKey)}>
                  <TabsList className={`grid ${tabsColumnClass} w-full`}>
                    {criteriaEntries.map(([key]) => (
                      <TabsTrigger key={key} value={key} className="capitalize">
                        {key}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {criteriaEntries.map(([key, data]) => (
                    <TabsContent key={key} value={key} className="space-y-4 mt-4">
                      <div className="flex items-center justify-between pb-3 border-b border-border">
                        <h3 className="font-semibold">{criteriaLabels[key] || key}</h3>
                        <Badge variant="default" className="text-lg px-3 py-1">
                          {typeof data.score === "number" ? data.score.toFixed(1) : "-"}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        {data.strengths?.length ? (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="h-4 w-4 text-success" />
                              <h4 className="text-sm font-medium">Strengths</h4>
                            </div>
                            <ul className="space-y-1 ml-6">
                              {data.strengths.map((item, i) => (
                                <li key={i} className="text-sm text-muted-foreground">
                                  • {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {data.issues?.length ? (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <AlertCircle className="h-4 w-4 text-warning" />
                              <h4 className="text-sm font-medium">Areas for Improvement</h4>
                            </div>
                            <ul className="space-y-1 ml-6">
                              {data.issues.map((item, i) => (
                                <li key={i} className="text-sm text-muted-foreground">
                                  • {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {data.suggestions?.length ? (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Suggestions</h4>
                            <ul className="space-y-1 ml-6">
                              {data.suggestions.map((item, i) => (
                                <li key={i} className="text-sm text-muted-foreground">
                                  • {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {data.examples?.length ? (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Examples from your essay</h4>
                            <ul className="space-y-1 ml-6">
                              {data.examples.map((item, i) => (
                                <li key={i} className="text-sm text-muted-foreground">
                                  • {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle>Action Plan</CardTitle>
            </CardHeader>
            <CardContent>
              {actionItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Focused practice recommendations from the AI will appear here after scoring.
                </p>
              ) : (
                <ul className="space-y-2">
                  {actionItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
