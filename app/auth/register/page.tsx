import { TopNav } from "@/components/navigation/top-nav"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="container mx-auto px-4 py-16">
        <RegisterForm />
      </div>
    </div>
  )
}
