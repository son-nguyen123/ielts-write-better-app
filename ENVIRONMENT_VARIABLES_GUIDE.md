# 🔐 Hướng dẫn cấu hình Environment Variables

## Thông tin dành cho bạn đang deploy

Dựa trên code trong repository **son-nguyen123/ielts-write-better-app**, đây là **danh sách đầy đủ các biến môi trường** bạn cần cấu hình khi deploy trên **Vercel** hoặc **Cloudflare Pages**.

---

## ✅ Biến môi trường BẮT BUỘC

### 1. `GEMINI_API_KEY` ⭐ **QUAN TRỌNG NHẤT**

**Key phải nhập:** `GEMINI_API_KEY`

**Value:** API key của bạn từ Google AI Studio (có dạng `AIza...`)

**Mô tả:** Đây là biến **bắt buộc** để ứng dụng hoạt động. Code sử dụng biến này ở nhiều nơi:
- File `lib/ai.ts` (dòng 8): `process.env.GEMINI_API_KEY`
- File `lib/gemini-native.ts` (dòng 7): `process.env.GEMINI_API_KEY`

**Lấy API key ở đâu:**
1. Truy cập: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy key (có dạng `AIzaSy...`)

**⚠️ LƯU Ý BẢO MẬT:**
- Key bạn đang dán có dạng `AIza...` là Google API key thật
- **BẠN NÊN TẠO KEY MỚI** và thu hồi (revoke) key cũ vì đã lộ trong ảnh/chat
- Không chia sẻ key này với ai

---

## 📝 Biến môi trường TÙY CHỌN (Optional)

Các biến này chỉ cần thiết **nếu bạn muốn sử dụng Firebase** cho authentication/database. Nếu không dùng Firebase, bạn có thể bỏ qua.

### 2. Firebase Configuration (Tùy chọn)

Nếu bạn muốn kích hoạt Firebase, thêm các biến sau:

| Key | Value | Lấy ở đâu |
|-----|-------|-----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | your-project.firebaseapp.com | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | your-project-id | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | your-project.appspot.com | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender ID | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID | Firebase Console → Project Settings |

**Lưu ý:** Tất cả biến Firebase đều có prefix `NEXT_PUBLIC_` vì chúng cần được truy cập từ client-side (trình duyệt).

---

## 🚀 Cách cấu hình trên Vercel

### Bước 1: Truy cập Settings

1. Vào project của bạn trên Vercel
2. Click tab **"Settings"** (thanh menu bên trái)
3. Chọn **"Environment Variables"** trong menu Settings

### Bước 2: Thêm biến môi trường

Với mỗi biến cần thêm:

1. **Key:** Nhập chính xác tên biến (ví dụ: `GEMINI_API_KEY`)
2. **Value:** Dán giá trị của biến (API key)
3. **Environments:** Chọn môi trường áp dụng:
   - ✅ **Production** (bắt buộc cho production)
   - ✅ **Preview** (khuyên dùng để test trước khi deploy chính thức)
   - ✅ **Development** (tùy chọn, cho local development)
   
   **Khuyên dùng:** Chọn **"All Environments"** để áp dụng cho tất cả

4. Click **"Save"**

### Bước 3: Redeploy

Sau khi thêm biến môi trường:
1. Vào tab **"Deployments"**
2. Click **"Redeploy"** trên deployment mới nhất
3. Đợi deploy hoàn tất (~2-3 phút)

---

## 🌐 Cách cấu hình trên Cloudflare Pages

### Bước 1: Truy cập Settings

1. Vào project của bạn trên Cloudflare Pages
2. Click tab **"Settings"**
3. Scroll xuống **"Environment Variables"**

### Bước 2: Thêm biến môi trường

1. Click **"Add variable"**
2. **Variable name:** Nhập tên biến (ví dụ: `GEMINI_API_KEY`)
3. **Value:** Dán giá trị
4. **Environment:** Chọn:
   - ✅ **Production**
   - ✅ **Preview** (nếu có)
