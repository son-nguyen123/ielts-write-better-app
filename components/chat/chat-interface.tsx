"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { useAiModelSelection } from "@/hooks/use-ai-model-selection"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [attachTask, setAttachTask] = useState(false)
  const [tone, setTone] = useState("neutral")
  const [level, setLevel] = useState("B2")
  const [isLoading, setIsLoading] = useState(false)
  const {
    models,
    selectedModel,
    setSelectedModel,
    isLoading: isLoadingModels,
    error: modelError,
    isReady: isModelReady,
  } = useAiModelSelection()

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          tone,
          level,
          attachedTask: attachTask ? { prompt: "Sample prompt", essay: "Sample essay" } : null,
          model: selectedModel,
        }),
      })

      if (!response.ok) {
        let errorMessage = "Sorry, I couldn't reach the AI right now. Please try again."
        try {
          const data = await response.json()
          if (typeof data?.error === "string" && data.error.trim().length > 0) {
            errorMessage = data.error
          }
        } catch (parseError) {
          console.error("[v0] Failed to parse chat error response:", parseError)
        }
        throw new Error(errorMessage)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("The AI response stream is empty.")
      }

      const decoder = new TextDecoder()
      let assistantMessage = ""
      let buffer = ""
      let streamError: string | null = null
      let streamFinished = false

      const extractText = (payload: unknown): string => {
        if (payload == null) return ""
        if (typeof payload === "string") return payload
        if (Array.isArray(payload)) {
          return payload.map((item) => extractText(item)).join("")
        }
        if (typeof payload === "object") {
          const textLike =
            (payload as { text?: unknown }).text ??
            (payload as { delta?: unknown }).delta ??
            (payload as { textDelta?: unknown }).textDelta ??
            (payload as { value?: unknown }).value

          if (typeof textLike === "string") {
            return textLike
          }

          if ("message" in payload) {
            return extractText((payload as { message?: unknown }).message)
          }

          if ("content" in payload) {
            const content = (payload as { content?: unknown }).content
            if (typeof content === "string") return content
            return extractText(content)
          }
        }
        return ""
      }

      const updateAssistantMessage = (text: string, { replace = false } = {}) => {
        if (!text) return
        assistantMessage = replace ? text : assistantMessage + text
        setMessages((prev) => {
          const newMessages = [...prev]
          if (newMessages[newMessages.length - 1]?.role === "assistant") {
            newMessages[newMessages.length - 1].content = assistantMessage
          } else {
            newMessages.push({ role: "assistant", content: assistantMessage })
          }
          return newMessages
        })
      }

      while (!streamFinished) {
        const { done, value } = await reader.read()
        if (done) {
          streamFinished = true
          buffer += decoder.decode()
        } else if (value) {
          buffer += decoder.decode(value, { stream: true })
        }

        const events = buffer.split("\n\n")
        buffer = events.pop() ?? ""

        for (const event of events) {
          const lines = event
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)

          for (const line of lines) {
            if (!line.startsWith("data:")) continue

            const dataPayload = line.slice(5).trim()
            if (!dataPayload) continue
            if (dataPayload === "[DONE]") {
              streamFinished = true
              break
            }

            let parsed: unknown
            try {
              parsed = JSON.parse(dataPayload)
            } catch (parseError) {
              console.error("[v0] Failed to parse chat stream event:", parseError, dataPayload)
              continue
            }

            if (
              typeof parsed === "object" &&
              parsed !== null &&
              "type" in parsed &&
              typeof (parsed as { type: unknown }).type === "string"
            ) {
              const eventType = (parsed as { type: string }).type

              if (eventType === "error") {
                const errorData = (parsed as { data?: { message?: unknown } }).data
                const message =
                  typeof errorData?.message === "string"
                    ? (errorData.message as string)
                    : "The AI encountered an unexpected error."
                streamError = message
                streamFinished = true
                break
              }

              if (eventType === "text-delta") {
                const text = extractText((parsed as { data?: unknown }).data)
                updateAssistantMessage(text)
              } else if (eventType === "message") {
                const text = extractText((parsed as { data?: unknown }).data ?? parsed)
                updateAssistantMessage(text, { replace: true })
              } else if (eventType === "response-finished") {
                streamFinished = true
                break
              }
            }
          }

          if (streamFinished) {
            break
          }
        }
      }

      if (streamError) {
        throw new Error(streamError)
      }

      if (!assistantMessage) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I couldn't generate a response this time, but please try again with another prompt.",
          },
        ])
      }
    } catch (error) {
      console.error("[v0] Error in chat:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error instanceof Error && error.message
              ? error.message
              : "Sorry, I encountered an error. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">AI Writing Assistant</h1>
        <p className="text-muted-foreground">Get instant help with your IELTS writing</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Messages */}
              <div className="space-y-4 mb-4 min-h-[400px] max-h-[500px] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <div className="rounded-full bg-primary/10 p-6 mb-4">
                      <Bot className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Hi! I'm your IELTS Writing Assistant</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      I can analyze your draft by TR/CC/LR/GRA or help paraphrase sentences. Ask me anything about IELTS
                      writing!
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="rounded-full bg-primary/10 p-2 h-8 w-8 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {message.role === "user" && (
                        <div className="rounded-full bg-accent/10 p-2 h-8 w-8 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-accent" />
                        </div>
                      )}
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="rounded-full bg-primary/10 p-2 h-8 w-8 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="rounded-2xl px-4 py-3 bg-muted">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="space-y-3">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="E.g., 'Rewrite my introduction to better address TR' or 'How can I improve my vocabulary?'"
                  className="min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button onClick={handleSend} disabled={!input.trim() || isLoading} className="flex-1">
                    <Send className="mr-2 h-4 w-4" />
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Context Panel */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="attach-task" className="text-sm">
                  Attach current task
                </Label>
                <Switch id="attach-task" checked={attachTask} onCheckedChange={setAttachTask} />
              </div>
              {attachTask && (
                <Select defaultValue="task-1">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task-1">Technology Essay</SelectItem>
                    <SelectItem value="task-2">Climate Chart</SelectItem>
                    <SelectItem value="task-3">Education Essay</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">Settings</CardTitle>
            </CardHeader>
          <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">AI Model</Label>
                {isModelReady ? (
                  <Select value={selectedModel} onValueChange={setSelectedModel} disabled={isLoadingModels}>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingModels ? "Loading models..." : "Select a model"} />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          <div className="flex flex-col">
                            <span>{model.label}</span>
                            {model.description && (
                              <span className="text-xs text-muted-foreground">{model.description}</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="h-10 w-full animate-pulse rounded-md border border-border bg-muted" />
                )}
                {isLoadingModels && (
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" /> Fetching available models...
                  </p>
                )}
                {modelError && <p className="text-xs text-destructive">{modelError}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="concise">Concise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Level</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B1">B1 (Intermediate)</SelectItem>
                    <SelectItem value="B2">B2 (Upper-Intermediate)</SelectItem>
                    <SelectItem value="C1">C1 (Advanced)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
