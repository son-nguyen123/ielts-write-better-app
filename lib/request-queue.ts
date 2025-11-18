/**
 * Request queue utility for managing API calls with rate limiting
 * Prevents hitting API quota limits by throttling concurrent requests
 */

interface QueuedRequest<T> {
  id: string
  fn: () => Promise<T>
  resolve: (value: T) => void
  reject: (error: any) => void
  timestamp: number
}

interface QueueConfig {
  maxConcurrent: number
  minInterval: number // minimum milliseconds between requests
  maxQueueSize: number
}

const DEFAULT_CONFIG: QueueConfig = {
  maxConcurrent: 2, // Max 2 concurrent AI requests
  minInterval: 1000, // At least 1 second between requests
  maxQueueSize: 20, // Max 20 queued requests
}

export class RequestQueue {
  private queue: QueuedRequest<any>[] = []
  private activeRequests = 0
  private lastRequestTime = 0
  private config: QueueConfig
  private listeners: Set<() => void> = new Set()

  constructor(config: Partial<QueueConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Add a request to the queue
   */
  async enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      if (this.queue.length >= this.config.maxQueueSize) {
        reject(new Error('Request queue is full. Please try again later.'))
        return
      }

      const request: QueuedRequest<T> = {
        id: crypto.randomUUID(),
        fn,
        resolve,
        reject,
        timestamp: Date.now(),
      }

      this.queue.push(request)
      this.notifyListeners()
      this.processQueue()
    })
  }

  /**
   * Process queued requests with rate limiting
   */
  private async processQueue() {
    // Can't process if at max concurrent requests
    if (this.activeRequests >= this.config.maxConcurrent) {
      return
    }

    // Can't process if too soon since last request
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    if (timeSinceLastRequest < this.config.minInterval) {
      // Schedule next processing after minimum interval
      setTimeout(() => this.processQueue(), this.config.minInterval - timeSinceLastRequest)
      return
    }

    const request = this.queue.shift()
    if (!request) {
      return
    }

    this.activeRequests++
    this.lastRequestTime = Date.now()
    this.notifyListeners()

    try {
      const result = await request.fn()
      request.resolve(result)
    } catch (error) {
      request.reject(error)
    } finally {
      this.activeRequests--
      this.notifyListeners()
      
      // Process next request after minimum interval
      setTimeout(() => this.processQueue(), this.config.minInterval)
    }
  }

  /**
   * Get current queue status
   */
  getStatus() {
    return {
      queueLength: this.queue.length,
      activeRequests: this.activeRequests,
      maxConcurrent: this.config.maxConcurrent,
      canAcceptRequests: this.queue.length < this.config.maxQueueSize,
    }
  }

  /**
   * Subscribe to queue status changes
   */
  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener())
  }

  /**
   * Clear the queue (useful for cleanup)
   */
  clear() {
    this.queue.forEach(req => 
      req.reject(new Error('Queue cleared'))
    )
    this.queue = []
    this.notifyListeners()
  }
}

// Global singleton instance for AI requests
let globalAIQueue: RequestQueue | null = null

export function getAIRequestQueue(): RequestQueue {
  if (!globalAIQueue) {
    globalAIQueue = new RequestQueue({
      maxConcurrent: 2,
      minInterval: 1000,
      maxQueueSize: 20,
    })
  }
  return globalAIQueue
}

/**
 * Wrapper function to queue an AI request
 */
export async function queueAIRequest<T>(fn: () => Promise<T>): Promise<T> {
  const queue = getAIRequestQueue()
  return queue.enqueue(fn)
}
