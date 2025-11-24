"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"
import type { SkillPriority } from "@/types/reports"

const CRITERIA_NAMES = {
  TR: "Task Response",
  CC: "Coherence & Cohesion",
  LR: "Lexical Resource",
  GRA: "Grammar & Accuracy"
}

interface GapToTargetTableProps {
  currentAverage: number
  targetBand: number
  skillPriority: SkillPriority
}

export function GapToTargetTable({ 
  currentAverage, 
  targetBand,
  skillPriority 
}: GapToTargetTableProps) {
  const overallGap = targetBand - currentAverage
  const skills = ["TR", "CC", "LR", "GRA"] as const

  const getGapStatus = (gap: number) => {
    if (gap <= 0) return { status: "achieved", color: "text-success", bgColor: "bg-success/10", icon: CheckCircle2 }
    if (gap <= 0.5) return { status: "close", color: "text-primary", bgColor: "bg-primary/10", icon: TrendingUp }
    if (gap <= 1.0) return { status: "moderate", color: "text-warning", bgColor: "bg-warning/10", icon: AlertCircle }
    return { status: "significant", color: "text-destructive", bgColor: "bg-destructive/10", icon: AlertCircle }
  }

  const overallStatus = getGapStatus(overallGap)

  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Gap to Target</CardTitle>
        </div>
        <CardDescription>
          Visual breakdown of your progress toward band {targetBand.toFixed(1)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Gap Summary */}
        <div className={`p-4 rounded-lg border ${overallStatus.bgColor} ${overallStatus.color} border-current/20`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <overallStatus.icon className="h-5 w-5" />
              <h3 className="font-semibold text-lg">Overall Progress</h3>
            </div>
            <Badge 
              variant={overallGap <= 0 ? "default" : "outline"}
              className={overallGap <= 0 ? "bg-success text-white" : ""}
            >
              {overallGap <= 0 ? "Target Achieved!" : "In Progress"}
            </Badge>
          </div>
          <div className="flex items-baseline gap-3">
            <div>
              <p className="text-sm opacity-80">Current</p>
              <p className="text-3xl font-bold">{currentAverage.toFixed(1)}</p>
            </div>
            <div className="text-2xl opacity-50">→</div>
            <div>
              <p className="text-sm opacity-80">Target</p>
              <p className="text-3xl font-bold">{targetBand.toFixed(1)}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm opacity-80">Gap</p>
              <p className="text-3xl font-bold">
                {overallGap > 0 ? '+' : ''}{overallGap.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Skill-by-Skill Breakdown */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Skill Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-semibold">Criterion</th>
                  <th className="text-center py-3 px-2 font-semibold">Current</th>
                  <th className="text-center py-3 px-2 font-semibold">Target</th>
                  <th className="text-center py-3 px-2 font-semibold">Gap</th>
                  <th className="text-center py-3 px-2 font-semibold">Priority</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((skill) => {
                  const skillData = skillPriority[skill]
                  const gapStatus = getGapStatus(skillData.gap)
                  
                  return (
                    <tr 
                      key={skill} 
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <gapStatus.icon className={`h-4 w-4 ${gapStatus.color}`} />
                          <span className="font-medium">{CRITERIA_NAMES[skill]}</span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className="font-semibold">{skillData.current.toFixed(1)}</span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className="font-semibold">{skillData.target.toFixed(1)}</span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className={`font-bold ${gapStatus.color}`}>
                          {skillData.gap > 0 ? '+' : ''}{skillData.gap.toFixed(1)}
                        </span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <Badge
                          variant={
                            skillData.priority === "high" ? "destructive" :
                            skillData.priority === "medium" ? "default" : "outline"
                          }
                          className="text-xs"
                        >
                          {skillData.priority.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Summary */}
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm">
            <strong>Focus on:</strong> {CRITERIA_NAMES[skillPriority.primaryWeakSkill]} 
            {skillPriority.secondaryWeakSkill && (
              <> and {CRITERIA_NAMES[skillPriority.secondaryWeakSkill]}</>
            )} 
            {" "}to close the gap most efficiently.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
