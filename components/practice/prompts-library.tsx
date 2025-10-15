"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const prompts = [
  {
    id: "1",
    type: "Task 2",
    title: "Technology and Society",
    description:
      "Some people believe that technology has made our lives more complex, while others think it has simplified them. Discuss both views and give your own opinion.",
    tags: ["Technology", "Society", "Opinion"],
  },
  {
    id: "2",
    type: "Task 2",
    title: "Education Systems",
    description:
      "In some countries, students are required to learn a foreign language. In others, it is optional. Discuss the advantages and disadvantages of both approaches.",
    tags: ["Education", "Language", "Compare"],
  },
  {
    id: "3",
    type: "Task 2",
    title: "Environmental Issues",
    description:
      "Climate change is one of the biggest threats to our planet. What are the causes of climate change and what measures can be taken to address this issue?",
    tags: ["Environment", "Climate", "Solutions"],
  },
  {
    id: "4",
    type: "Task 2",
    title: "Health and Lifestyle",
    description:
      "Some people think that the government should provide free healthcare, while others believe individuals should pay for their own medical care. Discuss both views.",
    tags: ["Health", "Government", "Opinion"],
  },
  {
    id: "5",
    type: "Task 1",
    title: "Bar Chart: CO2 Emissions",
    description:
      "The bar chart shows the amount of CO2 emissions per capita in different countries from 2000 to 2020. Summarize the information by selecting and reporting the main features.",
    tags: ["Bar Chart", "Environment", "Trends"],
  },
  {
    id: "6",
    type: "Task 1",
    title: "Line Graph: Internet Usage",
    description:
      "The line graph illustrates the percentage of internet users across different age groups from 2010 to 2023. Describe the main trends and make comparisons where relevant.",
    tags: ["Line Graph", "Technology", "Demographics"],
  },
  {
    id: "7",
    type: "Task 1",
    title: "Pie Chart: Energy Sources",
    description:
      "The pie charts compare the sources of energy production in a country in 2000 and 2020. Summarize the information and make comparisons.",
    tags: ["Pie Chart", "Energy", "Comparison"],
  },
  {
    id: "8",
    type: "Task 1",
    title: "Table: Population Growth",
    description:
      "The table shows population growth rates in five different regions from 1990 to 2020. Identify the main features and make relevant comparisons.",
    tags: ["Table", "Demographics", "Statistics"],
  },
]

const allTags = Array.from(new Set(prompts.flatMap((p) => p.tags)))

export function PromptsLibrary() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [previewPrompt, setPreviewPrompt] = useState<(typeof prompts)[0] | null>(null)

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesType = activeTab === "all" || prompt.type === activeTab
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => prompt.tags.includes(tag))
    return matchesType && matchesTags
  })

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleUsePrompt = (promptId: string) => {
    router.push(`/tasks/new?promptId=${promptId}`)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Practice Prompts</h1>
        <p className="text-muted-foreground">Browse and select prompts to practice your IELTS writing</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Prompts</TabsTrigger>
          <TabsTrigger value="Task 1">Task 1</TabsTrigger>
          <TabsTrigger value="Task 2">Task 2</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tag Filters */}
      <Card className="rounded-2xl border-border bg-card mb-6">
        <CardHeader>
          <CardTitle className="text-base">Filter by Topic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prompts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredPrompts.map((prompt) => (
          <Card key={prompt.id} className="rounded-2xl border-border bg-card">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge variant="outline">{prompt.type}</Badge>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="text-lg">{prompt.title}</CardTitle>
              <CardDescription className="line-clamp-2">{prompt.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {prompt.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewPrompt(prompt)}
                  className="flex-1 bg-transparent"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button size="sm" onClick={() => handleUsePrompt(prompt.id)} className="flex-1">
                  Use this prompt
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewPrompt} onOpenChange={() => setPreviewPrompt(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{previewPrompt?.type}</Badge>
            </div>
            <DialogTitle>{previewPrompt?.title}</DialogTitle>
            <DialogDescription className="text-base leading-relaxed pt-4">
              {previewPrompt?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setPreviewPrompt(null)} className="flex-1 bg-transparent">
              Close
            </Button>
            <Button
              onClick={() => {
                if (previewPrompt) handleUsePrompt(previewPrompt.id)
              }}
              className="flex-1"
            >
              Use this prompt
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
