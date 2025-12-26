/**
 * Utility functions for handling API errors with comprehensive diagnostics
 */

/**
 * Error types for diagnostic purposes
 */
export enum ErrorType {
  MISSING_API_KEY = "MISSING_API_KEY",
  INVALID_API_KEY = "INVALID_API_KEY",
  RATE_LIMIT = "RATE_LIMIT",
  QUOTA_EXCEEDED = "QUOTA_EXCEEDED",
  BILLING_ISSUE = "BILLING_ISSUE",
  CORS_ERROR = "CORS_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  INVALID_MODEL = "INVALID_MODEL",
  GENERIC_ERROR = "GENERIC_ERROR"
}

/**
 * Diagnostic information for errors
 */
export interface ErrorDiagnostics {
  errorType: ErrorType
  statusCode?: number
  message: string
  vietnameseMessage: string
  possibleCauses: string[]
  troubleshootingSteps: string[]
  isCodeIssue: boolean
  isApiIssue: boolean
  responseBody?: any
  timestamp: string
}

/**
 * Check if an error message indicates a missing API key
 */
export function isMissingApiKeyError(errorMessage: string): boolean {
  const errorString = errorMessage.toLowerCase()
  return (
    errorString.includes("gemini_api_key") ||
    (errorString.includes("api key") && errorString.includes("not set")) ||
    (errorString.includes("missing") && errorString.includes("api"))
  )
}

/**
 * Check if an error indicates an invalid/expired API key
 */
export function isInvalidApiKeyError(error: any): boolean {
  const errorMessage = error?.message || error?.toString() || ""
  const errorString = errorMessage.toLowerCase()
  const status = error?.status || error?.response?.status
  
  return (
    status === 401 ||
    status === 403 ||
    errorString.includes("invalid api key") ||
    errorString.includes("api key not valid") ||
    errorString.includes("unauthorized") ||
    errorString.includes("permission denied")
  )
}

/**
 * Check if an error message indicates a rate limit error
 */
export function isRateLimitError(error: any): boolean {
  const errorMessage = error?.message || error?.toString() || ""
  const errorString = errorMessage.toLowerCase()
  
  return (
    error?.status === 429 ||
    error?.response?.status === 429 ||
    errorString.includes("resource_exhausted") ||
    errorString.includes("too many requests") ||
    (errorString.includes("rate limit") && !errorString.includes("unlimited")) ||
    errorString.includes("rpm") ||
    errorString.includes("rpd") ||
    errorString.includes("requests per minute") ||
    errorString.includes("requests per day") ||
    errorMessage.includes("429")
  )
}

/**
 * Check if error is due to quota exceeded (daily/monthly limits)
 */
export function isQuotaExceededError(error: any): boolean {
  const errorMessage = error?.message || error?.toString() || ""
  const errorString = errorMessage.toLowerCase()
  
  return (
    errorString.includes("quota exceeded") ||
    errorString.includes("quota limit") ||
    errorString.includes("rpd") ||
    errorString.includes("daily limit") ||
    errorString.includes("monthly limit") ||
    (errorString.includes("billing") && errorString.includes("limit"))
  )
}

/**
 * Check if error is due to billing issues
 */
export function isBillingError(error: any): boolean {
  const errorMessage = error?.message || error?.toString() || ""
  const errorString = errorMessage.toLowerCase()
  
  return (
    errorString.includes("billing not enabled") ||
    errorString.includes("payment required") ||
    errorString.includes("billing account")
  )
}

/**
 * Check if error is due to invalid model
 */
export function isInvalidModelError(error: any): boolean {
  const errorMessage = error?.message || error?.toString() || ""
  const errorString = errorMessage.toLowerCase()
  const status = error?.status || error?.response?.status
  
  return (
    status === 404 ||
    errorString.includes("model not found") ||
    errorString.includes("invalid model")
  )
}

/**
 * Diagnose error and provide detailed information
 */
