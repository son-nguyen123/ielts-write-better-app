"use client"

import { TopNav } from "@/components/navigation/top-nav"
import { SecondaryNav } from "@/components/navigation/secondary-nav"
import { ProfileSettings } from "@/components/profile/profile-settings"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Footer } from "@/components/home/footer"

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <TopNav />
        <SecondaryNav />

        <div className="container mx-auto px-4 py-8">
          <ProfileSettings />
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
