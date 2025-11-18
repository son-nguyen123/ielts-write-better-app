"use client"

import { useAIQueueStatus } from "@/hooks/use-ai-queue-status"
import { Loader2, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIQueueIndicatorProps {
  className?: string
  showWhenIdle?: boolean
}

/**
 * Component that displays the current AI request queue status
 * Shows processing state, queue length, and helpful messages
 */
export function AIQueueIndicator({ 
  className,
  showWhenIdle = false 
}: AIQueueIndicatorProps) {
  const status = useAIQueueStatus()

  // Don't show anything if not processing and showWhenIdle is false
  if (!status.isProcessing && !showWhenIdle) {
    return null
  }

  const hasQueue = status.queueLength > 0
  const isActive = status.activeRequests > 0

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-sm",
        status.isProcessing && "border-primary/20 bg-primary/5",
        className
      )}
    >
      {status.isProcessing ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">
              {isActive && "Đang xử lý yêu cầu AI"}
              {hasQueue && !isActive && "Yêu cầu đang trong hàng đợi"}
              {hasQueue && ` (${status.queueLength} yêu cầu đang chờ)`}
            </span>
            {hasQueue && (
              <span className="text-xs text-muted-foreground">
                Hệ thống xử lý từng yêu cầu một để tránh vượt giới hạn. Vui lòng đợi...
              </span>
            )}
            {!hasQueue && isActive && (
              <span className="text-xs text-muted-foreground">
                Đang chấm điểm bài viết của bạn, có thể mất 30-60 giây
              </span>
            )}
          </div>
        </>
      ) : (
        <>
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Sẵn sàng xử lý</span>
        </>
      )}
    </div>
  )
}

/**
 * Inline variant for showing queue status in a compact form
 */
export function AIQueueBadge() {
  const status = useAIQueueStatus()

  if (!status.isProcessing) {
    return null
  }

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
      <Loader2 className="h-3 w-3 animate-spin" />
      {status.queueLength > 0 ? (
        <span>Đang chờ ({status.queueLength})</span>
      ) : (
        <span>Đang xử lý</span>
      )}
    </div>
  )
}
