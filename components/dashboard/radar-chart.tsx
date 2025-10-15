"use client"

import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts"

const data = [
  { criteria: "TR", current: 7.0, target: 7.5 },
  { criteria: "CC", current: 7.5, target: 7.5 },
  { criteria: "LR", current: 6.5, target: 7.5 },
  { criteria: "GRA", current: 7.0, target: 7.5 },
]

export function RadarChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsRadar data={data}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis dataKey="criteria" tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }} />
        <PolarRadiusAxis angle={90} domain={[0, 9]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
        <Radar
          name="Current"
          dataKey="current"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.6}
        />
        <Radar name="Target" dataKey="target" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.3} />
      </RechartsRadar>
    </ResponsiveContainer>
  )
}
