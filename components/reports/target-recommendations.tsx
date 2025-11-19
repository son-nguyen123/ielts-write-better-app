"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, Target, TrendingUp } from "lucide-react"
import type { StudyPlan, RepeatedSuggestion } from "@/types/reports"

const CRITERIA_NAMES = {
  TR: "Task Response",
  CC: "Coherence & Cohesion",
  LR: "Lexical Resource",
  GRA: "Grammar & Accuracy"
}

interface TargetRecommendationsProps {
  studyPlan: StudyPlan
  repeatedSuggestions: RepeatedSuggestion[]
}

export function TargetRecommendations({ studyPlan, repeatedSuggestions }: TargetRecommendationsProps) {
  return (
    <div className="space-y-6">
      {/* Study Plan */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Personalized Study Plan</CardTitle>
          </div>
          <CardDescription>Recommended practice schedule to reach your target</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Weekly Tasks */}
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Practice Frequency</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Write <strong>{studyPlan.weeklyTasksRecommended} essays per week</strong> to maintain steady progress
            </p>
          </div>

          {/* Focus Skills */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Target className="h-4 w-4" />
              Focus Areas
            </h3>
            <div className="flex flex-wrap gap-2">
              {studyPlan.focusSkills.map((skill) => (
                <Badge key={skill} variant="default" className="text-sm">
                  {CRITERIA_NAMES[skill]}
                </Badge>
              ))}
            </div>
          </div>

          {/* Task Type Recommendations */}
          {studyPlan.taskTypeRecommendations.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Task Type Recommendations</h3>
              <ul className="space-y-1">
                {studyPlan.taskTypeRecommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Estimated Time */}
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-semibold">Estimated Time to Target</h3>
            </div>
            <p className="text-sm text-muted-foreground">{studyPlan.estimatedTimeToTarget}</p>
          </div>
        </CardContent>
      </Card>

      {/* Repeated Suggestions */}
      {repeatedSuggestions.length > 0 && (
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle className="text-xl">Top Recurring Issues</CardTitle>
            <CardDescription>
              Patterns identified from your previous feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {repeatedSuggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className="p-3 rounded-lg bg-muted/30 border border-border/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {CRITERIA_NAMES[suggestion.relatedSkill]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Appeared {suggestion.count} times
                        </span>
                      </div>
                      <p className="text-sm">{suggestion.suggestion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-sm text-muted-foreground">
                <strong>Focus on these areas</strong> as they appear repeatedly in your feedback. 
                Addressing these will significantly improve your scores.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
