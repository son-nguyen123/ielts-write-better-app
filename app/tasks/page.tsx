import { TopNav } from "@/components/navigation/top-nav"
import { SecondaryNav } from "@/components/navigation/secondary-nav"
import { TasksTable } from "@/components/tasks/tasks-table"
import { TableOfContents } from "@/components/ui/table-of-contents"

export default function TasksPage() {
  return (
    <div className="min-h-screen">
      <TopNav isSignedIn userName="Alex Chen" userEmail="alex@example.com" />
      <SecondaryNav />
      <TableOfContents />

      <div className="container mx-auto px-4 py-8">
        <TasksTable />
      </div>
    </div>
  )
}
