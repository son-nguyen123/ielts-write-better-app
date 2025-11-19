"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Award, FileText, Target } from "lucide-react"

interface OverviewCardsProps {
  currentAverage: number
  bestRecentScore: number
  totalSubmissions: number
  gapToTarget?: number
}

export function OverviewCards({ 
  currentAverage, 
  bestRecentScore, 
  totalSubmissions,
  gapToTarget 
}: OverviewCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Current Average */}
      <Card className="rounded-xl border-border bg-card hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Average</p>
              <p className="text-3xl font-bold mt-2">{currentAverage.toFixed(1)}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Recent Score */}
      <Card className="rounded-xl border-border bg-card hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Best Recent Score</p>
              <p className="text-3xl font-bold mt-2">{bestRecentScore.toFixed(1)}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
              <Award className="h-6 w-6 text-success" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Submissions */}
      <Card className="rounded-xl border-border bg-card hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
              <p className="text-3xl font-bold mt-2">{totalSubmissions}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-accent" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gap to Target */}
      {gapToTarget !== undefined && (
        <Card className="rounded-xl border-border bg-card hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gap to Target</p>
                <p className={`text-3xl font-bold mt-2 ${gapToTarget > 0 ? 'text-warning' : 'text-success'}`}>
                  {gapToTarget > 0 ? '+' : ''}{gapToTarget.toFixed(1)}
                </p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                gapToTarget > 0 ? 'bg-warning/10' : 'bg-success/10'
              }`}>
                <Target className={`h-6 w-6 ${gapToTarget > 0 ? 'text-warning' : 'text-success'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
