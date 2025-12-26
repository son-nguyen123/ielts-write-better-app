/**
 * Utility functions for handling API errors
 */

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
    errorMessage.includes("429")
  )
}

/**
 * Create a standardized API error response for missing API key
 */
export function createMissingApiKeyResponse() {
  return {
    error: "Thiếu GEMINI_API_KEY trong cấu hình",
    message: "Biến môi trường GEMINI_API_KEY chưa được cấu hình. Vui lòng thiết lập API key để sử dụng các tính năng AI.",
    setupInstructions: "Tạo file .env.local trong thư mục gốc project và thêm: GEMINI_API_KEY=your_api_key_here",
    detailedSteps: [
      "1. Truy cập https://aistudio.google.com/app/apikey",
      "2. Đăng nhập bằng tài khoản Google",
      "3. Nhấn 'Create API key'",
      "4. Sao chép API key",
      "5. Tạo file .env.local và thêm: GEMINI_API_KEY=your_api_key",
      "6. Khởi động lại ứng dụng (npm run dev)"
    ],
    docsUrl: "https://aistudio.google.com/app/apikey",
    templateFile: ".env.local.template",
    errorType: "MISSING_API_KEY"
  }
}

/**
 * Format client-side error message for missing API key
 */
export function formatMissingApiKeyMessage(): string {
  return (
    "⚠️ **Cần Cấu Hình API Key**\n\n" +
    "Các tính năng AI chưa được cấu hình. Vui lòng thiết lập GEMINI_API_KEY trong file .env.local.\n\n" +
    "**Cách thiết lập nhanh:**\n" +
    "1. Truy cập: https://aistudio.google.com/app/apikey\n" +
    "2. Tạo API key miễn phí\n" +
    "3. Tạo file .env.local và thêm: GEMINI_API_KEY=your_key\n" +
    "4. Khởi động lại ứng dụng\n\n" +
    "📖 Xem hướng dẫn chi tiết trong file .env.local.template"
  )
}

/**
 * Format client-side error message for rate limit
 */
export function formatRateLimitMessage(): string {
  return "Xin lỗi, AI đang vượt giới hạn sử dụng. Vui lòng thử lại sau vài phút."
}
