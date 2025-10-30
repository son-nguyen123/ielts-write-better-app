import Link from "next/link"
import { TopNav } from "@/components/navigation/top-nav"
import { SecondaryNav } from "@/components/navigation/secondary-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Sparkles, RefreshCw, TestTube2 } from "lucide-react"

const practiceTools = [
  {
    href: "/practice/prompts",
    title: "Prompt Library",
    description: "Browse curated IELTS Task 1 and Task 2 prompts to kickstart your practice.",
    icon: FileText,
  },
  {
    href: "/practice/planner",
    title: "Essay Planner",
    description: "Generate a structured outline tailored to your target band score.",
    icon: Sparkles,
  },
  {
    href: "/practice/paraphrase",
    title: "Paraphrase Tool",
    description: "Rewrite sentences and improve lexical resource with AI suggestions.",
    icon: RefreshCw,
  },
  {
    href: "/practice/mock-tests",
    title: "Mock Test Builder",
    description: "Pair prompts and configure a timed IELTS-style writing session.",
    icon: TestTube2,
  },
]

export default function PracticePage() {
  return (
    <div className="min-h-screen">
      <TopNav isSignedIn userName="Alex Chen" userEmail="alex@example.com" />
      <SecondaryNav />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mb-10 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Practice hub</h1>
          <p className="text-lg text-muted-foreground">
            Choose a tool to focus your IELTS preparation—plan essays, explore prompts, paraphrase sentences, or
            assemble a full mock test.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {practiceTools.map((tool) => {
            const Icon = tool.icon

            return (
              <Card key={tool.href} className="rounded-2xl border-border bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <Button asChild variant="outline" size="sm" className="bg-transparent">
                      <Link href={tool.href}>Open</Link>
                    </Button>
                  </div>
                  <CardTitle>{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={tool.href}>Go to {tool.title.toLowerCase()}</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
