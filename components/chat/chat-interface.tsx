"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Send, Bot, User } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { addChatMessage, listenToChatMessages } from "@/lib/firebase-firestore"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id?: string
  role: "user" | "assistant"
  content: string
}

export function ChatInterface() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [attachTask, setAttachTask] = useState(false)
  const [tone, setTone] = useState("neutral")
  const [level, setLevel] = useState("B2")
  const [isLoading, setIsLoading] = useState(false)
  const [modelId, setModelId] = useState("gemini-2.0-flash")
  const { toast } = useToast()

  useEffect(() => {
    if (!user) {
      setMessages([])
      return
    }

    const unsubscribe = listenToChatMessages(user.uid, (chatMessages) => {
      setMessages(
        chatMessages.map(({ id, role, content }) => ({
          id,
          role,
          content,
        }))
      )
    })

    return () => unsubscribe()
  }, [user])

  const handleSend = async () => {
    if (!input.trim()) return
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save and continue your chat history.",
        variant: "destructive",
      })
      return
    }

    const trimmedInput = input.trim()
    const userMessage: Message = { role: "user", content: trimmedInput }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      await addChatMessage(user.uid, userMessage)

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          tone,
          level,
          modelId,
          attachedTask: attachTask ? { prompt: "Sample prompt", essay: "Sample essay" } : null,
        }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("0:")) {
              const text = line.slice(3, -1)
              assistantMessage += text
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
          }
        }
      }

      if (assistantMessage.trim()) {
        await addChatMessage(user.uid, { role: "assistant", content: assistantMessage.trim() })
      }
    } catch (error) {
      console.error("[v0] Error in chat:", error)
      const errorMessage = "Sorry, I encountered an error. Please try again."
      setMessages((prev) => [...prev, { role: "assistant", content: errorMessage }])
      if (user) {
        await addChatMessage(user.uid, { role: "assistant", content: errorMessage })
      }
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
                      {user
                        ? "I can analyze your draft by TR/CC/LR/GRA or help paraphrase sentences. Ask me anything about IELTS writing!"
                        : "Sign in to start chatting and keep your conversation history synced across devices."}
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={message.id ?? index}
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
                  disabled={!user}
                />
                <div className="flex gap-2">
                  <Button onClick={handleSend} disabled={!input.trim() || isLoading || !user} className="flex-1">
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
                <Label className="text-sm">Model</Label>
                <Select value={modelId} onValueChange={setModelId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                    <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                    <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                  </SelectContent>
                </Select>
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
