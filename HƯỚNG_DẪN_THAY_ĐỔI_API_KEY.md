# 🔑 Hướng Dẫn Thay Đổi API Key Gemini

## 📋 Mục Lục
1. [Tổng Quan](#tổng-quan)
2. [Khi Nào Cần Thay Đổi API Key](#khi-nào-cần-thay-đổi-api-key)
3. [Hướng Dẫn Chi Tiết](#hướng-dẫn-chi-tiết)
4. [Troubleshooting](#troubleshooting)
5. [Câu Hỏi Thường Gặp](#câu-hỏi-thường-gặp)

---

## Tổng Quan

**IELTS WriteBetter** sử dụng **Google Gemini API** để cung cấp các tính năng AI như:
- 🤖 Chấm điểm bài viết IELTS
- 💬 Chatbot hỗ trợ IELTS
- 📝 Kiểm tra ngữ pháp
- 🔄 Paraphrase văn bản
- 📋 Tạo dàn ý essay
- 📚 Tạo đề bài luyện tập

API key là chìa khóa để ứng dụng có thể sử dụng các dịch vụ AI này. Khi API key hết hạn hoặc vượt quota, bạn cần thay đổi hoặc cập nhật API key mới.

---

## Khi Nào Cần Thay Đổi API Key

Bạn cần thay đổi API key khi gặp các tình huống sau:

### ⚠️ Dấu Hiệu API Key Có Vấn Đề

| Triệu Chứng | Nguyên Nhân | Giải Pháp |
|------------|-------------|-----------|
| ❌ **"API key expired"** | API key đã hết hạn | Tạo API key mới |
| ❌ **"Quota exceeded"** | Đã dùng hết quota miễn phí | Đợi reset hoặc nâng cấp billing |
| ❌ **"Invalid API key"** | API key sai hoặc bị vô hiệu hóa | Kiểm tra và cập nhật lại |
| ❌ **"Permission denied"** | API key không có quyền truy cập | Kiểm tra permissions trong AI Studio |
| ⚠️ **"Rate limit hit"** | Gửi quá nhiều request | Đợi 1-2 phút rồi thử lại |

### 📊 Kiểm Tra Tình Trạng API Key

```bash
# Thông báo lỗi thường gặp trong console:
[Error] Failed to score essay: 429 RESOURCE_EXHAUSTED: Quota exceeded
[Error] API key not found or invalid
[Error] Permission denied for resource
```

---

## Hướng Dẫn Chi Tiết

### 🎯 Bước 1: Lấy API Key Mới Từ Google AI Studio

#### 1.1. Truy Cập Google AI Studio

1. Mở trình duyệt và truy cập: **https://aistudio.google.com/app/apikey**
2. Đăng nhập bằng tài khoản Google của bạn
   - ⚠️ **Lưu ý**: Đảm bảo bạn đăng nhập bằng tài khoản đúng nếu có nhiều tài khoản Google

#### 1.2. Tạo API Key Mới

**Option 1: Tạo API Key Trong Project Mới (Khuyến Nghị)**

```
┌─────────────────────────────────────────────────────────┐
│  Google AI Studio                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Nhấn nút "Create API Key"                          │
│                                                         │
│  2. Chọn "Create API key in new project"               │
│     ┌───────────────────────────────────────┐          │
│     │ ● Create API key in new project       │          │
│     │ ○ Create API key in existing project  │          │
│     └───────────────────────────────────────┘          │
│                                                         │
│  3. Nhấn "Create"                                      │
│                                                         │
│  4. Copy API key (chỉ hiển thị một lần!)              │
│     ┌───────────────────────────────────────┐          │
│     │ AIzaSy...........................     │ [📋]    │
│     └───────────────────────────────────────┘          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Option 2: Tạo API Key Trong Project Hiện Có**

Nếu bạn đã có project "ieltswriting" hoặc project khác:

1. Chọn "Create API key in existing project"
2. Chọn project từ dropdown
3. Nhấn "Create"
4. Copy API key

#### 1.3. Lưu Trữ API Key An Toàn

⚠️ **QUAN TRỌNG**: 
- API key chỉ hiển thị **MỘT LẦN duy nhất** khi tạo
- Lưu API key vào nơi an toàn ngay lập tức
- **KHÔNG** chia sẻ API key với người khác
- **KHÔNG** commit API key lên GitHub

**Gợi ý lưu trữ an toàn:**
- ✅ Lưu vào file `.env.local` (không được commit lên Git)
- ✅ Sử dụng password manager (1Password, LastPass, Bitwarden...)
- ✅ Lưu vào note app được mã hóa
- ❌ **KHÔNG** lưu vào file public hoặc commit lên GitHub
- ❌ **KHÔNG** share qua email hoặc chat không mã hóa

---

### 🔧 Bước 2: Cập Nhật API Key Trong Ứng Dụng

#### 2.1. Cho Môi Trường Development (Local)

**A. Tìm File `.env.local`**

```bash
cd /path/to/ielts-write-better-app
ls -la .env*
```

Bạn sẽ thấy:
- `.env.example` - File mẫu (KHÔNG chỉnh sửa file này)
- `.env.local` - File config của bạn (CẬP NHẬT file này)

**B. Nếu Chưa Có File `.env.local`**

Tạo file mới từ template:

```bash
# Copy từ file mẫu
cp .env.example .env.local

# Hoặc tạo file mới
touch .env.local
```

**C. Mở File `.env.local` và Cập Nhật**

Mở file bằng text editor yêu thích:

```bash
# Sử dụng VS Code
code .env.local

# Hoặc vim
vim .env.local

# Hoặc nano
nano .env.local
```

**D. Thay Đổi API Key**

```env
# .env.local

# ============================================
# GEMINI API CONFIGURATION
# ============================================

# Thay thế API key cũ bằng API key mới
GEMINI_API_KEY=AIzaSy...........................

# Optional: Chỉ định model cụ thể (nếu cần)
# GEMINI_MODEL=gemini-2.0-flash

# ============================================
# FIREBASE CONFIGURATION (nếu có)
# ============================================

# NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
# NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**E. Lưu File và Restart Server**

```bash
# Ctrl+C để dừng server hiện tại

# Khởi động lại
npm run dev

# Hoặc
pnpm dev

# Hoặc
yarn dev
```

#### 2.2. Cho Môi Trường Production (Vercel/Hosting)

**A. Nếu Deploy Trên Vercel**

1. Đăng nhập Vercel Dashboard: https://vercel.com/dashboard
2. Chọn project "ielts-write-better-app"
3. Vào **Settings** → **Environment Variables**
4. Tìm biến `GEMINI_API_KEY`
5. Nhấn **Edit** (icon ✏️)
6. Paste API key mới
7. Chọn môi trường áp dụng:
   - ✅ Production
   - ✅ Preview (nếu cần)
   - ✅ Development (nếu cần)
8. Nhấn **Save**
9. **Re-deploy** ứng dụng:
   - Vào tab **Deployments**
   - Nhấn **Redeploy** ở deployment mới nhất
   - Hoặc push commit mới lên GitHub để trigger auto-deploy

**B. Nếu Deploy Trên Netlify**

1. Đăng nhập Netlify Dashboard
2. Chọn site của bạn
3. Vào **Site settings** → **Environment variables**
4. Edit biến `GEMINI_API_KEY`
5. Paste API key mới
6. Save và trigger rebuild

**C. Nếu Deploy Trên Platform Khác**

Tham khảo tài liệu của platform về cách cập nhật environment variables.

---

### ✅ Bước 3: Kiểm Tra API Key Mới

#### 3.1. Kiểm Tra Local

**A. Restart Server**

```bash
# Dừng server (Ctrl+C)
# Khởi động lại
npm run dev
```

**B. Test Các Tính Năng**

1. ✍️ **Test Chấm Điểm Essay**:
   - Truy cập: http://localhost:3000/tasks/new
   - Tạo task mới
   - Viết một đoạn văn ngắn (150+ từ)
   - Submit để chấm điểm
   - Kiểm tra console logs

2. 💬 **Test Chatbot**:
   - Mở Chat Widget
   - Hỏi một câu đơn giản: "What is IELTS Writing Task 2?"
   - Kiểm tra response

3. 📝 **Test Grammar Check**:
   - Vào: http://localhost:3000/practice/grammar
   - Nhập một câu có lỗi ngữ pháp
   - Submit và kiểm tra kết quả

**C. Kiểm Tra Console Logs**

Mở Developer Tools (F12) và xem Console:

```
✅ Success logs:
[AI] Gemini model initialized successfully
[score-essay] Processing essay...
[score-essay] Score generated successfully

❌ Error logs (nếu có vấn đề):
[Error] Invalid API key
[Error] Quota exceeded
[Error] Rate limit hit
```

#### 3.2. Kiểm Tra API Key Từ Command Line

**Test API Key Trực Tiếp**

Tạo file test script:

```javascript
// test-api.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSy..."; // API key của bạn

async function testAPI() {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const result = await model.generateContent("Say hello!");
    const response = result.response;
    const text = response.text();
    
    console.log("✅ API Key hoạt động!");
    console.log("Response:", text);
  } catch (error) {
    console.error("❌ API Key có vấn đề:");
    console.error(error.message);
  }
}

testAPI();
```

Chạy test:

```bash
node test-api.js
```

#### 3.3. Kiểm Tra Quota Usage

1. Truy cập: https://aistudio.google.com/app/apikey
2. Chọn API key của bạn
3. Xem usage metrics:
   - **RPM (Requests Per Minute)**: Số request mỗi phút
   - **TPM (Tokens Per Minute)**: Số token mỗi phút
   - **RPD (Requests Per Day)**: Số request mỗi ngày

**Free Tier Limits (tham khảo):**
```
┌──────────────────────────────────────────┐
│  Gemini 2.0 Flash (Free Tier)           │
├──────────────────────────────────────────┤
│  RPM:  15 requests/minute                │
│  TPM:  1,000,000 tokens/minute           │
│  RPD:  1,500 requests/day                │
└──────────────────────────────────────────┘
```

---

## Troubleshooting

### 🔴 Vấn Đề 1: API Key Không Hoạt Động

**Triệu chứng:**
```
Error: Invalid API key
```

**Giải pháp:**

1. **Kiểm tra API key có đúng không**
   ```bash
   # Xem API key trong .env.local
   cat .env.local | grep GEMINI_API_KEY
   
   # So sánh với API key trong AI Studio
   ```

2. **Kiểm tra format API key**
   - API key phải bắt đầu bằng `AIzaSy...`
   - Không có dấu cách ở đầu hoặc cuối
   - Không có dấu ngoặc kép thừa

3. **Tạo API key mới**
   - Đôi khi API key bị lỗi khi tạo
   - Thử tạo API key mới và test lại

---

### 🔴 Vấn Đề 2: Quota Exceeded

**Triệu chứng:**
```
Error: 429 RESOURCE_EXHAUSTED: Quota exceeded
```

**Giải pháp:**

**A. Kiểm Tra Usage**

1. Vào: https://aistudio.google.com/app/apikey
2. Xem usage dashboard
3. Kiểm tra xem đã vượt limit nào:
   - RPM (per minute)
   - TPM (tokens per minute)
   - RPD (per day)

**B. Giải Pháp Tức Thì**

| Limit Exceeded | Thời Gian Chờ | Hành Động |
|----------------|---------------|-----------|
| RPM | 1 phút | Đợi 1-2 phút rồi thử lại |
| TPM | 1 phút | Giảm độ dài text gửi đi |
| RPD | 24 giờ | Đợi sang ngày hôm sau hoặc nâng cấp |

**C. Giải Pháp Dài Hạn**

1. **Enable Billing** (Nâng cấp lên Pay-as-you-go):
   - Vào: https://console.cloud.google.com/billing
   - Link project với billing account
   - Quota sẽ tăng đáng kể:
     ```
     Free Tier:  15 RPM, 1,500 RPD
     Paid Tier:  1,000+ RPM, Unlimited RPD
     ```

2. **Tối Ưu Hóa Sử Dụng**:
   - Cache responses khi có thể
   - Giảm số lần retry
   - Implement debouncing cho user input
   - Sử dụng server-side rate limiting (đã có trong app)

**D. Kiểm Tra Rate Limiter**

App đã có sẵn rate limiting:

```typescript
// lib/server-rate-limiter.ts
// Cấu hình hiện tại:
maxConcurrent: 1           // Chỉ 1 request cùng lúc
minInterval: 3000          // 3 giây giữa các request
                           // = ~20 requests/phút
```

Nếu vẫn gặp vấn đề, tăng `minInterval`:

```typescript
// lib/server-rate-limiter.ts
export function getGeminiRateLimiter(): ServerRateLimiter {
  if (!geminiRateLimiter) {
    geminiRateLimiter = new ServerRateLimiter({
      maxConcurrent: 1,
      minInterval: 5000, // Tăng lên 5 giây = 12 RPM
    })
  }
  return geminiRateLimiter
}
```

---

### 🔴 Vấn Đề 3: Permission Denied

**Triệu chứng:**
```
Error: Permission denied for resource
```

**Giải pháp:**

1. **Kiểm tra API Key có đúng project không**
   - Vào AI Studio
   - Xem API key thuộc project nào
   - Đảm bảo Generative AI API đã được enable

2. **Enable Generative AI API**:
   ```
   1. Vào: https://console.cloud.google.com/apis/library
   2. Tìm "Generative Language API"
   3. Nhấn "Enable"
   4. Đợi vài phút để API được kích hoạt
   ```

3. **Kiểm tra Billing**:
   - Một số API yêu cầu billing được enable
   - Vào: https://console.cloud.google.com/billing
   - Link project với billing account (có thể dùng free credits)

---

### 🔴 Vấn Đề 4: Server Không Nhận API Key Mới

**Triệu chứng:**
- Đã update `.env.local`
- Restart server nhưng vẫn dùng API key cũ

**Giải pháp:**

1. **Hard Restart**
   ```bash
   # Dừng tất cả process Node.js
   pkill -f node
   
   # Xóa cache
   rm -rf .next
   rm -rf node_modules/.cache
   
   # Restart
   npm run dev
   ```

2. **Verify Environment Variables**
   ```bash
   # In ra env vars trong server
   # Thêm vào app/api/ai/score-essay/route.ts (tạm thời):
   console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY?.substring(0, 20) + '...')
   ```

3. **Kiểm tra Process**
   ```bash
   # Xem process đang chạy
   ps aux | grep node
   
   # Kill process cũ nếu còn
   kill -9 [PID]
   ```

---

### 🔴 Vấn Đề 5: API Key Hoạt Động Local Nhưng Không Hoạt Động Production

**Nguyên nhân:**
- Environment variables chưa được cập nhật trên hosting platform

**Giải pháp:**

1. **Vercel**:
   ```
   Settings → Environment Variables → Edit GEMINI_API_KEY → Save → Redeploy
   ```

2. **Netlify**:
   ```
   Site settings → Environment variables → Edit GEMINI_API_KEY → Save → Trigger deploy
   ```

3. **Kiểm tra logs**:
   - Vào deployment logs
   - Tìm error messages
   - Verify API key có được load không

---

## Câu Hỏi Thường Gặp

### ❓ API Key có hết hạn không?

**Trả lời:**
- ✅ **Không**, API key của Google AI Studio **không hết hạn** theo thời gian
- ⚠️ Tuy nhiên có thể hết quota hoặc bị disable nếu:
  - Vượt quota free tier
  - Vi phạm terms of service
  - Project/billing account bị suspend

---

### ❓ Tôi Có Thể Dùng Nhiều API Key Không?

**Trả lời:**
- ✅ **Có**, bạn có thể tạo nhiều API key cho các môi trường khác nhau:
  ```
  - API Key A: Development
  - API Key B: Staging
  - API Key C: Production
  ```
- 🎯 **Khuyến nghị**: Dùng API key khác nhau để dễ theo dõi usage

---

### ❓ Làm Sao Biết API Key Còn Hoạt Động?

**Trả lời:**

**Cách 1: Kiểm tra trong AI Studio**
```
1. Vào: https://aistudio.google.com/app/apikey
2. Xem danh sách API keys
3. Status sẽ hiển thị: Active, Disabled, hoặc Deleted
```

**Cách 2: Test bằng curl**
```bash
curl https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_API_KEY \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

**Cách 3: Kiểm tra trong app**
- Mở Developer Tools (F12)
- Vào Console
- Tìm log messages từ AI API

---

### ❓ Tôi Có Thể Share API Key Với Teammate Không?

**Trả lời:**
- ⚠️ **Không khuyến khích** vì:
  - Khó kiểm soát usage
  - Risk bảo mật cao
  - Khó debug khi có vấn đề

- ✅ **Nên làm**:
  - Mỗi người tạo API key riêng cho development
  - Dùng chung 1 API key cho production (lưu trong hosting env vars)
  - Sử dụng Google Cloud IAM để quản lý permissions

---

### ❓ API Key Bị Lộ, Phải Làm Gì?

**Trả lời:**

**🚨 HỖ NGUY CẤP:**

1. **Xóa API Key Ngay Lập Tức**:
   ```
   1. Vào: https://aistudio.google.com/app/apikey
   2. Tìm API key bị lộ
   3. Nhấn Delete
   4. Confirm xóa
   ```

2. **Tạo API Key Mới**:
   - Follow hướng dẫn ở Bước 1

3. **Update Ứng Dụng**:
   - Follow hướng dẫn ở Bước 2

4. **Kiểm Tra Usage**:
   - Xem có hoạt động bất thường không
   - Kiểm tra billing (nếu có)

5. **Ngăn Chặn Tương Lai**:
   - ✅ Add `.env.local` vào `.gitignore`
   - ✅ Never commit secrets lên GitHub
   - ✅ Use environment variables cho sensitive data
   - ✅ Enable GitHub secret scanning

---

### ❓ Free Tier Có Đủ Để Dùng Không?

**Trả lời:**

**Cho Development:**
```
✅ ĐỦ - Free tier rất đủ cho development và testing
```

**Cho Production (personal use):**
```
✅ ĐỦ - Nếu số người dùng ít (<10 users)
```

**Cho Production (commercial):**
```
⚠️ CẦN NÂNG CẤP - Nên enable billing để:
- Tăng quota
- Đảm bảo service stability
- Priority support
```

**Tính toán:**
```
Free Tier: 1,500 requests/day

Ví dụ sử dụng:
- 1 user score 3 essays/day = 3 requests
- 50 users = 150 requests/day ✅ OK
- 500 users = 1,500 requests/day ⚠️ AT LIMIT
- 1,000 users = 3,000 requests/day ❌ NEED UPGRADE
```

---

### ❓ Làm Sao Tối Ưu Hóa Sử Dụng API?

**Trả lời:**

**1. Implement Caching**
```typescript
// Cache AI responses để tránh gọi lại
const cacheKey = `score_${hash(essay)}`
const cached = await cache.get(cacheKey)
if (cached) return cached

const result = await scoreEssay(essay)
await cache.set(cacheKey, result, { ttl: 3600 })
return result
```

**2. Debouncing User Input**
```typescript
// Đợi user gõ xong mới gọi API
const debouncedCheck = useMemo(
  () => debounce((text) => checkGrammar(text), 1000),
  []
)
```

**3. Batch Requests**
```typescript
// Gộp nhiều requests nhỏ thành 1 request lớn
// Thay vì check từng câu, check cả đoạn văn
```

**4. Lazy Loading**
```typescript
// Chỉ load AI features khi cần
// Không gọi API khi page load
```

---

## 📚 Tài Liệu Tham Khảo

### 🔗 Links Hữu Ích

| Resource | URL |
|----------|-----|
| Google AI Studio | https://aistudio.google.com/app/apikey |
| Gemini API Docs | https://ai.google.dev/docs |
| Google Cloud Console | https://console.cloud.google.com/ |
| Billing Dashboard | https://console.cloud.google.com/billing |
| API Library | https://console.cloud.google.com/apis/library |

### 📖 Tài Liệu Dự Án

| File | Mô tả |
|------|-------|
| `README.md` | Hướng dẫn setup tổng quan |
| `VIETNAMESE_SUMMARY.md` | Giải pháp quản lý quota API |
| `RATE_LIMITING.md` | Chi tiết về rate limiting |
| `.env.example` | Template cho environment variables |

---

## 🎯 Checklist: Đảm Bảo API Key Hoạt Động

```
□ Đã tạo API key mới từ Google AI Studio
□ Đã copy và lưu API key an toàn
□ Đã cập nhật file .env.local
□ Đã restart development server
□ Đã test chức năng chấm điểm essay
□ Đã test chatbot
□ Đã kiểm tra console không có lỗi
□ Đã cập nhật environment variables trên production (nếu cần)
□ Đã redeploy production (nếu cần)
□ Đã verify API key hoạt động trên production
□ Đã kiểm tra quota usage
□ Đã add .env.local vào .gitignore
```

---

## 💡 Tips và Best Practices

### ✅ Nên Làm

1. **Tổ chức API Keys**
   ```
   Development:  APIKey_Dev_123...
   Staging:      APIKey_Stage_456...
   Production:   APIKey_Prod_789...
   ```

2. **Monitoring**
   - Theo dõi usage hàng ngày
   - Set alerts khi gần vượt quota
   - Log mọi API calls

3. **Security**
   - Rotate API keys định kỳ (3-6 tháng)
   - Never commit secrets
   - Use environment variables
   - Enable GitHub secret scanning

4. **Documentation**
   - Document API key locations
   - Share how to rotate keys với team
   - Maintain runbook cho incidents

### ❌ Không Nên Làm

1. ❌ **KHÔNG** commit API key lên GitHub
2. ❌ **KHÔNG** share API key qua chat/email không mã hóa
3. ❌ **KHÔNG** hard-code API key trong source code
4. ❌ **KHÔNG** dùng chung API key giữa nhiều environments
5. ❌ **KHÔNG** quên update production khi thay key

---

## 🆘 Hỗ Trợ

### Cần Thêm Giúp Đỡ?

1. **Check Documentation**:
   - README.md trong project
   - VIETNAMESE_SUMMARY.md
   - RATE_LIMITING.md

2. **Google AI Support**:
   - Community Forum: https://discuss.ai.google.dev/
   - GitHub Issues: https://github.com/google/generative-ai-js

3. **Project Issues**:
   - Tạo issue trong GitHub repository
   - Describe vấn đề chi tiết
   - Include error logs (remove sensitive data)

---

## 📝 Changelog

| Ngày | Phiên Bản | Thay Đổi |
|------|-----------|----------|
| 25/12/2024 | 1.0 | Initial version - Hướng dẫn đầy đủ về thay đổi API key |

---

**Tác giả:** IELTS WriteBetter Team  
**Cập nhật lần cuối:** 25/12/2024  
**Phiên bản:** 1.0

---

> 💡 **Tip**: Bookmark tài liệu này để tham khảo sau này khi cần thay đổi API key!

