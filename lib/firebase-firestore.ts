import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  setDoc,
  Timestamp,
  onSnapshot,
} from "firebase/firestore"
import type { TaskDocument, Revision } from "@/types/tasks"
import { db } from "./firebase"

// Tasks
export async function createTask(userId: string, taskData: any) {
  const tasksRef = collection(db, "users", userId, "tasks")
  const now = Timestamp.now()
  
  // Create initial revision if feedback exists
  const revisions = taskData.feedback ? [{
    id: taskData.revisionId || `rev_${Date.now()}`,
    overallBand: taskData.overallBand || taskData.feedback.overallBand,
    summary: taskData.summary || taskData.feedback.summary,
    createdAt: now,
    feedback: taskData.feedback
  }] : []
  
  const docRef = await addDoc(tasksRef, {
    ...taskData,
    revisions,
    createdAt: now,
    updatedAt: now,
  })
  return docRef.id
}

export async function getTasks(userId: string) {
  const tasksRef = collection(db, "users", userId, "tasks")
  const q = query(tasksRef, orderBy("updatedAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export async function getTask(userId: string, taskId: string) {
  const taskRef = doc(db, "users", userId, "tasks", taskId)
  const snapshot = await getDoc(taskRef)
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
}

export function subscribeToTasks(
  userId: string,
  onUpdate: (tasks: TaskDocument[]) => void,
  onError?: (error: Error) => void,
) {
  const tasksRef = collection(db, "users", userId, "tasks")
  const q = query(tasksRef, orderBy("updatedAt", "desc"))

  return onSnapshot(
    q,
    (snapshot) => {
      const documents = snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      })) as TaskDocument[]
      onUpdate(documents)
    },
    (error) => {
      console.error("[v0] Failed to subscribe to tasks:", error)
      if (onError) {
        onError(error)
      }
    },
  )
}

export async function updateTask(userId: string, taskId: string, updates: any) {
  const taskRef = doc(db, "users", userId, "tasks", taskId)
  await updateDoc(taskRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  })
}

export async function addRevisionToTask(userId: string, taskId: string, revision: any) {
  const taskRef = doc(db, "users", userId, "tasks", taskId)
  const taskDoc = await getDoc(taskRef)
  
  if (!taskDoc.exists()) {
    throw new Error("Task not found")
  }
  
  const taskData = taskDoc.data()
  const existingRevisions = taskData.revisions || []
  
  const newRevision = {
    ...revision,
    id: revision.id || `rev_${Date.now()}`,
    createdAt: Timestamp.now()
  }
  
  await updateDoc(taskRef, {
    revisions: [...existingRevisions, newRevision],
    overallBand: revision.overallBand,
    summary: revision.summary,
    feedback: revision.feedback,
    updatedAt: Timestamp.now(),
  })
}

export async function updateRevisionInTask(
  userId: string, 
  taskId: string, 
  revisionId: string, 
  updates: Pick<Revision, 'improvedEssay' | 'improvementExplanation'>
) {
  const taskRef = doc(db, "users", userId, "tasks", taskId)
  const taskDoc = await getDoc(taskRef)
  
  if (!taskDoc.exists()) {
    throw new Error("Task not found")
  }
  
  const taskData = taskDoc.data()
  const existingRevisions = taskData.revisions || []
  
  const updatedRevisions = existingRevisions.map((rev: Revision) => {
    if (rev.id === revisionId) {
      return { ...rev, ...updates }
    }
    return rev
  })
  
  await updateDoc(taskRef, {
    revisions: updatedRevisions,
    updatedAt: Timestamp.now(),
  })
}

export async function deleteTask(userId: string, taskId: string) {
  const taskRef = doc(db, "users", userId, "tasks", taskId)
  await deleteDoc(taskRef)
}

// User Profile
export async function getUserProfile(userId: string) {
  const userRef = doc(db, "users", userId)
  const snapshot = await getDoc(userRef)
  return snapshot.exists() ? snapshot.data() : null
}

export async function createUserProfile(userId: string, profileData: any) {
  const userRef = doc(db, "users", userId)
  await setDoc(userRef, {
    ...profileData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
}

export async function updateUserProfile(userId: string, updates: any) {
  const userRef = doc(db, "users", userId)
  await updateDoc(userRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  })
}
