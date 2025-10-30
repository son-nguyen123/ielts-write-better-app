"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, Send } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { createTask } from "@/lib/firebase-firestore"
import type { TaskFeedback } from "@/types/tasks"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { task1Prompts, task2Prompts } from "@/lib/prompt-data"

export function NewTaskForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [taskType, setTaskType] = useState<string>("Task 2")
  const [selectedPrompt, setSelectedPrompt] = useState<string>("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const prompts = taskType === "Task 1" ? task1Prompts : task2Prompts
  const wordCount = response.trim().split(/\s+/).filter(Boolean).length
  const minWords = taskType === "Task 1" ? 150 : 250
  const selectedPromptMeta = useMemo(
    () => prompts.find((prompt) => prompt.id === selectedPrompt),
    [prompts, selectedPrompt],
  )
  const resolvedPrompt = customPrompt.trim() || selectedPromptMeta?.description || ""
  const resolvedTitle = selectedPromptMeta?.title ||
    (resolvedPrompt ? `${taskType} - ${resolvedPrompt.slice(0, 50)}${resolvedPrompt.length > 50 ? "…" : ""}` : `${taskType} Submission`)

  const handleSaveDraft = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Draft saved",
        description: "Your task has been saved as a draft.",
      })
      router.push("/tasks")
    }, 1000)
  }

  const handleSubmit = () => {
    if (wordCount < minWords) {
      toast({
        title: "Word count too low",
        description: `Please write at least ${minWords} words.`,
        variant: "destructive",
      })
      return
    }
    setShowConfirmDialog(true)
  }

  const confirmSubmit = async () => {
    setShowConfirmDialog(false)
    setIsSubmitting(true)

    try {
      if (!user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to submit your task for scoring.",
          variant: "destructive",
        })
        return
      }

      const scoringResponse = await fetch("/api/ai/score-essay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          essay: response,
          taskType,
          prompt: resolvedPrompt,
        }),
      })

      const scoringData = await scoringResponse.json().catch(() => null)

      if (!scoringResponse.ok || !scoringData?.feedback) {
        const errorMessage = scoringData?.error || "Failed to score essay. Please try again."
        toast({
          title: "Scoring failed",
          description: errorMessage,
          variant: "destructive",
        })
        return
      }

      const feedback: TaskFeedback = scoringData.feedback

      const taskId = await createTask(user.uid, {
        title: resolvedTitle,
        prompt: resolvedPrompt,
        promptId: selectedPrompt || null,
        taskType,
        response,
        wordCount,
        status: "scored",
        overallBand: feedback.overallBand,
        summary: feedback.summary,
        feedback,
        actionItems: feedback.actionItems,
      })

      toast({
        title: "Task submitted",
        description: "Your task has been scored successfully.",
      })
      router.push(`/tasks/${taskId}`)
    } catch (error) {
      console.error("[v0] Error submitting task:", error)
      toast({
        title: "Error",
        description: "Failed to submit task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">New Task</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Pick a Prompt */}
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle>Pick a Prompt</CardTitle>
            <CardDescription>Choose a task type and select or create a prompt</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Task Type</Label>
              <Select value={taskType} onValueChange={setTaskType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Task 1">Task 1 (Academic)</SelectItem>
                  <SelectItem value="Task 2">Task 2 (Essay)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select a Prompt</Label>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {prompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => {
                      setSelectedPrompt(prompt.id)
                      setCustomPrompt(prompt.description)
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedPrompt === prompt.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-medium text-sm mb-1">{prompt.title}</p>
                    <p className="text-xs text-muted-foreground">{prompt.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Or paste your own prompt</Label>
              <Textarea
                value={customPrompt}
                onChange={(e) => {
                  setCustomPrompt(e.target.value)
                  setSelectedPrompt("")
                }}
                placeholder="Enter a custom prompt..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Right: Write Response */}
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle>Write Your Response</CardTitle>
            <CardDescription>
              Recommended: ≥ {minWords} words
              {taskType === "Task 1" && " (describe the visual data)"}
              {taskType === "Task 2" && " (present your argument)"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Start writing your response here..."
              className="min-h-[400px] font-mono text-sm"
            />

            <div className="flex items-center justify-between text-sm">
              <span className={wordCount < minWords ? "text-warning" : "text-success"}>
                {wordCount} / {minWords} words
              </span>
              {wordCount < minWords && <span className="text-muted-foreground">Keep writing...</span>}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSaving || !response}
                className="flex-1 bg-transparent"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </>
                )}
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting || !response} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit for Scoring
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit for Scoring?</DialogTitle>
            <DialogDescription>
              Your essay will be analyzed by our AI system. This process typically takes 30-60 seconds. You can view the
              results on the task detail page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button onClick={confirmSubmit}>Confirm Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
