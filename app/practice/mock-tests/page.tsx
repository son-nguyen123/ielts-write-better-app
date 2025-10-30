import { TopNav } from "@/components/navigation/top-nav"
import { SecondaryNav } from "@/components/navigation/secondary-nav"
import { MockTestBuilder } from "@/components/practice/mock-test-builder"

export default function MockTestsPage() {
  return (
    <div className="min-h-screen">
      <TopNav isSignedIn userName="Alex Chen" userEmail="alex@example.com" />
      <SecondaryNav />

      <div className="container mx-auto px-4 py-8">
        <MockTestBuilder />
      </div>
    </div>
  )
}
