import { TopNav } from "@/components/navigation/top-nav"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="container mx-auto px-4 py-16">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