export function diagnoseError(error: any): ErrorDiagnostics {
  const timestamp = new Date().toISOString()
  const errorMessage = error?.message || error?.toString() || ""
  const statusCode = error?.status || error?.response?.status
  const responseBody = error?.response?.data || error?.responseData
  
  // Check for missing API key
  if (isMissingApiKeyError(errorMessage)) {
    return {
      errorType: ErrorType.MISSING_API_KEY,
      statusCode: 500,
      message: "GEMINI_API_KEY environment variable is not configured",
      vietnameseMessage: "Chưa cấu hình API key. Đây là vấn đề về cấu hình code, không phải API.",
      possibleCauses: [
        "Missing .env.local file",
        "GEMINI_API_KEY not set in environment variables",
        "Environment variables not loaded properly"
      ],
      troubleshootingSteps: [
        "Create .env.local file in project root",
        "Add: GEMINI_API_KEY=your_api_key_here",
        "Restart development server",
        "Get API key from: https://aistudio.google.com/app/apikey"
      ],
      isCodeIssue: true,
      isApiIssue: false,
      timestamp
    }
  }
  
  // Check for invalid/expired API key
  if (isInvalidApiKeyError(error)) {
    return {
      errorType: ErrorType.INVALID_API_KEY,
      statusCode,
      message: "API key is invalid, expired, or doesn't have required permissions",
      vietnameseMessage: "API key không hợp lệ hoặc hết hạn. Đây là vấn đề về cấu hình API key.",
      possibleCauses: [
        "API key is incorrect or expired",
        "API key doesn't have required permissions",
        "Using API key from wrong project",
        "API key has been revoked"
      ],
      troubleshootingSteps: [
        "Verify API key at: https://aistudio.google.com/app/apikey",
        "Check if key is enabled and not expired",
        "Ensure key has Generative Language API permissions",
        "Generate new API key if needed",
        "Update GEMINI_API_KEY in .env.local"
      ],
      isCodeIssue: false,
      isApiIssue: true,
      responseBody,
      timestamp
    }
  }
  
  // Check for quota exceeded (daily/monthly limits)
  if (isQuotaExceededError(error)) {
    return {
      errorType: ErrorType.QUOTA_EXCEEDED,
      statusCode: statusCode || 429,
      message: "API quota limit exceeded (RPM: Requests Per Minute, RPD: Requests Per Day, or monthly limit reached)",
      vietnameseMessage: "Đã vượt giới hạn quota API (RPM: requests per minute, RPD: requests per day). Đây là vấn đề về giới hạn API, không phải code.",
      possibleCauses: [
        "Free tier RPM limit reached (e.g., 5 requests/minute)",
        "Free tier RPD limit reached (e.g., 20 requests/day)",
        "Monthly quota exhausted",
        "Too many concurrent users",
        "Not using rate limiting properly"
      ],
      troubleshootingSteps: [
        "Wait 1-2 minutes for rate limit reset",
        "Check usage at: https://aistudio.google.com/app/apikey",
        "Verify you're viewing the correct project in dashboard",
        "Enable billing for higher limits (if applicable)",
        "Request quota increase from Google",
        "Implement request queuing/throttling in code"
      ],
      isCodeIssue: false,
      isApiIssue: true,
      responseBody,
      timestamp
    }
  }
  
  // Check for rate limit (burst protection)
  if (isRateLimitError(error)) {
    return {
      errorType: ErrorType.RATE_LIMIT,
      statusCode: statusCode || 429,
      message: "Rate limit exceeded - too many requests in short time",
      vietnameseMessage: "Gửi request quá nhanh, vượt giới hạn tốc độ. Đây là vấn đề về tần suất gọi API.",
      possibleCauses: [
        "Multiple requests sent simultaneously",
        "Burst of traffic from multiple users",
        "Rate limiting not implemented properly in code",
        "Free tier limits are strict"
      ],
      troubleshootingSteps: [
        "Wait 1-2 minutes before retrying",
        "Check if server-side rate limiting is working",
        "Verify withRateLimit() is used in API routes",
        "Check usage dashboard for current limits",
        "Enable billing for higher rate limits"
      ],
      isCodeIssue: false,
      isApiIssue: true,
      responseBody,
      timestamp
    }
  }
  
  // Check for billing issues
  if (isBillingError(error)) {
    return {
      errorType: ErrorType.BILLING_ISSUE,
      statusCode: statusCode || 403,
      message: "Billing not enabled or payment required",
      vietnameseMessage: "Chưa bật billing hoặc cần thanh toán. Đây là vấn đề về cài đặt tài khoản Google Cloud.",
      possibleCauses: [
        "Billing not enabled for project",
        "Payment method not configured",
        "Billing account suspended"
      ],
      troubleshootingSteps: [
        "Enable billing in Google Cloud Console",
        "Add valid payment method",
        "Check billing account status",
        "Free tier may have limited features"
      ],
      isCodeIssue: false,
      isApiIssue: true,
      responseBody,
      timestamp
    }
  }
  
  // Check for invalid model
  if (isInvalidModelError(error)) {
    return {
      errorType: ErrorType.INVALID_MODEL,
      statusCode: statusCode || 404,
      message: "Model not found or invalid model name",
      vietnameseMessage: "Tên model không hợp lệ. Đây có thể là vấn đề về code (sai tên model).",
      possibleCauses: [
        "Model name is incorrect",
        "Model not available in your region",
        "Model has been deprecated"
      ],
      troubleshootingSteps: [
        "Check model name in code (e.g., 'gemini-2.0-flash')",
        "Verify model is available in Google AI Studio",
        "Update to supported model name"
      ],
      isCodeIssue: true,
      isApiIssue: false,
      responseBody,
      timestamp
    }
  }
  
  // Generic error
  return {
    errorType: ErrorType.GENERIC_ERROR,
    statusCode: statusCode || 500,
    message: errorMessage || "Unknown error occurred",
    vietnameseMessage: "Lỗi không xác định. Cần kiểm tra log để biết chi tiết.",
    possibleCauses: [
      "Network connectivity issue",
      "Server timeout",
      "Unexpected API response",
      "Code bug or logic error"
    ],
    troubleshootingSteps: [
      "Check network connection",
      "Check server logs for details",
      "Verify API endpoint is correct",
      "Try again after a few minutes"
    ],
    isCodeIssue: false,
    isApiIssue: false,
    responseBody,
    timestamp
  }
}