5. Click **"Save"**

### Bước 3: Redeploy

1. Vào tab **"Deployments"**
2. Click **"Retry deployment"** hoặc push code mới để trigger build

---

## 📋 Checklist cấu hình

### Cấu hình tối thiểu (Minimum để app chạy được):

- [ ] `GEMINI_API_KEY` - **BẮT BUỘC**

### Cấu hình đầy đủ (Full features với Firebase):

- [ ] `GEMINI_API_KEY` - **BẮT BUỘC**
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY` - Tùy chọn
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Tùy chọn
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Tùy chọn
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Tùy chọn
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Tùy chọn
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID` - Tùy chọn

---

## ❓ Câu hỏi thường gặp (FAQ)

### Q1: Tại sao app báo lỗi "GEMINI_API_KEY is not set"?

**A:** Bạn chưa thêm biến `GEMINI_API_KEY` hoặc nhập sai tên. Đảm bảo:
- Key phải là **ĐÚNG** `GEMINI_API_KEY` (không phải `CLIENT_KEY` hay tên khác)
- Value phải là API key hợp lệ từ Google AI Studio
- Đã redeploy sau khi thêm biến

### Q2: Tôi nên dùng `GEMINI_API_KEY` hay `NEXT_PUBLIC_GEMINI_API_KEY`?

**A:** Dùng **`GEMINI_API_KEY`** (không có prefix `NEXT_PUBLIC_`).

Lý do: Biến này được dùng ở server-side (API routes) nên không cần `NEXT_PUBLIC_`. Thêm prefix sẽ làm lộ API key ra client-side (không an toàn).

### Q3: Key có dạng AIza... có phải Google API key không?

**A:** Đúng! Đó là Google API key (Gemini API). Bạn đang làm đúng rồi, chỉ cần:
- Đảm bảo key còn hạn sử dụng
- Key có quyền truy cập Gemini API
- Nhập vào field **Value** trong Vercel/Cloudflare

### Q4: Tôi có thể dùng Firebase sau này được không?

**A:** Có! Firebase variables là optional. Bạn có thể:
1. Deploy app chỉ với `GEMINI_API_KEY` trước
2. Thêm Firebase variables sau khi app đã chạy

### Q5: App có chạy được trên local không?

**A:** Có! Tạo file `.env.local` trong thư mục gốc:

```bash
GEMINI_API_KEY=your_api_key_here
```

Sau đó chạy:
```bash
npm run dev
```

---

## 🔗 Tài nguyên hữu ích

- [Google AI Studio - Tạo API key](https://makersuite.google.com/app/apikey)
- [Vercel Environment Variables Docs](https://vercel.com/docs/projects/environment-variables)
- [Cloudflare Pages Environment Variables](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

---

## 📸 Ảnh minh họa

Dựa trên màn hình Settings → Environment Variables bạn đang thấy:

```
┌─────────────────────────────────────────────────────┐
│ Add Environment Variable                            │
├─────────────────────────────────────────────────────┤
│ Key:    GEMINI_API_KEY                             │
│                                                     │
│ Value:  AIzaSy... (your actual API key)           │
│                                                     │
│ Environments:                                       │
│ ☑ Production                                       │
│ ☑ Preview                                          │
│ ☑ Development                                      │
│                                                     │
│              [Cancel]  [Save]                      │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Tóm tắt

**Key bạn cần nhập:** `GEMINI_API_KEY`

**Value:** API key có dạng `AIza...` từ Google AI Studio

**Environments:** Chọn tất cả (Production + Preview + Development)

**Sau đó:** Save và Redeploy

✅ Xong! App sẽ chạy được sau khi deploy xong.

---

*File này được tạo tự động dựa trên phân tích code trong repository. Nếu có thắc mắc, vui lòng tạo issue hoặc liên hệ maintainer.*
