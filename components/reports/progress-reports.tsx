"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { RadarChart } from "@/components/dashboard/radar-chart"

const overallTrendData = [
  { date: "Week 1", score: 6.0 },
  { date: "Week 2", score: 6.5 },
  { date: "Week 3", score: 6.5 },
  { date: "Week 4", score: 7.0 },
  { date: "Week 5", score: 6.5 },
  { date: "Week 6", score: 7.0 },
  { date: "Week 7", score: 7.0 },
  { date: "Week 8", score: 7.5 },
]

const criteriaData = [
  { date: "Week 1", TR: 6.0, CC: 6.5, LR: 5.5, GRA: 6.0 },
  { date: "Week 2", TR: 6.5, CC: 7.0, LR: 6.0, GRA: 6.5 },
  { date: "Week 3", TR: 6.5, CC: 7.0, LR: 6.0, GRA: 6.5 },
  { date: "Week 4", TR: 7.0, CC: 7.5, LR: 6.5, GRA: 7.0 },
  { date: "Week 5", TR: 6.5, CC: 7.0, LR: 6.5, GRA: 6.5 },
  { date: "Week 6", TR: 7.0, CC: 7.5, LR: 6.5, GRA: 7.0 },
  { date: "Week 7", TR: 7.0, CC: 7.5, LR: 6.5, GRA: 7.0 },
  { date: "Week 8", TR: 7.5, CC: 8.0, LR: 7.0, GRA: 7.5 },
]

const commonIssues = [
  { issue: "Limited vocabulary range", count: 12, trend: "down" },
  { issue: "Comma splices", count: 8, trend: "down" },
  { issue: "Weak topic sentences", count: 6, trend: "stable" },
  { issue: "Insufficient examples", count: 5, trend: "down" },
  { issue: "Repetitive linking words", count: 4, trend: "down" },
]

export function ProgressReports() {
  const [dateRange, setDateRange] = useState("30")

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Progress Reports</h1>
        <p className="text-muted-foreground">Track your improvement over time</p>
      </div>

      {/* Overall Trend */}
      <Card className="rounded-2xl border-border bg-card mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Overall Score Trend</CardTitle>
              <CardDescription>Your average band score over time</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <span className="text-2xl font-bold text-success">+1.5</span>
              <span className="text-sm text-muted-foreground">since start</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={overallTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis
                domain={[5, 9]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                label={{ value: "Band Score", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Criteria Radar */}
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle>Criteria Breakdown</CardTitle>
            <CardDescription>Current performance across all criteria</CardDescription>
            <Tabs value={dateRange} onValueChange={setDateRange} className="mt-4">
              <TabsList>
                <TabsTrigger value="7">7 days</TabsTrigger>
                <TabsTrigger value="30">30 days</TabsTrigger>
                <TabsTrigger value="90">90 days</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <RadarChart />
          </CardContent>
        </Card>

        {/* Common Issues */}
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle>Common Issues</CardTitle>
            <CardDescription>Top 5 recurring problems in your writing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {commonIssues.map((item, index) => (
                <div key={index} className="flex items-center gap-3 pb-4 border-b border-border last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="h-4 w-4 text-warning" />
                      <p className="text-sm font-medium">{item.issue}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Occurred {item.count} times</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.trend === "down" ? (
                      <>
                        <TrendingDown className="h-4 w-4 text-success" />
                        <Badge variant="success" className="text-xs">
                          Improving
                        </Badge>
                      </>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Stable
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Criteria Trends */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader>
          <CardTitle>Criteria Trends</CardTitle>
          <CardDescription>Track individual criteria performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={criteriaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis
                domain={[5, 9]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                label={{ value: "Band Score", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="TR" stroke="hsl(var(--chart-1))" strokeWidth={2} />
              <Line type="monotone" dataKey="CC" stroke="hsl(var(--chart-2))" strokeWidth={2} />
              <Line type="monotone" dataKey="LR" stroke="hsl(var(--chart-3))" strokeWidth={2} />
              <Line type="monotone" dataKey="GRA" stroke="hsl(var(--chart-4))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Practice Time */}
      <Card className="rounded-2xl border-border bg-card mt-6">
        <CardHeader>
          <CardTitle>Practice Time</CardTitle>
          <CardDescription>Your writing activity this period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">8.5</div>
              <p className="text-sm text-muted-foreground">Hours this week</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">32</div>
              <p className="text-sm text-muted-foreground">Hours this month</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-chart-3 mb-2">15</div>
              <p className="text-sm text-muted-foreground">Tasks completed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
