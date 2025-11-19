import { TopNav } from "@/components/navigation/top-nav"
import { SecondaryNav } from "@/components/navigation/secondary-nav"
import { PerformanceComparisonChart } from "@/components/reports/performance-comparison-chart"
import { PageWithTOC } from "@/components/ui/page-with-toc"

export default function ChartDemoPage() {
  return (
    <div className="min-h-screen">
      <TopNav isSignedIn userName="Demo User" userEmail="demo@example.com" />
      <SecondaryNav />
      <PageWithTOC>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">IELTS Performance Comparison Chart Demo</h1>
            <p className="text-muted-foreground">
              This demonstrates the new colorful grouped bar chart showing before/after comparison across IELTS criteria
            </p>
          </div>

          {/* Example 1: With Before Scores (showing improvement) */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Example 1: Showing Improvement (Before vs Now)</h2>
            <PerformanceComparisonChart
              beforeScores={{
                TR: 5.5,
                CC: 5.0,
                LR: 5.0,
                GRA: 4.5
              }}
              currentScores={{
                TR: 6.5,
                CC: 6.0,
                LR: 6.5,
                GRA: 6.0
              }}
            />
          </div>

          {/* Example 2: Current scores only */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Example 2: Current Performance Only</h2>
            <PerformanceComparisonChart
              currentScores={{
                TR: 7.0,
                CC: 6.5,
                LR: 7.5,
                GRA: 7.0
              }}
            />
          </div>

          {/* Example 3: Lower band scores showing different improvement patterns */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Example 3: Different Improvement Patterns</h2>
            <PerformanceComparisonChart
              beforeScores={{
                TR: 4.5,
                CC: 5.5,
                LR: 4.0,
                GRA: 5.0
              }}
              currentScores={{
                TR: 6.0,
                CC: 6.5,
                LR: 7.0,
                GRA: 6.0
              }}
            />
          </div>
        </div>
      </PageWithTOC>
    </div>
  )
}
