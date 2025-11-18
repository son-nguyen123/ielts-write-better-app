# Giải pháp Quản lý Quota API Gemini - Tóm tắt

## Vấn đề đã được giải quyết

Ứng dụng gặp lỗi "quota exceeded" khi sử dụng Gemini API, mặc dù bảng điều khiển hiển thị chưa đạt giới hạn RPM/TPM/RPD.

## Nguyên nhân chính

1. **Không có kiểm soát request ở server-side**: Nhiều request có thể được gửi đồng thời
2. **Request burst**: Người dùng gửi nhiều request liên tiếp quá nhanh
3. **Retry quá mạnh**: Hệ thống retry tới 8 lần với delay ngắn, làm tăng áp lực lên API
4. **Không có queue request**: Mỗi request được xử lý độc lập, không có hàng đợi

## Giải pháp đã triển khai

### 1. Server-Side Rate Limiter (`lib/server-rate-limiter.ts`)

**Tính năng:**
- ✅ Chỉ cho phép 1 request chạy cùng lúc
- ✅ Đảm bảo ít nhất 3 giây giữa các request (tối đa ~20 request/phút)
- ✅ Hàng đợi FIFO (First In First Out)
- ✅ Global singleton - tất cả API routes dùng chung 1 queue

**Ví dụ:**
```
Request A → Xử lý ngay (0s)
Request B → Đợi 3s → Xử lý 
Request C → Đợi thêm 3s → Xử lý
```

### 2. Cấu hình Retry Thận trọng hơn

**Trước:**
- MaxRetries: 8 lần
- InitialDelay: 2 giây
- MaxDelay: 60 giây

**Sau:**
- MaxRetries: 3 lần
- InitialDelay: 5 giây  
- MaxDelay: 30 giây

### 3. Tất cả API Routes đã được cập nhật

Các endpoint sau đã được bọc với `withRateLimit()`:
- `/api/ai/score-essay` - Chấm điểm bài viết
- `/api/ai/chat` - Chatbot AI
- `/api/ai/grammar-check` - Kiểm tra ngữ pháp
- `/api/ai/paraphrase` - Diễn giải lại
- `/api/ai/generate-outline` - Tạo dàn ý
- `/api/ai/generate-prompts` - Tạo đề bài

### 4. Thông báo lỗi tốt hơn

**Trước:**
```
"API quota exceeded. Try again later."
```

**Sau:**
```
"AI chấm điểm đang vượt giới hạn sử dụng. Hệ thống đang quản lý nhiều yêu cầu để tránh vượt quota. Vui lòng thử lại sau 1-2 phút."
```

### 5. Logging chi tiết

Thêm log với timestamp và context để debug:
```
[score-essay] Error details: { 
  status: 429, 
  message: "...", 
  timestamp: "2025-11-18T06:30:00.000Z" 
}
```

## Cách sử dụng

### Không cần thay đổi code frontend

Frontend không cần thay đổi gì. Rate limiting hoạt động tự động ở server-side.

### Kiểm tra logs

Trong server logs, bạn sẽ thấy:
```
[Retry] Rate limit hit. Retry #1/3 after 5000ms
[score-essay] Error details: {...}
```

### Điều chỉnh nếu cần

Nếu vẫn gặp vấn đề, có thể tăng khoảng cách giữa requests:

**File: `lib/server-rate-limiter.ts`**
```typescript
export function getGeminiRateLimiter(): ServerRateLimiter {
  if (!geminiRateLimiter) {
    geminiRateLimiter = new ServerRateLimiter({
      maxConcurrent: 1,
      minInterval: 5000, // Tăng từ 3000 lên 5000 (12 RPM)
    })
  }
  return geminiRateLimiter
}
```

## Kiểm tra API Key & Project

### Bước 1: Xác nhận API Key
1. Vào [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Copy API key đang dùng cho project `ieltswriting`
3. So sánh với `GEMINI_API_KEY` trong file `.env.local`
4. Đảm bảo chúng giống nhau

### Bước 2: Kiểm tra Usage Dashboard
1. Vào [AI Studio Usage](https://aistudio.google.com/app/apikey)
2. Chọn đúng project trong dropdown
3. Xem RPM/TPM/RPD usage
4. Kiểm tra có spike hoặc pattern bất thường không

### Bước 3: Verify Billing (nếu cần)
1. Vào tab Billing
2. Kiểm tra có credit không
3. Xem có thông báo về free tier limits không

## Kết quả mong đợi

✅ **Giảm thiểu lỗi quota exceeded**: Rate limiting ngăn request burst  
✅ **Trải nghiệm ổn định hơn**: Request được xử lý theo thứ tự  
✅ **Thông báo lỗi rõ ràng hơn**: Người dùng biết vấn đề và cách khắc phục  
✅ **Debug dễ dàng hơn**: Logs chi tiết giúp tìm nguyên nhân  

## Lưu ý quan trọng

### Request sẽ chậm hơn
Với rate limiting, request thứ 2, 3, 4... sẽ phải đợi:
- Request 1: Ngay lập tức
- Request 2: Đợi 3+ giây
- Request 3: Đợi 3+ giây nữa
- v.v.

**Điều này là bình thường và cần thiết** để tránh vượt quota.

### Khuyến nghị
- **Cho production**: Nên enable billing và request quota cao hơn
- **Cho development**: Sử dụng giải pháp hiện tại
- **Tối ưu**: Cache responses khi có thể

## Tài liệu tham khảo

Xem file `RATE_LIMITING.md` để biết thêm chi tiết về:
- Cách hoạt động của rate limiter
- Troubleshooting
- Configuration tuning
- Best practices

## Hỗ trợ

Nếu vẫn gặp vấn đề sau khi áp dụng:
1. Kiểm tra logs để tìm pattern
2. Verify API key và project
3. Xem Usage dashboard
4. Tham khảo `RATE_LIMITING.md` cho troubleshooting

## Tóm tắt thay đổi code

- **Files mới**: 
  - `lib/server-rate-limiter.ts` - Rate limiter implementation
  - `RATE_LIMITING.md` - Documentation (English)
  - `VIETNAMESE_SUMMARY.md` - Tóm tắt (Tiếng Việt)

- **Files đã sửa**:
  - Tất cả 6 API routes trong `app/api/ai/`
  - `lib/retry-utils.ts` - Cấu hình retry
  - `tsconfig.json` - Target ES2020

- **Không đổi**:
  - Frontend components
  - UI/UX
  - Firebase integration
  - Các tính năng khác
