import { NextRequest } from "next/server"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId")
    
    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 })
    }

    // Query for scored tasks only
    const tasksRef = collection(db, "users", userId, "tasks")
    const q = query(
      tasksRef,
      where("status", "==", "scored"),
      orderBy("updatedAt", "desc")
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

    return Response.json({ essays: scoredEssays })
  } catch (error) {
    console.error("[scored-essays] Error fetching scored essays:", error)
    return Response.json(
      { error: "Failed to fetch scored essays" },
      { status: 500 }
    )
  }
}
