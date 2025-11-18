"use client"

import type { CriterionKey } from "@/types/tasks"
import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts"

interface RadarChartProps {
  scores?: Partial<Record<CriterionKey, number>>
  target?: number
  isLoading?: boolean
}

const CRITERIA_ORDER: CriterionKey[] = ["TR", "CC", "LR", "GRA"]

const CRITERIA_FULL_NAMES: Record<CriterionKey, string> = {
  TR: "Task Response",
  CC: "Coherence & Cohesion",
  LR: "Lexical Resource",
  GRA: "Grammar & Accuracy"
}

export function RadarChart({ scores, target = 7.5, isLoading }: RadarChartProps) {
  if (isLoading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center text-sm text-muted-foreground">
        Loading your performance…
      </div>
    )
  }

  const hasScores = CRITERIA_ORDER.some((criterion) => typeof scores?.[criterion] === "number")

  if (!hasScores) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center text-center text-sm text-muted-foreground">
        Submit a task to see your IELTS criteria breakdown.
      </div>
    )
  }

  const data = CRITERIA_ORDER.map((criterion) => ({
    criteria: CRITERIA_FULL_NAMES[criterion],
    current: scores?.[criterion] ?? 0,
    target,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsRadar data={data}>
        <PolarGrid stroke="hsl(var(--border))" strokeWidth={1.5} />
        <PolarAngleAxis 
          dataKey="criteria" 
          tick={{ fill: "hsl(var(--foreground))", fontSize: 11, fontWeight: 500 }} 
        />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 9]} 
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          tickCount={10}
        />
        <Radar
          name="Current Score"
          dataKey="current"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.5}
          strokeWidth={2}
        />
        <Radar 
          name="Target Score" 
          dataKey="target" 
          stroke="hsl(var(--accent))" 
          fill="hsl(var(--accent))" 
          fillOpacity={0.2}
          strokeWidth={2}
          strokeDasharray="5 5"
        />
      </RechartsRadar>
    </ResponsiveContainer>
  )
}
