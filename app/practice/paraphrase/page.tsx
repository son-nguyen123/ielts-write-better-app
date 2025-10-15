import { TopNav } from "@/components/navigation/top-nav"
import { SecondaryNav } from "@/components/navigation/secondary-nav"
import { ParaphraseTool } from "@/components/practice/paraphrase-tool"

export default function ParaphrasePage() {
  return (
    <div className="min-h-screen">
      <TopNav isSignedIn userName="Alex Chen" userEmail="alex@example.com" />
      <SecondaryNav />

      <div className="container mx-auto px-4 py-8">
        <ParaphraseTool />
      </div>
    </div>
  )
}
