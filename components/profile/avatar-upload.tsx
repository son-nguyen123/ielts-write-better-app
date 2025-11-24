"use client"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Camera, Loader2, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { uploadAvatar, deleteAvatar } from "@/lib/firebase-storage"
import { updateUserProfile } from "@/lib/firebase-firestore"

interface AvatarUploadProps {
  userId: string
  currentAvatarUrl?: string
  userName?: string
  onAvatarChange?: (newAvatarUrl: string) => void
}

export function AvatarUpload({ userId, currentAvatarUrl, userName, onAvatarChange }: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl || "")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const getInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      // Upload the new avatar
      const newAvatarUrl = await uploadAvatar(userId, file)

      // Delete old avatar if it exists
      if (currentAvatarUrl) {
        await deleteAvatar(currentAvatarUrl)
      }

      // Update user profile with new avatar URL
      await updateUserProfile(userId, { avatarUrl: newAvatarUrl })

      // Update local state
      setAvatarUrl(newAvatarUrl)

      // Notify parent component
      if (onAvatarChange) {
        onAvatarChange(newAvatarUrl)
      }

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      })
    } catch (error: any) {
      console.error("Error uploading avatar:", error)
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload avatar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveAvatar = async () => {
    if (!avatarUrl) return

    setIsUploading(true)

    try {
      // Delete avatar from storage
      await deleteAvatar(avatarUrl)

      // Update user profile to remove avatar URL
      await updateUserProfile(userId, { avatarUrl: "" })

      // Update local state
      setAvatarUrl("")

      // Notify parent component
      if (onAvatarChange) {
        onAvatarChange("")
      }

      toast({
        title: "Avatar removed",
        description: "Your profile picture has been removed.",
      })
    } catch (error: any) {
      console.error("Error removing avatar:", error)
      toast({
        title: "Remove failed",
        description: "Failed to remove avatar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar className="h-24 w-24 border-2 border-border">
          <AvatarImage src={avatarUrl} alt={userName || "User avatar"} />
          <AvatarFallback className="text-2xl">{getInitials(userName)}</AvatarFallback>
        </Avatar>
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium">Profile Picture</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={triggerFileInput}
            disabled={isUploading}
          >
            <Camera className="h-4 w-4 mr-2" />
            {avatarUrl ? "Change" : "Upload"}
          </Button>
          {avatarUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveAvatar}
              disabled={isUploading}
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          JPG, PNG, GIF or WebP. Max 5MB.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
