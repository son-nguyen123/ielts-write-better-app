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
      // Log only in development to avoid production noise
      if (process.env.NODE_ENV === 'development') {
        console.log(`[RateLimiter] Request queued. Queue length: ${this.queue.length}, Active: ${this.activeRequests}`)
      }
      this.processQueue()
    })
  }

  /**
   * Process queued requests with rate limiting
   */
  private async processQueue() {
    // Can't process if at max concurrent requests
    if (this.activeRequests >= this.config.maxConcurrent) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[RateLimiter] Max concurrent requests reached (${this.activeRequests}/${this.config.maxConcurrent})`)
      }
      return
    }

    // Can't process if too soon since last request
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    if (timeSinceLastRequest < this.config.minInterval && this.lastRequestTime > 0) {
      const waitTime = this.config.minInterval - timeSinceLastRequest
      if (process.env.NODE_ENV === 'development') {
        console.log(`[RateLimiter] Rate limiting: waiting ${waitTime}ms before next request`)
      }
      // Schedule next processing after minimum interval
      setTimeout(() => this.processQueue(), waitTime)
      return
    }

    const request = this.queue.shift()
    if (!request) {
      return
    }

    this.activeRequests++
    this.lastRequestTime = Date.now()
    if (process.env.NODE_ENV === 'development') {
      console.log(`[RateLimiter] Processing request. Active: ${this.activeRequests}, Queue: ${this.queue.length}`)
    }

    try {
      const result = await request.fn()
      request.resolve(result)
    } catch (error) {
      request.reject(error)
    } finally {
      this.activeRequests--
      if (process.env.NODE_ENV === 'development') {
        console.log(`[RateLimiter] Request completed. Active: ${this.activeRequests}, Queue: ${this.queue.length}`)
      }
      
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
 * Very conservative settings to avoid hitting quota limits on free tier:
 * - Max 1 concurrent request
 * - Minimum 8 seconds between requests (~7 RPM max)
 * 
 * Note: Free tier Gemini API has 15 RPM limit, but we use 8s interval
 * to provide safety margin and account for processing time variance
 */
export function getGeminiRateLimiter(): ServerRateLimiter {
  if (!geminiRateLimiter) {
    geminiRateLimiter = new ServerRateLimiter({
      maxConcurrent: 1,
      minInterval: 8000, // 8 seconds = max ~7 requests per minute (very conservative for free tier stability)
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
