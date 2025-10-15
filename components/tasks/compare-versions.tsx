"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, WrapText } from "lucide-react"

interface CompareVersionsProps {
  taskId: string
}

const versions = [
  { id: "v1", label: "Original Submission" },
  { id: "v2", label: "AI Suggested Revision" },
  { id: "v3", label: "User Edit v2" },
]

const versionTexts = {
  v1: `Some people believe that technology has made our lives more complex, while others think it has simplified them. In my opinion, while technology has introduced certain complexities, it has overall made our lives significantly easier.

On one hand, technology can be overwhelming. The constant need to update software, learn new applications, and manage multiple devices can be stressful.

However, technology has simplified many aspects of daily life. Communication has become instant through smartphones.`,
  v2: `Some people believe that technology has made our lives more complex, while others think it has simplified them. In my opinion, while technology has introduced certain complexities, it has predominantly facilitated our daily activities.

On one hand, technology can be overwhelming. The constant requirement to update software, master new applications, and manage multiple devices can be stressful.

However, technology has simplified many aspects of daily life. Communication has become instantaneous and effortless through smartphones and social media platforms.`,
  v3: `Some people believe that technology has made our lives more complex, while others think it has simplified them. In my opinion, while technology has introduced certain complexities, it has predominantly made our lives more efficient.

On one hand, technology can be overwhelming. The constant need to update software, learn new applications, and manage multiple devices can be stressful.

However, technology has simplified many aspects of daily life. Communication has become instant and seamless through smartphones and social media.`,
}

export function CompareVersions({ taskId }: CompareVersionsProps) {
  const [versionA, setVersionA] = useState("v1")
  const [versionB, setVersionB] = useState("v2")
  const [wrapText, setWrapText] = useState(true)

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/tasks/${taskId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold flex-1">Compare Versions</h1>
        <Button variant="outline" size="icon" onClick={() => setWrapText(!wrapText)} className="bg-transparent">
          <WrapText className="h-4 w-4" />
        </Button>
      </div>

      <Card className="rounded-2xl border-border bg-card mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Version A</label>
              <Select value={versionA} onValueChange={setVersionA}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {versions.map((v) => (
                    <SelectItem key={v.id} value={v.id} disabled={v.id === versionB}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Version B</label>
              <Select value={versionB} onValueChange={setVersionB}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {versions.map((v) => (
                    <SelectItem key={v.id} value={v.id} disabled={v.id === versionA}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">{versions.find((v) => v.id === versionA)?.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`font-mono text-sm leading-relaxed ${wrapText ? "whitespace-pre-wrap" : "whitespace-pre overflow-x-auto"}`}
            >
              {versionTexts[versionA as keyof typeof versionTexts]}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">{versions.find((v) => v.id === versionB)?.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`font-mono text-sm leading-relaxed ${wrapText ? "whitespace-pre-wrap" : "whitespace-pre overflow-x-auto"}`}
            >
              {versionTexts[versionB as keyof typeof versionTexts]}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-border bg-card">
        <CardHeader>
          <CardTitle>Key Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="text-sm">
              <span className="text-destructive line-through">significantly easier</span> →{" "}
              <span className="text-success">predominantly facilitated</span>
              <span className="text-muted-foreground ml-2">(More sophisticated vocabulary)</span>
            </li>
            <li className="text-sm">
              <span className="text-destructive line-through">constant need</span> →{" "}
              <span className="text-success">constant requirement</span>
              <span className="text-muted-foreground ml-2">(More formal register)</span>
            </li>
            <li className="text-sm">
              <span className="text-destructive line-through">instant</span> →{" "}
              <span className="text-success">instantaneous and effortless</span>
              <span className="text-muted-foreground ml-2">(Enhanced description)</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
