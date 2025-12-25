# 🚀 Hướng Dẫn Nhanh - IELTS WriteBetter

## 🔑 API Key Hết Hạn? Đây Là Cách Thay Đổi!

### ⚡ Hướng Dẫn Siêu Nhanh (5 phút)

#### 1️⃣ Lấy API Key Mới

```
1. Truy cập: https://aistudio.google.com/app/apikey
2. Đăng nhập Google
3. Nhấn "Create API Key"
4. Chọn "Create API key in new project"
5. Copy API key (AIzaSy...)
```

#### 2️⃣ Cập Nhật API Key

**Cho Development (Local):**

```bash
# Mở file .env.local
code .env.local

# Thay đổi dòng này:
GEMINI_API_KEY=your_old_key_here
# Thành:
GEMINI_API_KEY=AIzaSy...your_new_key_here

# Lưu file và restart server
# Ctrl+C để dừng
npm run dev
```

**Cho Production (Vercel):**

```
1. Vào: https://vercel.com/dashboard
2. Chọn project
3. Settings → Environment Variables
4. Edit GEMINI_API_KEY
5. Paste API key mới
6. Save → Redeploy
```

#### 3️⃣ Kiểm Tra

```bash
# Test local
# Vào: http://localhost:3000/tasks/new
# Tạo task mới và submit

# Xem console (F12) không có lỗi
# ✅ Should see: "Score generated successfully"
```

---

## 📚 Tài Liệu Chi Tiết

Để biết thêm chi tiết, xem:

| Tài Liệu | Nội Dung |
|----------|----------|
| **[HƯỚNG_DẪN_THAY_ĐỔI_API_KEY.md](./HƯỚNG_DẪN_THAY_ĐỔI_API_KEY.md)** | 📖 Hướng dẫn đầy đủ về thay đổi API key |
| **[README.md](./README.md)** | 🏠 Hướng dẫn setup tổng quan |
| **[VIETNAMESE_SUMMARY.md](./VIETNAMESE_SUMMARY.md)** | 🔧 Giải pháp quản lý quota API |
| **[RATE_LIMITING.md](./RATE_LIMITING.md)** | ⚙️ Chi tiết về rate limiting |

---

## 🆘 Gặp Vấn Đề?

### Lỗi Thường Gặp

| Lỗi | Giải Pháp |
|-----|-----------|
| ❌ "Invalid API key" | Kiểm tra API key có đúng format `AIzaSy...` |
| ❌ "Quota exceeded" | Đợi 1-2 phút hoặc enable billing |
| ❌ "Permission denied" | Enable Generative Language API trong Cloud Console |
| ⚠️ "Rate limit hit" | Bình thường, hệ thống có rate limiting, đợi 1 phút |

### Checklist Debug

```
□ API key có bắt đầu bằng AIzaSy... không?
□ Đã lưu file .env.local chưa?
□ Đã restart server chưa? (Ctrl+C và npm run dev)
□ Console có lỗi gì không? (F12)
□ API key có trong AI Studio không? (Check status: Active)
```

---

## 💡 Tips Hữu Ích

### ✅ Nên Làm

- 🔒 **Bảo mật**: Đừng commit `.env.local` lên GitHub
- 📊 **Theo dõi**: Kiểm tra usage tại https://aistudio.google.com/app/apikey
- 💾 **Backup**: Lưu API key vào password manager
- 🔄 **Rotate**: Thay API key định kỳ (3-6 tháng)

### ❌ Không Nên Làm

- ❌ Share API key qua chat/email
- ❌ Hard-code API key trong code
- ❌ Dùng chung API key cho dev/prod
- ❌ Quên restart server sau khi đổi key

---

## 🎯 Quota & Limits

### Free Tier (Miễn Phí)

```
📊 Gemini 2.0 Flash - Free Tier:
   • 15 requests/phút
   • 1,000,000 tokens/phút  
   • 1,500 requests/ngày

✅ Đủ cho: Development, testing, personal use
⚠️ Cần nâng cấp cho: Production với nhiều users
```

### Nâng Cấp Billing

```
💳 Enable Billing → Tăng quota lên:
   • 1,000+ requests/phút
   • Unlimited requests/ngày
   • Priority support

Link: https://console.cloud.google.com/billing
```

---

## 🔗 Links Quan Trọng

| Service | URL |
|---------|-----|
| 🔑 **API Keys** | https://aistudio.google.com/app/apikey |
| 📊 **Usage Dashboard** | https://aistudio.google.com/app/apikey (chọn key → view usage) |
| ☁️ **Cloud Console** | https://console.cloud.google.com/ |
| 💳 **Billing** | https://console.cloud.google.com/billing |
| 📚 **Gemini Docs** | https://ai.google.dev/docs |

---

## 📞 Hỗ Trợ

### Cần Giúp Đỡ Thêm?

1. **Xem tài liệu chi tiết**: [HƯỚNG_DẪN_THAY_ĐỔI_API_KEY.md](./HƯỚNG_DẪN_THAY_ĐỔI_API_KEY.md)
2. **Tạo issue**: https://github.com/son-nguyen123/ielts-write-better-app/issues
3. **Google AI Forum**: https://discuss.ai.google.dev/

---

**Tạo bởi:** IELTS WriteBetter Team  
**Cập nhật:** 25/12/2024

> 💡 **Tip**: Bookmark page này để tham khảo nhanh khi cần!
