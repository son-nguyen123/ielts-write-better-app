"use client"

import { useState, useEffect } from 'react'
import { getAIRequestQueue } from '@/lib/request-queue'

export interface QueueStatus {
  queueLength: number
  activeRequests: number
  maxConcurrent: number
  canAcceptRequests: boolean
  isProcessing: boolean
}

/**
 * Hook to monitor AI request queue status
 */
export function useAIQueueStatus(): QueueStatus {
  const [status, setStatus] = useState<QueueStatus>(() => {
    const queue = getAIRequestQueue()
    const queueStatus = queue.getStatus()
    return {
      ...queueStatus,
      isProcessing: queueStatus.activeRequests > 0 || queueStatus.queueLength > 0,
    }
  })

  useEffect(() => {
    const queue = getAIRequestQueue()
    
    const updateStatus = () => {
      const queueStatus = queue.getStatus()
      setStatus({
        ...queueStatus,
        isProcessing: queueStatus.activeRequests > 0 || queueStatus.queueLength > 0,
      })
    }

    const unsubscribe = queue.subscribe(updateStatus)
    
    return () => {
      unsubscribe()
    }
  }, [])

  return status
}
