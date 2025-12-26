"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { auth, isFirebaseConfigured } from "@/lib/firebase"
import { createUserProfile, getUserProfile } from "@/lib/firebase-firestore"

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If Firebase is not configured, skip authentication
    if (!isFirebaseConfigured) {
      console.warn('Firebase is not configured. Authentication features will not be available.')
      setLoading(false)
      return
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user)

        // Create user profile if it doesn't exist
        if (user) {
          const profile = await getUserProfile(user.uid)
          if (!profile) {
            await createUserProfile(user.uid, {
              email: user.email,
              displayName: user.displayName || "",
              targetBand: 7.0,
              focusAreas: ["TR", "CC", "LR", "GRA"],
              preferences: {
                tone: "neutral",
                level: "B2",
                language: "en",
              },
            })
          }
        }

        setLoading(false)
      })

      return () => unsubscribe()
    } catch (error) {
      console.error('Error initializing Firebase auth:', error)
      setLoading(false)
    }
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
