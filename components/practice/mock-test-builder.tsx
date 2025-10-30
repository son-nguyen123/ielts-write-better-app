"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { task1Prompts, task2Prompts } from "@/lib/prompt-data"
import { cn } from "@/lib/utils"

const timerOptions = [
  { value: "60", label: "60 minutes" },
  { value: "75", label: "75 minutes" },
  { value: "90", label: "90 minutes" },
]

const deliveryModes = [
  { value: "single-session", label: "Single timed session" },
  { value: "separate-drafts", label: "Create two separate drafts" },
]

const PREFILL_STORAGE_KEY = "mockTestPrefill"

type PrefillState = {
  task1?: string
  task2?: string
}

export function MockTestBuilder() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedTask1, setSelectedTask1] = useState<string>("")
  const [selectedTask2, setSelectedTask2] = useState<string>("")
  const [timerLength, setTimerLength] = useState<string>("60")
  const [deliveryMode, setDeliveryMode] = useState<string>("single-session")

  useEffect(() => {
    const queryTask1 = searchParams?.get("task1")
    const queryTask2 = searchParams?.get("task2")
    const queryTimer = searchParams?.get("timer")
    const queryMode = searchParams?.get("mode")

    if (queryTask1) {
      setSelectedTask1(queryTask1)
    }
    if (queryTask2) {
      setSelectedTask2(queryTask2)
    }
    if (queryTimer && timerOptions.some((option) => option.value === queryTimer)) {
      setTimerLength(queryTimer)
    }
    if (queryMode && deliveryModes.some((option) => option.value === queryMode)) {
      setDeliveryMode(queryMode)
    }
  }, [searchParams])

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const stored = window.localStorage.getItem(PREFILL_STORAGE_KEY)
      if (!stored) return

      const parsed: PrefillState = JSON.parse(stored)
      if (parsed.task1) {
        setSelectedTask1(parsed.task1)
      }
      if (parsed.task2) {
        setSelectedTask2(parsed.task2)
      }

      window.localStorage.removeItem(PREFILL_STORAGE_KEY)
    } catch (error) {
      console.error("[mock-test-builder] Failed to parse mock test prefill", error)
    }
  }, [])

  const selectedTask1Prompt = useMemo(
    () => task1Prompts.find((prompt) => prompt.id === selectedTask1),
    [selectedTask1],
  )
  const selectedTask2Prompt = useMemo(
    () => task2Prompts.find((prompt) => prompt.id === selectedTask2),
    [selectedTask2],
  )

  const handleStartMockTest = () => {
    if (!selectedTask1 || !selectedTask2) return

    const params = new URLSearchParams({
      task1: selectedTask1,
      task2: selectedTask2,
      timer: timerLength,
      mode: deliveryMode,
    })

    router.push(`/practice/mock-tests/run?${params.toString()}`)
  }

  return (
    <div>
      <div className="mb-6 space-y-2">
        <h1 className="text-3xl font-bold">Create a Mock Test</h1>
        <p className="text-muted-foreground">
          Pair a Task 1 and Task 2 prompt, set your timer, and launch a realistic IELTS practice session.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle>Select a Task 1 Prompt</CardTitle>
              <CardDescription>Choose a visual data prompt to start your mock test.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Available prompts</Label>
                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                  {task1Prompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={() => setSelectedTask1(prompt.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border transition-colors",
                        selectedTask1 === prompt.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/40",
                      )}
                    >
                      <p className="font-medium text-sm mb-1">{prompt.title}</p>
                      <p className="text-xs text-muted-foreground">{prompt.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle>Select a Task 2 Prompt</CardTitle>
              <CardDescription>Pick an essay topic to pair with your Task 1 selection.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Available prompts</Label>
                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                  {task2Prompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={() => setSelectedTask2(prompt.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border transition-colors",
                        selectedTask2 === prompt.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/40",
                      )}
                    >
                      <p className="font-medium text-sm mb-1">{prompt.title}</p>
                      <p className="text-xs text-muted-foreground">{prompt.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle>Session Settings</CardTitle>
              <CardDescription>Configure your timer and how you want to deliver the test.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Timer length</Label>
                <Select value={timerLength} onValueChange={setTimerLength}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timer" />
                  </SelectTrigger>
                  <SelectContent>
                    {timerOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Delivery mode</Label>
                <Select value={deliveryMode} onValueChange={setDeliveryMode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select delivery mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryModes.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>Review your mock test before getting started.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="font-medium">Task 1 prompt</p>
                <p className="text-muted-foreground">
                  {selectedTask1Prompt ? selectedTask1Prompt.title : "No prompt selected yet"}
                </p>
              </div>
              <div>
                <p className="font-medium">Task 2 prompt</p>
                <p className="text-muted-foreground">
                  {selectedTask2Prompt ? selectedTask2Prompt.title : "No prompt selected yet"}
                </p>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Timer</span>
                <span>{timerOptions.find((option) => option.value === timerLength)?.label}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Delivery mode</span>
                <span>{deliveryModes.find((option) => option.value === deliveryMode)?.label}</span>
              </div>

              <Button
                className="w-full"
                onClick={handleStartMockTest}
                disabled={!selectedTask1 || !selectedTask2}
              >
                Start mock test
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
