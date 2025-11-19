import { NextRequest } from "next/server"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { UserTarget } from "@/types/reports"

export const maxDuration = 60

// GET - Retrieve user's target
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 })
    }

    const targetRef = doc(db, "users", userId, "settings", "target")
    const targetDoc = await getDoc(targetRef)

    if (!targetDoc.exists()) {
      return Response.json({ target: null })
    }

    return Response.json({ target: targetDoc.data() as UserTarget })
  } catch (error) {
    console.error("[get-target] Error:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to retrieve target" },
      { status: 500 }
    )
  }
}

// POST - Save user's target
export async function POST(req: NextRequest) {
  try {
    const { userId, targetOverallBand, deadline } = await req.json()

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 })
    }

    if (!targetOverallBand || targetOverallBand < 5.0 || targetOverallBand > 9.0) {
      return Response.json({ error: "Invalid target band. Must be between 5.0 and 9.0" }, { status: 400 })
    }

    const now = new Date().toISOString()
    const targetData: UserTarget = {
      targetOverallBand,
      deadline: deadline || undefined,
      createdAt: now,
      updatedAt: now
    }

    const targetRef = doc(db, "users", userId, "settings", "target")
    
    // Check if target already exists to preserve createdAt
    const existingDoc = await getDoc(targetRef)
    if (existingDoc.exists()) {
      const existingData = existingDoc.data() as UserTarget
      targetData.createdAt = existingData.createdAt
    }

    await setDoc(targetRef, targetData)

    return Response.json({ success: true, target: targetData })
  } catch (error) {
    console.error("[save-target] Error:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to save target" },
      { status: 500 }
    )
  }
}
