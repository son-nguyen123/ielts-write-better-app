import { TopNav } from "@/components/navigation/top-nav"
import { SecondaryNav } from "@/components/navigation/secondary-nav"
import { NewTaskForm } from "@/components/tasks/new-task-form"

export default function NewTaskPage() {
  return (
    <div className="min-h-screen">
      <TopNav isSignedIn userName="Alex Chen" userEmail="alex@example.com" />
      <SecondaryNav />

      <div className="container mx-auto px-4 py-8">
        <NewTaskForm />
      </div>
    </div>
  )
}
