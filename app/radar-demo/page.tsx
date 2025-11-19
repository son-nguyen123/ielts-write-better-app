"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadarChart } from "@/components/dashboard/radar-chart"
import type { CriterionKey } from "@/types/tasks"

export default function RadarDemoPage() {
  // Sample data for demonstration
  const sampleScores: Partial<Record<CriterionKey, number>> = {
    TR: 7.5,
    CC: 6.5,
    LR: 8.0,
    GRA: 7.0
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Radar Chart Demo</h1>
        <p className="text-muted-foreground mb-8">
          New colorful radar chart with 4 vibrant colors for each IELTS criterion
        </p>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Performance Across All Criteria</CardTitle>
              <CardDescription>
                Performance visualization with vibrant colors - each criterion has its own distinct color
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadarChart scores={sampleScores} />
              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <h3 className="font-semibold mb-3">Color Scheme:</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'rgba(79, 70, 229, 1)' }}></div>
                    <span className="text-sm">Task Response (Indigo)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'rgba(34, 197, 94, 1)' }}></div>
                    <span className="text-sm">Coherence & Cohesion (Emerald)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'rgba(249, 115, 22, 1)' }}></div>
                    <span className="text-sm">Lexical Resource (Orange)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'rgba(236, 72, 153, 1)' }}></div>
                    <span className="text-sm">Grammar & Accuracy (Pink)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Example 2: Different Score Distribution</CardTitle>
              <CardDescription>
                Another example showing how different scores are visualized
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadarChart scores={{
                TR: 6.0,
                CC: 8.0,
                LR: 5.5,
                GRA: 7.5
              }} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Example 3: High Performance</CardTitle>
              <CardDescription>
                Visualization of high scores across all criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadarChart scores={{
                TR: 8.5,
                CC: 8.0,
                LR: 8.5,
                GRA: 8.0
              }} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
