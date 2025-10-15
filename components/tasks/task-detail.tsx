"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Copy, GitCompare, CheckCircle2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TaskDetailProps {
  taskId: string
}

const mockTask = {
  id: "1",
  title: "Technology and Society Essay",
  type: "Task 2",
  prompt:
    "Some people believe that technology has made our lives more complex, while others think it has simplified them. Discuss both views and give your own opinion.",
  response: `Some people believe that technology has made our lives more complex, while others think it has simplified them. In my opinion, while technology has introduced certain complexities, it has overall made our lives significantly easier.

On one hand, technology can be overwhelming. The constant need to update software, learn new applications, and manage multiple devices can be stressful. Additionally, the abundance of information available online can make decision-making more difficult.

However, technology has simplified many aspects of daily life. Communication has become instant and effortless through smartphones and social media. Tasks that once took hours, such as banking or shopping, can now be completed in minutes online. Furthermore, technology has improved access to education and healthcare, making these essential services more convenient.

In conclusion, despite some added complexity, technology has predominantly simplified our lives by making tasks more efficient and accessible.`,
  overallScore: 7.0,
  scores: {
    tr: 7.0,
    cc: 7.5,
    lr: 6.5,
    gra: 7.0,
  },
  feedback: {
    tr: {
      strengths: ["Clear position stated", "Both views discussed", "Relevant examples provided"],
      issues: ["Could develop ideas more fully", "Some points lack depth"],
      suggestions: [
        "Expand on the complexity argument with specific examples",
        "Add more nuanced discussion of trade-offs",
      ],
    },
    cc: {
      strengths: ["Good paragraph structure", "Effective use of linking words", "Logical flow of ideas"],
      issues: ["Minor repetition in conclusion"],
      suggestions: ["Vary your concluding phrases", "Consider using more sophisticated cohesive devices"],
    },
    lr: {
      strengths: ["Appropriate vocabulary for the topic", "Few spelling errors"],
      issues: ["Limited range of vocabulary", "Some word choices could be more precise"],
      suggestions: ["Use 'facilitate' instead of 'make easier'", "Replace 'things' with more specific nouns"],
    },
    gra: {
      strengths: ["Good variety of sentence structures", "Mostly accurate grammar"],
      issues: ["Occasional comma splices", "Could use more complex sentences"],
      suggestions: ["Review compound sentence punctuation", "Try using more conditional structures"],
    },
  },
  versions: [
    { id: "v1", label: "Original Submission", timestamp: "2 hours ago", type: "user" },
    { id: "v2", label: "AI Suggested Revision", timestamp: "2 hours ago", type: "ai" },
  ],
}

export function TaskDetail({ taskId }: TaskDetailProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("tr")

  const handleCopy = () => {
    navigator.clipboard.writeText(mockTask.response)
    toast({
      title: "Copied",
      description: "Response copied to clipboard.",
    })
  }

  const criteriaLabels = {
    tr: "Task Response",
    cc: "Coherence & Cohesion",
    lr: "Lexical Resource",
    gra: "Grammar & Accuracy",
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
          <h1 className="text-2xl font-bold">{mockTask.title}</h1>
          <p className="text-sm text-muted-foreground">{mockTask.type}</p>
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
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg mt-2">
                <strong>Prompt:</strong> {mockTask.prompt}
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{mockTask.response}</div>
              </div>
            </CardContent>
          </Card>

          {/* Revisions Timeline */}
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle>Revisions Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTask.versions.map((version) => (
                  <div
                    key={version.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className={`rounded-full p-2 ${version.type === "ai" ? "bg-primary/10" : "bg-accent/10"}`}>
                      {version.type === "ai" ? (
                        <span className="text-xs font-bold text-primary">AI</span>
                      ) : (
                        <span className="text-xs font-bold text-accent">You</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{version.label}</p>
                      <p className="text-xs text-muted-foreground">{version.timestamp}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
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
                <div className="text-6xl font-bold text-primary mb-2">{mockTask.overallScore}</div>
                <p className="text-sm text-muted-foreground">
                  Strong performance with room for improvement in vocabulary range
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle>Criteria Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="tr">TR</TabsTrigger>
                  <TabsTrigger value="cc">CC</TabsTrigger>
                  <TabsTrigger value="lr">LR</TabsTrigger>
                  <TabsTrigger value="gra">GRA</TabsTrigger>
                </TabsList>

                {Object.entries(mockTask.feedback).map(([key, data]) => (
                  <TabsContent key={key} value={key} className="space-y-4 mt-4">
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <h3 className="font-semibold">{criteriaLabels[key as keyof typeof criteriaLabels]}</h3>
                      <Badge variant="default" className="text-lg px-3 py-1">
                        {mockTask.scores[key as keyof typeof mockTask.scores]}
                      </Badge>
                    </div>

                    <div className="space-y-3">
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
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
