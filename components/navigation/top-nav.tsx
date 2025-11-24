"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PenLine, User, BarChart3, LogOut } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { signOutUser } from "@/lib/firebase-auth"
import { useToast } from "@/hooks/use-toast"
import { getUserProfile } from "@/lib/firebase-firestore"

export function TopNav() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [avatarUrl, setAvatarUrl] = useState<string>("")

  useEffect(() => {
    async function loadAvatar() {
      if (!user) {
        setAvatarUrl("")
        return
      }

      try {
        const profile = await getUserProfile(user.uid)
        setAvatarUrl(profile?.avatarUrl || user.photoURL || "")
      } catch (error) {
        console.error("Error loading avatar:", error)
        setAvatarUrl(user.photoURL || "")
      }
    }

    loadAvatar()
  }, [user])

  const handleSignOut = async () => {
    const { error } = await signOutUser()

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Success",
      description: "You have been signed out.",
    })
    router.push("/")
  }

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <PenLine className="h-6 w-6 text-primary" />
            <span className="text-foreground">IELTS WriteBetter</span>
          </Link>

          {!user && (
            <div className="hidden md:flex items-center gap-6">
              <Link href="/#samples" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Samples
              </Link>
              <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="h-8 w-20 bg-muted animate-pulse rounded" />
          ) : user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={avatarUrl || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.displayName || "User"}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/reports" className="cursor-pointer">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Reports
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
