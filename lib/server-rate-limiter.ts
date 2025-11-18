/**
 * Server-side rate limiter for Gemini API requests
 * Ensures we don't exceed API quota limits by managing request flow
 */

interface RateLimiterConfig {
  maxConcurrent: number
  minInterval: number // milliseconds between requests
}

interface QueuedRequest<T> {
  id: string
  fn: () => Promise<T>
  resolve: (value: T) => void
  reject: (error: any) => void
  timestamp: number
}

class ServerRateLimiter {
  private queue: QueuedRequest<any>[] = []
  private activeRequests = 0
  private lastRequestTime = 0
  private config: RateLimiterConfig

  constructor(config: RateLimiterConfig) {
    this.config = config
  }

  /**
   * Enqueue a request with rate limiting
   */
  async enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const request: QueuedRequest<T> = {
        id: crypto.randomUUID(),
        fn,
        resolve,
        reject,
        timestamp: Date.now(),
      }

      this.queue.push(request)
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
    if (timeSinceLastRequest < this.config.minInterval && this.lastRequestTime > 0) {
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

    try {
      const result = await request.fn()
      request.resolve(result)
    } catch (error) {
      request.reject(error)
    } finally {
      this.activeRequests--
      
      // Process next request after minimum interval
      if (this.queue.length > 0) {
        setTimeout(() => this.processQueue(), this.config.minInterval)
      }
    }
  }

  /**
   * Get current queue status
   */
  getStatus() {
    return {
      queueLength: this.queue.length,
      activeRequests: this.activeRequests,
    }
  }
}

// Global singleton for Gemini API requests
let geminiRateLimiter: ServerRateLimiter | null = null

/**
 * Get or create the global Gemini rate limiter
 * Conservative settings to avoid hitting quota limits:
 * - Max 1 concurrent request
 * - Minimum 3 seconds between requests (20 RPM max)
 */
export function getGeminiRateLimiter(): ServerRateLimiter {
  if (!geminiRateLimiter) {
    geminiRateLimiter = new ServerRateLimiter({
      maxConcurrent: 1,
      minInterval: 3000, // 3 seconds = max 20 requests per minute (well below typical limits)
    })
  }
  return geminiRateLimiter
}

/**
 * Execute a Gemini API request with rate limiting
 */
export async function withRateLimit<T>(fn: () => Promise<T>): Promise<T> {
  const limiter = getGeminiRateLimiter()
  return limiter.enqueue(fn)
}
