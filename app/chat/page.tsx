import { TopNav } from "@/components/navigation/top-nav"
import { SecondaryNav } from "@/components/navigation/secondary-nav"
import { ChatInterface } from "@/components/chat/chat-interface"

export default function ChatPage() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <SecondaryNav />

      <div className="container mx-auto px-4 py-8">
        <ChatInterface />
      </div>
    </div>
  )
}