/**
 * Create a standardized API error response with diagnostics
 */
export function createDiagnosticErrorResponse(error: any) {
  const diagnostics = diagnoseError(error)
  
  return {
    error: diagnostics.message,
    errorType: diagnostics.errorType,
    vietnameseMessage: diagnostics.vietnameseMessage,
    diagnostics: {
      statusCode: diagnostics.statusCode,
      possibleCauses: diagnostics.possibleCauses,
      troubleshootingSteps: diagnostics.troubleshootingSteps,
      isCodeIssue: diagnostics.isCodeIssue,
      isApiIssue: diagnostics.isApiIssue,
      timestamp: diagnostics.timestamp
    },
    // Include response body for debugging (sanitize sensitive data)
    ...(diagnostics.responseBody && { responseDetails: sanitizeResponseBody(diagnostics.responseBody) })
  }
}

/**
 * Sanitize response body to remove sensitive information
 */
function sanitizeResponseBody(responseBody: any): any {
  if (!responseBody) return null
  
  // Create a copy to avoid mutating original
  const sanitized = JSON.parse(JSON.stringify(responseBody))
  
  // Remove sensitive fields
  const sensitiveFields = ['apiKey', 'token', 'secret', 'password', 'authorization']
  
  function removeSensitiveFields(obj: any) {
    if (typeof obj !== 'object' || obj === null) return
    
    for (const key in obj) {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        obj[key] = '[REDACTED]'
      } else if (typeof obj[key] === 'object') {
        removeSensitiveFields(obj[key])
      }
    }
  }
  
  removeSensitiveFields(sanitized)
  return sanitized
}

/**
 * Create a standardized API error response for missing API key
 */
export function createMissingApiKeyResponse() {
  return {
    error: "Missing GEMINI_API_KEY in environment",
    message: "The GEMINI_API_KEY environment variable is not configured. Please set up your API key to use AI features.",
    setupInstructions: "Create a .env.local file in the project root and add: GEMINI_API_KEY=your_api_key_here",
    docsUrl: "https://aistudio.google.com/app/apikey",
    errorType: "MISSING_API_KEY"
  }
}

/**
 * Format client-side error message for missing API key
 */
export function formatMissingApiKeyMessage(): string {
  return (
    "⚠️ **Configuration Required**\n\n" +
    "The AI features are not configured. Please ask the administrator to set up the GEMINI_API_KEY in the .env.local file.\n\n" +
    "Get your API key at: https://aistudio.google.com/app/apikey"
  )
}

/**
 * Format client-side error message for rate limit
 */
export function formatRateLimitMessage(): string {
  return "Xin lỗi, AI đang vượt giới hạn sử dụng. Vui lòng thử lại sau vài phút."
}

/**
 * Format detailed diagnostic message for client display
 * Note: This function formats ErrorDiagnostics objects directly.
 * For formatting API error responses, see formatErrorResponse() in chat-interface.tsx
 * which handles the raw error data structure from API responses.
 */
export function formatDiagnosticMessage(diagnostics: ErrorDiagnostics): string {
  const causeOrIssue = diagnostics.isCodeIssue ? "Vấn đề Code" : diagnostics.isApiIssue ? "Vấn đề API" : "Vấn đề Chưa Rõ"
  
  return `🔍 **Chi tiết lỗi:**
  
**Loại lỗi:** ${causeOrIssue}
**Thông báo:** ${diagnostics.vietnameseMessage}

**Nguyên nhân có thể:**
${diagnostics.possibleCauses.map((c, i) => `${i + 1}. ${c}`).join('\n')}

**Cách khắc phục:**
${diagnostics.troubleshootingSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

**Thời gian:** ${new Date(diagnostics.timestamp).toLocaleString('vi-VN')}`
}
