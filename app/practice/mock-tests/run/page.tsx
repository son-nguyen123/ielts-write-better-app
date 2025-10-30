import Link from "next/link"
import { TopNav } from "@/components/navigation/top-nav"
import { SecondaryNav } from "@/components/navigation/secondary-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { task1Prompts, task2Prompts } from "@/lib/prompt-data"

interface MockTestRunPageProps {
  searchParams: {
    task1?: string
    task2?: string
    timer?: string
    mode?: string
  }
}

export default function MockTestRunPage({ searchParams }: MockTestRunPageProps) {
  const task1 = task1Prompts.find((prompt) => prompt.id === searchParams.task1)
  const task2 = task2Prompts.find((prompt) => prompt.id === searchParams.task2)

  return (
    <div className="min-h-screen">
      <TopNav isSignedIn userName="Alex Chen" userEmail="alex@example.com" />
      <SecondaryNav />

      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mock Test Session</h1>
          <p className="text-muted-foreground">
            Review your prompts and begin writing when you&apos;re ready. You can open the task writer in a new tab to
            keep your timer visible.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle>Task 1 Prompt</CardTitle>
              <CardDescription>Visual data description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium text-lg">{task1?.title ?? "Prompt not selected"}</p>
              <p className="text-sm text-muted-foreground">{task1?.description ?? "Return to the builder to pick one."}</p>
              <Button asChild className="w-full" disabled={!task1}>
                <Link href={task1 ? `/tasks/new?promptId=${task1.id}` : "/practice/mock-tests"}>
                  Start Task 1 response
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <CardTitle>Task 2 Prompt</CardTitle>
              <CardDescription>Essay writing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium text-lg">{task2?.title ?? "Prompt not selected"}</p>
              <p className="text-sm text-muted-foreground">{task2?.description ?? "Return to the builder to pick one."}</p>
              <Button asChild className="w-full" disabled={!task2}>
                <Link href={task2 ? `/tasks/new?promptId=${task2.id}` : "/practice/mock-tests"}>
                  Start Task 2 response
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
            <CardDescription>Keep these settings in mind while you practice.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Timer length</p>
              <p className="text-lg font-semibold">{searchParams.timer ? `${searchParams.timer} minutes` : "Not set"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Delivery mode</p>
              <p className="text-lg font-semibold">{searchParams.mode ? formatDeliveryMode(searchParams.mode) : "Not set"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function formatDeliveryMode(mode: string) {
  switch (mode) {
    case "single-session":
      return "Single timed session"
    case "separate-drafts":
      return "Create two separate drafts"
    default:
      return mode
  }
}
