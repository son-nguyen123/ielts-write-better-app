import { TopNav } from "@/components/navigation/top-nav"
import { SecondaryNav } from "@/components/navigation/secondary-nav"
import { TaskDetail } from "@/components/tasks/task-detail"
import { Footer } from "@/components/home/footer"

export default function TaskDetailPage({ params }: { params: { taskId: string } }) {
  return (
    <div className="min-h-screen">
      <TopNav isSignedIn userName="Alex Chen" userEmail="alex@example.com" />
      <SecondaryNav />

      <div className="container mx-auto px-4 py-8">
        <TaskDetail taskId={params.taskId} />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
