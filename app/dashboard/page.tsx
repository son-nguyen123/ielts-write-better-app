"use client"

import { TopNav } from "@/components/navigation/top-nav"
import { SecondaryNav } from "@/components/navigation/secondary-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { FileText, Flame, PenLine, MessageSquare, TrendingUp, Target } from "lucide-react"
import { RadarChart } from "@/components/dashboard/radar-chart"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/components/auth/auth-provider"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <TopNav />
        <SecondaryNav />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.displayName || "User"}</h1>
            <p className="text-muted-foreground">
              Your target band: <span className="text-primary font-semibold">7.5</span>. Keep going!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="rounded-2xl border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Latest Overall Score</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">7.0</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-success">+0.5</span> from last task
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Practice Streak</CardTitle>
                <Flame className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-1">days in a row</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tasks in Progress</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3</div>
                <Link href="/tasks" className="text-xs text-primary hover:underline mt-1 inline-block">
                  View all tasks →
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Progress Chart */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card className="rounded-2xl border-border bg-card">
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>Performance across IELTS criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <RadarChart />
                <Link href="/reports">
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Detailed Reports
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border bg-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest submissions and feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 pb-4 border-b border-border">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Technology and Society Essay</p>
                      <p className="text-xs text-muted-foreground">Task 2 • Scored 7.0</p>
                    </div>
                    <Badge variant="success">Completed</Badge>
                  </div>

                  <div className="flex items-start gap-3 pb-4 border-b border-border">
                    <div className="rounded-lg bg-accent/10 p-2">
                      <FileText className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Climate Change Bar Chart</p>
                      <p className="text-xs text-muted-foreground">Task 1 • In progress</p>
                    </div>
                    <Badge variant="outline">Draft</Badge>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-chart-3/10 p-2">
                      <FileText className="h-4 w-4 text-chart-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Education System Comparison</p>
                      <p className="text-xs text-muted-foreground">Task 2 • Scored 6.5</p>
                    </div>
                    <Badge variant="success">Completed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Start practicing or get help</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                <Link href="/tasks/new" className="block">
                  <Button className="w-full h-auto py-6 flex-col gap-2">
                    <PenLine className="h-6 w-6" />
                    <span>New Task</span>
                  </Button>
                </Link>

                <Link href="/practice/prompts" className="block">
                  <Button variant="outline" className="w-full h-auto py-6 flex-col gap-2 bg-transparent">
                    <FileText className="h-6 w-6" />
                    <span>Pick a Prompt</span>
                  </Button>
                </Link>

                <Link href="/chat" className="block">
                  <Button variant="outline" className="w-full h-auto py-6 flex-col gap-2 bg-transparent">
                    <MessageSquare className="h-6 w-6" />
                    <span>Open Chatbot</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
