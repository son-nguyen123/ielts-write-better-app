import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from "@/components/navigation/top-nav"
import { Target, GitCompare, TrendingUp, Sparkles } from "lucide-react"
import { DemoSection } from "@/components/home/demo-section"
import { Footer } from "@/components/home/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <TopNav />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">Level up your IELTS Writing.</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-balance">
            AI feedback aligned to TR / CC / LR / GRA. Improve faster with targeted suggestions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link href="/tasks/new">
              <Button size="lg" className="text-lg px-8">
                Start a Task
              </Button>
            </Link>
            <Link href="/chat">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                Try the Chatbot
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">Free plan available. No credit card required.</p>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <Target className="h-10 w-10 text-primary mb-4" />
              <CardTitle className="text-xl">Band-aligned scoring</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Task 1 & Task 2 with TR/CC/LR/GRA breakdown
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <Sparkles className="h-10 w-10 text-accent mb-4" />
              <CardTitle className="text-xl">Actionable feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">Concrete rewrites and examples</CardDescription>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <GitCompare className="h-10 w-10 text-chart-3 mb-4" />
              <CardTitle className="text-xl">Version compare</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                See diffs between drafts and AI suggestions
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border bg-card">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-chart-5 mb-4" />
              <CardTitle className="text-xl">Progress reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">Track improvement over time</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Demo Section */}
      <DemoSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
