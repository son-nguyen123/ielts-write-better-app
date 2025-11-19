import { NextRequest } from "next/server"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId")
    
    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 })
    }

    // Query for scored tasks only (without orderBy to avoid composite index requirement)
    const tasksRef = collection(db, "users", userId, "tasks")
    const q = query(
      tasksRef,
      where("status", "==", "scored")
    )
    
    const snapshot = await getDocs(q)
    const scoredEssays = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title || data.prompt || "Untitled Essay",
        prompt: data.prompt,
        response: data.response,
        taskType: data.taskType,
        overallBand: data.overallBand ?? data.feedback?.overallBand,
        feedback: data.feedback,
        updatedAt: data.updatedAt,
      }
    })

    // Sort by updatedAt in memory (descending - most recent first)
    scoredEssays.sort((a, b) => {
      const aTime = a.updatedAt?.toMillis?.() || a.updatedAt?.seconds * 1000 || 0
      const bTime = b.updatedAt?.toMillis?.() || b.updatedAt?.seconds * 1000 || 0
      return bTime - aTime
    })

    return Response.json({ essays: scoredEssays })
  } catch (error) {
    console.error("[scored-essays] Error fetching scored essays:", error)
    return Response.json(
      { error: "Failed to fetch scored essays" },
      { status: 500 }
    )
  }
}
