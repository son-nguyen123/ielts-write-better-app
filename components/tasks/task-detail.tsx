"use client"

import type { ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Copy, GitCompare, CheckCircle2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-provider"
import { getTask } from "@/lib/firebase-firestore"

interface TaskDetailProps {
  taskId: string
}

export function TaskDetail({ taskId }: TaskDetailProps) {
  const { toast } = useToast()
  const { user, loading: authLoading } = useAuth()
  const [task, setTask] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("tr")

  useEffect(() => {
    let isMounted = true

    if (authLoading) {
      return () => {
        isMounted = false
      }
    }

    if (!user) {
      if (isMounted) {
        setTask(null)
        setError("You need to be signed in to view this task.")
        setLoading(false)
      }
      return () => {
        isMounted = false
      }
    }

    const fetchTask = async () => {
      if (!isMounted) return

      setLoading(true)
      setError(null)

      try {
        const fetchedTask = await getTask(user.uid, taskId)

        if (!isMounted) {
          return
        }

        if (!fetchedTask) {
          setTask(null)
          setError("We couldn't find that task. It may have been deleted.")
        } else {
          setTask(fetchedTask)
        }
      } catch (err) {
        console.error("Failed to load task", err)
        if (isMounted) {
          setError("We couldn't load this task. Please try again later.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchTask()

    return () => {
      isMounted = false
    }
  }, [user, authLoading, taskId])

  const normalizeCriteriaKey = (key: string) => {
    const normalized = key.toLowerCase().replace(/[^a-z]/g, "")

    if (normalized === "tr" || normalized.includes("taskresponse")) return "tr"
    if (normalized === "cc" || normalized.includes("coherence") || normalized.includes("cohesion")) return "cc"
    if (normalized === "lr" || normalized.includes("lexical")) return "lr"
    if (normalized === "gra" || normalized.includes("grammar")) return "gra"

    return key
  }

  const toArray = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === "string")
    }

    if (typeof value === "string" && value.trim().length > 0) {
      return [value]
    }

    return []
  }

  const criteriaFeedback = useMemo(() => {
    const rawCriteria =
      task?.feedback?.criteria ?? task?.feedback ?? task?.criteria ?? null

    if (!rawCriteria || typeof rawCriteria !== "object") {
      return {}
    }

    return Object.entries(rawCriteria as Record<string, any>).reduce(
      (acc, [key, value]) => {
        if (!value || typeof value !== "object") {
          return acc
        }

        const normalizedKey = normalizeCriteriaKey(key)

        const score =
          value.score ??
          value.band ??
          value.value ??
          value.rating ??
          value.overall ??
          value.grade ??
          null

        acc[normalizedKey] = {
          score,
          strengths: toArray(value.strengths ?? value.positives ?? value.highlights),
          issues: toArray(value.issues ?? value.improvements ?? value.weaknesses ?? value.challenges),
          suggestions: toArray(value.suggestions ?? value.actions ?? value.recommendations ?? value.nextSteps),
        }

        return acc
      },
      {} as Record<string, { score: number | null; strengths: string[]; issues: string[]; suggestions: string[] }>,
    )
  }, [task])

  const criteriaKeys = Object.keys(criteriaFeedback)

  useEffect(() => {
    if (criteriaKeys.length === 0) {
      return
    }

    if (!criteriaKeys.includes(activeTab)) {
      setActiveTab(criteriaKeys[0])
    }
  }, [criteriaKeys, activeTab])

  const handleCopy = () => {
    if (!task?.response) {
      return
    }

    navigator.clipboard.writeText(task.response)
    toast({
      title: "Copied",
      description: "Response copied to clipboard.",
    })
  }

  const criteriaLabels: Record<string, string> = {
    tr: "Task Response",
    cc: "Coherence & Cohesion",
    lr: "Lexical Resource",
    gra: "Grammar & Accuracy",
  }

  const taskTitle = task?.title || task?.promptTitle || (loading ? "Loading task..." : "Task")
  const taskType = task?.type || task?.promptType || ""
  const promptText = task?.prompt || task?.promptText || task?.promptTitle || ""
  const responseText = task?.response || ""

  const overallScore =
    task?.overallScore ?? task?.score ?? task?.feedback?.overallBand ?? task?.feedback?.score ?? null

  const versions: Array<{
    id: string
    label: string
    timestamp?: string
    type?: string
  }> = Array.isArray(task?.versions) ? task?.versions : []

  let content: ReactNode = null

  if (loading) {
    content = (
      <Card className="rounded-2xl border-border bg-card">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Loading your task...
        </CardContent>
      </Card>
    )
  } else if (error) {
    content = (
      <Card className="rounded-2xl border-border bg-card">
        <CardContent className="py-10 text-center text-sm text-destructive">{error}</CardContent>
      </Card>
    )
  } else if (!task) {
    content = (
      <Card className="rounded-2xl border-border bg-card">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          No task data to display.
        </CardContent>
      </Card>
    )
  } else {
    content = (
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Response */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Response</CardTitle>
                <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!responseText}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg mt-2">
                <strong>Prompt:</strong> {promptText || "Prompt unavailable"}
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                {responseText ? (
                  <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{responseText}</div>
                ) : (
                  <p className="text-sm text-muted-foreground">No response saved for this task yet.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Revisions Timeline */}
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle>Revisions Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {versions.length > 0 ? (
                <div className="space-y-3">
                  {versions.map((version) => (
                    <div
                      key={version.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div
                        className={`rounded-full p-2 ${
                          version.type === "ai" ? "bg-primary/10" : "bg-accent/10"
                        }`}
                      >
                        {version.type === "ai" ? (
                          <span className="text-xs font-bold text-primary">AI</span>
                        ) : (
                          <span className="text-xs font-bold text-accent">You</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{version.label}</p>
                        <p className="text-xs text-muted-foreground">{version.timestamp || ""}</p>
                      </div>
                      <Button variant="ghost" size="sm" disabled>
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No revisions recorded yet.</p>
              )}
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
                  {overallScore !== null ? overallScore : "-"}
                </div>
                <p className="text-sm text-muted-foreground">
                  {task?.summary || "Review the detailed feedback below to continue improving."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle>Criteria Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {criteriaKeys.length > 0 ? (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4 w-full">
                    {criteriaKeys.map((key) => (
                      <TabsTrigger key={key} value={key}>
                        {(key.length <= 3 ? key : key.slice(0, 3)).toUpperCase()}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {criteriaKeys.map((key) => {
                    const data = criteriaFeedback[key]
                    const label = criteriaLabels[key] || key

                    return (
                      <TabsContent key={key} value={key} className="space-y-4 mt-4">
                        <div className="flex items-center justify-between pb-3 border-b border-border">
                          <h3 className="font-semibold">{label}</h3>
                          {data?.score !== null && data?.score !== undefined ? (
                            <Badge variant="default" className="text-lg px-3 py-1">
                              {data.score}
                            </Badge>
                          ) : null}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="h-4 w-4 text-success" />
                              <h4 className="text-sm font-medium">Strengths</h4>
                            </div>
                            {data?.strengths?.length ? (
                              <ul className="space-y-1 ml-6">
                                {data.strengths.map((item, i) => (
                                  <li key={i} className="text-sm text-muted-foreground">
                                    • {item}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-muted-foreground ml-6">No strengths provided.</p>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <AlertCircle className="h-4 w-4 text-warning" />
                              <h4 className="text-sm font-medium">Areas for Improvement</h4>
                            </div>
                            {data?.issues?.length ? (
                              <ul className="space-y-1 ml-6">
                                {data.issues.map((item, i) => (
                                  <li key={i} className="text-sm text-muted-foreground">
                                    • {item}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-muted-foreground ml-6">No issues provided.</p>
                            )}
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Suggestions</h4>
                            {data?.suggestions?.length ? (
                              <ul className="space-y-1 ml-6">
                                {data.suggestions.map((item, i) => (
                                  <li key={i} className="text-sm text-muted-foreground">
                                    • {item}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-muted-foreground ml-6">No suggestions provided.</p>
                            )}
                          </div>
                        </div>
                      </TabsContent>
                    )
                  })}
                </Tabs>
              ) : (
                <p className="text-sm text-muted-foreground">No feedback available yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
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
          <h1 className="text-2xl font-bold">{taskTitle}</h1>
          {taskType ? <p className="text-sm text-muted-foreground">{taskType}</p> : null}
        </div>
        {task ? (
          <Link href={`/tasks/${taskId}/compare`}>
            <Button variant="outline" className="bg-transparent">
              <GitCompare className="mr-2 h-4 w-4" />
              Compare Versions
            </Button>
          </Link>
        ) : (
          <Button variant="outline" className="bg-transparent" disabled>
            <GitCompare className="mr-2 h-4 w-4" />
            Compare Versions
          </Button>
        )}
      </div>

      {content}
    </div>
  )
}
