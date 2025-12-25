/**
 * Centralized error messages for the application
 * Makes it easier to maintain consistency and support i18n in the future
 */

export const ERROR_MESSAGES = {
  RATE_LIMIT: {
    TITLE: "⏱️ Hệ thống đang bận",
    MESSAGE: 
      "⏱️ Hệ thống đang bận. API chấm điểm đã đạt giới hạn sử dụng miễn phí.|" +
      "🔄 Vui lòng đợi 2-3 phút rồi thử lại.|" +
      "💡 Mẹo: Bạn có thể lưu bản nháp trước để không mất nội dung.",
    RETRY_AFTER_SECONDS: 180,
  },
  GENERIC: {
    TITLE: "Lỗi",
    MESSAGE: "Không thể chấm điểm bài viết. Vui lòng kiểm tra kết nối và thử lại.",
  },
  API_KEY: {
    MESSAGE: "API key configuration error. Please contact support.",
  },
  PARSING: {
    MESSAGE: "Không thể phân tích kết quả chấm điểm từ AI. Vui lòng thử lại sau.",
  },
  INCOMPLETE: {
    MESSAGE: "Phản hồi từ AI không đầy đủ. Vui lòng thử lại sau.",
  },
  CRITERIA: {
    MESSAGE: "Dữ liệu tiêu chí {key} không hợp lệ từ AI",
  },
} as const
