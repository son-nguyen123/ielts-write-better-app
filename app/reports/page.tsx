import { TopNav } from "@/components/navigation/top-nav"
import { SecondaryNav } from "@/components/navigation/secondary-nav"
import { ProgressReports } from "@/components/reports/progress-reports"

export default function ReportsPage() {
  return (
    <div className="min-h-screen">
      <TopNav isSignedIn userName="Alex Chen" userEmail="alex@example.com" />
      <SecondaryNav />

      <div className="container mx-auto px-4 py-8">
        <ProgressReports />
      </div>
    </div>
  )
}
