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
  type Unsubscribe,
} from "firebase/firestore"
import { db } from "./firebase"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export async function addChatMessage(
  userId: string,
  message: Pick<ChatMessage, "role" | "content">
) {
  const messagesRef = collection(db, "users", userId, "chatMessages")
  const docRef = await addDoc(messagesRef, {
    ...message,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export function listenToChatMessages(
  userId: string,
  callback: (messages: ChatMessage[]) => void
): Unsubscribe {
  const messagesRef = collection(db, "users", userId, "chatMessages")
  const q = query(messagesRef, orderBy("createdAt", "asc"))

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data() as Omit<ChatMessage, "id"> & { id?: string }
      return {
        id: docSnapshot.id,
        ...data,
      } satisfies ChatMessage
    })
    callback(messages)
  })
}

// Tasks
export async function createTask(userId: string, taskData: any) {
  const tasksRef = collection(db, "users", userId, "tasks")
  const docRef = await addDoc(tasksRef, {
    ...taskData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
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

export async function updateTask(userId: string, taskId: string, updates: any) {
  const taskRef = doc(db, "users", userId, "tasks", taskId)
  await updateDoc(taskRef, {
    ...updates,
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
