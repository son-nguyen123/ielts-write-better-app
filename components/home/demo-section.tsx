"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

const sampleEssay = `Some people believe that technology has made our lives more complex, while others think it has simplified them. In my opinion, while technology has introduced certain complexities, it has overall made our lives significantly easier.

On one hand, technology can be overwhelming. The constant need to update software, learn new applications, and manage multiple devices can be stressful. Additionally, the abundance of information available online can make decision-making more difficult.

However, technology has simplified many aspects of daily life. Communication has become instant and effortless through smartphones and social media. Tasks that once took hours, such as banking or shopping, can now be completed in minutes online. Furthermore, technology has improved access to education and healthcare, making these essential services more convenient.

In conclusion, despite some added complexity, technology has predominantly simplified our lives by making tasks more efficient and accessible.`

export function DemoSection() {
  const [text, setText] = useState(sampleEssay)
  const [isScoring, setIsScoring] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)

  const handleRunDemo = async () => {
    setIsScoring(true)
    try {
      const response = await fetch("/api/ai/score-essay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          essay: text,
          taskType: "Task 2",
          prompt:
            "Some people believe that technology has made our lives more complex, while others think it has simplified them. Discuss both views and give your opinion.",
        }),
      })

      const data = await response.json()
      if (data.feedback) {
        setFeedback(data.feedback)
      }
    } catch (error) {
      console.error("[v0] Error scoring essay:", error)
    } finally {
      setIsScoring(false)
    }
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See it in action</h2>
          <p className="text-lg text-muted-foreground">Try our AI scoring with a sample essay</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle>Your Essay</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
                placeholder="Paste your essay here..."
              />
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{text.split(" ").length} words</p>
                <Button onClick={handleRunDemo} disabled={isScoring || !text}>
                  {isScoring ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Run Demo Scoring"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle>AI Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              {!feedback ? (
                <div className="flex items-center justify-center min-h-[300px] text-muted-foreground">
                  Click "Run Demo Scoring" to see AI feedback
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center py-6 border-b border-border">
                    <div className="text-5xl font-bold text-primary mb-2">{feedback.overallBand.toFixed(1)}</div>
                    <p className="text-sm text-muted-foreground">Overall Band Estimate</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Task Response (TR)</span>
                      <Badge variant="default">{feedback.criteria.TR.score.toFixed(1)}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Coherence & Cohesion (CC)</span>
                      <Badge variant="default">{feedback.criteria.CC.score.toFixed(1)}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Lexical Resource (LR)</span>
                      <Badge variant="default">{feedback.criteria.LR.score.toFixed(1)}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Grammar & Accuracy (GRA)</span>
                      <Badge variant="default">{feedback.criteria.GRA.score.toFixed(1)}</Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground leading-relaxed">{feedback.summary}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
