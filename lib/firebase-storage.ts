import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { storage } from "./firebase"

/**
 * Upload an avatar image to Firebase Storage
 * @param userId - The user's unique ID
 * @param file - The image file to upload
 * @returns The download URL of the uploaded image
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.")
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    throw new Error("File size too large. Maximum size is 5MB.")
  }

  // Create a reference to the avatar location
  const avatarRef = ref(storage, `avatars/${userId}/${Date.now()}_${file.name}`)

  // Upload the file
  await uploadBytes(avatarRef, file)

  // Get and return the download URL
  const downloadURL = await getDownloadURL(avatarRef)
  return downloadURL
}

/**
 * Delete an avatar image from Firebase Storage
 * @param avatarURL - The URL of the avatar to delete
 */
export async function deleteAvatar(avatarURL: string): Promise<void> {
  try {
    // Extract the path from the URL
    const url = new URL(avatarURL)
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/)
    if (!pathMatch) return

    const path = decodeURIComponent(pathMatch[1])
    const avatarRef = ref(storage, path)
    await deleteObject(avatarRef)
  } catch (error) {
    console.error("Error deleting avatar:", error)
    // Don't throw error as this is a cleanup operation
  }
}
