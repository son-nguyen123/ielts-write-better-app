"use client"

import { useMemo, useState, useEffect } from "react"
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
import { ERROR_MESSAGES } from "@/lib/error-messages"
import type { TaskFeedback } from "@/types/tasks"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const task1Prompts = [
  { id: "1", title: "Bar Chart: Global CO2 Emissions", description: "Describe changes in emissions from 2000-2020" },
  { id: "2", title: "Line Graph: Internet Usage", description: "Compare internet usage across age groups" },
  {
    id: "3",
    title: "Pie Chart: Energy Sources",
    description: "Analyze renewable vs non-renewable energy distribution",
  },
]

const task2Prompts = [
  { id: "4", title: "Technology and Society", description: "Discuss the impact of technology on modern life" },
  { id: "5", title: "Education Systems", description: "Compare traditional vs modern education approaches" },
  { id: "6", title: "Environmental Issues", description: "Debate solutions to climate change" },
]

type AIGeneratedPrompt = {
  id: string
  type: "Task 1" | "Task 2"
  title: string
  description: string
  tags: string[]
}

export function NewTaskForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [taskType, setTaskType] = useState<string>("Task 2")
  const [selectedPrompt, setSelectedPrompt] = useState<string>("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [promptTitle, setPromptTitle] = useState("")
  const [response, setResponse] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [aiGeneratedPrompt, setAiGeneratedPrompt] = useState<AIGeneratedPrompt | null>(null)

  // Load AI-generated prompt from sessionStorage on mount
  useEffect(() => {
    const storedPrompt = sessionStorage.getItem("selectedPrompt")
    if (storedPrompt) {
      try {
        const prompt: AIGeneratedPrompt = JSON.parse(storedPrompt)
        setAiGeneratedPrompt(prompt)
        setTaskType(prompt.type)
        setCustomPrompt(prompt.description)
        setPromptTitle(prompt.title)
        setSelectedPrompt("ai-generated")
        // Clear from sessionStorage after loading
        sessionStorage.removeItem("selectedPrompt")
      } catch (error) {
        console.error("Failed to parse stored prompt:", error)
      }
    }
  }, [])

  const prompts = taskType === "Task 1" ? task1Prompts : task2Prompts
  const wordCount = response.trim().split(/\s+/).filter(Boolean).length
  const minWords = taskType === "Task 1" ? 150 : 250
  const selectedPromptMeta = useMemo(
    () => prompts.find((prompt) => prompt.id === selectedPrompt),
    [prompts, selectedPrompt],
  )
  
  // Use AI-generated prompt title if available, otherwise use selected prompt or generate from custom
  const resolvedPrompt = customPrompt.trim() || selectedPromptMeta?.description || ""
  const resolvedTitle = aiGeneratedPrompt?.title || 
    promptTitle ||
    selectedPromptMeta?.title ||
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

      // Call the new essay evaluation API
      const scoringResponse = await fetch("/api/essays/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          essayText: response,
          taskType,
          promptText: resolvedPrompt,
          userId: user.uid,
          promptId: selectedPrompt || null,
        }),
      })

      const data = await scoringResponse.json().catch(() => null)

      if (!scoringResponse.ok || !data?.feedback) {
        // Check for rate limit errors
        let errorTitle = "Lỗi chấm điểm"
        let errorMessage = data?.error || "Không thể chấm điểm bài viết. Vui lòng thử lại."
        let duration = 5000
        
        if (scoringResponse.status === 429 || data?.errorType === "RATE_LIMIT") {
          errorTitle = ERROR_MESSAGES.RATE_LIMIT.TITLE
          errorMessage = data?.error || ERROR_MESSAGES.RATE_LIMIT.MESSAGE
          duration = 10000 // Show longer for rate limit errors
        }
        
        const error: any = new Error(errorMessage)
        error.title = errorTitle
        error.retryable = scoringResponse.status === 429
        error.duration = duration
        throw error
      }

      const scoringData = data

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
        revisionId: scoringData.revisionId,
      })

      toast({
        title: "Nhiệm vụ đã được gửi",
        description: "Bài viết của bạn đã được chấm điểm thành công.",
      })
      router.push(`/tasks/${taskId}`)
    } catch (error: any) {
      console.error("[v0] Error submitting task:", error)
      
      // Provide more helpful error messages
      let errorDescription = error?.message || "Không thể gửi nhiệm vụ. Vui lòng thử lại."
      
      // Add helpful suggestion for rate limit errors
      if (error?.retryable) {
        errorDescription += "\n\n💾 Gợi ý: Lưu bản nháp ngay để không mất nội dung, sau đó thử lại sau 2-3 phút."
      }
      
      toast({
        title: error?.title || "Lỗi",
        description: errorDescription,
        variant: "destructive",
        duration: error?.duration || 7000, // Use custom duration if provided
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="pb-24 sm:pb-20">
      <h1 className="text-3xl font-bold mb-6">New Task</h1>

      <div className="grid lg:grid-cols-2 gap-6 mb-20 sm:mb-16">
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
                {/* Show AI-generated prompt if available */}
                {aiGeneratedPrompt && (
                  <button
                    onClick={() => {
                      setSelectedPrompt("ai-generated")
                      setCustomPrompt(aiGeneratedPrompt.description)
                      setPromptTitle(aiGeneratedPrompt.title)
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedPrompt === "ai-generated"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{aiGeneratedPrompt.title}</p>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                        AI Generated
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{aiGeneratedPrompt.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {aiGeneratedPrompt.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 text-xs rounded bg-secondary text-secondary-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                )}
                
                {prompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => {
                      setSelectedPrompt(prompt.id)
                      setCustomPrompt(prompt.description)
                      setPromptTitle(prompt.title)
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
                  setPromptTitle("")
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
          <CardContent className="space-y-4 pb-8">
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
            <DialogTitle>Gửi bài viết để chấm điểm?</DialogTitle>
            <DialogDescription className="space-y-2">
              <p>
                Bài viết của bạn sẽ được phân tích bởi hệ thống AI. Quá trình này thường mất 30-60 giây.
              </p>
              <p className="text-xs">
                <strong>Lưu ý:</strong> Nếu hệ thống đang bận, yêu cầu của bạn sẽ được xếp hàng và tự động xử lý. 
                Hệ thống sẽ tự động thử lại nếu gặp lỗi giới hạn. Bạn có thể xem kết quả trên trang chi tiết nhiệm vụ.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} className="bg-transparent">
              Hủy
            </Button>
            <Button onClick={confirmSubmit}>Xác nhận gửi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
