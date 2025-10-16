"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreVertical, Copy, Trash2 } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { FileText } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/components/auth/auth-provider"
import { getTasks } from "@/lib/firebase-firestore"

export function TasksTable() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    let isMounted = true

    if (authLoading) {
      return () => {
        isMounted = false
      }
    }

    const loadTasks = async () => {
      if (!user) {
        if (isMounted) {
          setTasks([])
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setError(null)

      try {
        const fetchedTasks = await getTasks(user.uid)
        if (isMounted) {
          setTasks(fetchedTasks)
        }
      } catch (err) {
        if (isMounted) {
          setError("We couldn't load your tasks. Please try again.")
          console.error("Failed to load tasks", err)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadTasks()

    return () => {
      isMounted = false
    }
  }, [user, authLoading])

  const filteredTasks = tasks.filter((task) => {
    const title = (task.title || task.promptTitle || "Untitled Task").toLowerCase()
    const matchesSearch = title.includes(search.toLowerCase())
    const matchesType =
      typeFilter === "all" || (task.type || task.promptType || "").toLowerCase() === typeFilter.toLowerCase()
    const matchesStatus =
      statusFilter === "all" || (task.status || "").toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "scored":
        return "success"
      case "submitted":
        return "default"
      case "draft":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Tasks</h1>
        <Link href="/tasks/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </Link>
      </div>

      <Card className="rounded-2xl border-border bg-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by prompt/topic..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Task 1">Task 1</SelectItem>
                <SelectItem value="Task 2">Task 2</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="scored">Scored</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">Loading your tasks...</div>
          ) : error ? (
            <div className="py-10 text-center text-sm text-destructive">{error}</div>
          ) : filteredTasks.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No tasks found"
              description="Try adjusting your filters or create a new task to get started."
              action={{
                label: "Create New Task",
                onClick: () => (window.location.href = "/tasks/new"),
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Title</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Score</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Updated</th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => {
                    const title = task.title || task.promptTitle || "Untitled Task"
                    const type = task.type || task.promptType || "Unknown"
                    const status = (task.status || "draft") as string
                    const score = task.score ?? task.overallScore ?? null
                    const updatedAt = task.updatedAt
                      ? formatDistanceToNow(
                          task.updatedAt.toDate
                            ? task.updatedAt.toDate()
                            : new Date(task.updatedAt),
                          { addSuffix: true },
                        )
                      : "-"

                    return (
                      <tr key={task.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">
                          <Link
                            href={`/tasks/${task.id}`}
                            className="text-sm font-medium hover:text-primary transition-colors"
                          >
                            {title}
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-muted-foreground">{type}</span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={getStatusVariant(status)}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {score !== null && score !== undefined ? (
                            <span className="text-sm font-semibold text-primary">{score}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-muted-foreground">{updatedAt}</span>
                        </td>
                        <td className="py-3 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
