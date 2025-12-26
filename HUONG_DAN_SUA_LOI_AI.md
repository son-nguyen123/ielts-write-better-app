# 🔧 Hướng Dẫn Khắc Phục Lỗi AI Không Hoạt Động

## 🔴 Vấn đề: Tất cả tính năng AI không hoạt động

Nếu bạn gặp các lỗi sau khi sử dụng ứng dụng:
- ❌ "Thiếu GEMINI_API_KEY trong cấu hình"
- ❌ "AI chấm điểm đang vượt giới hạn sử dụng"
- ❌ Chấm điểm bài viết không hoạt động
- ❌ Kiểm tra ngữ pháp báo lỗi
- ❌ Diễn giải câu không chạy
- ❌ AI chat không phản hồi
- ❌ Tạo outline báo lỗi

## ✅ Nguyên nhân chính

**Thiếu file `.env.local` hoặc thiếu `GEMINI_API_KEY` trong file đó.**

Tất cả tính năng AI trong ứng dụng đều yêu cầu Gemini API Key từ Google để hoạt động. Nếu không có API key, toàn bộ tính năng AI sẽ không thể kết nối với Google Gemini AI.

## 🚀 Cách khắc phục (5 phút)

### Bước 1: Kiểm tra file .env.local

Mở terminal/cmd tại thư mục gốc của project và chạy:

```bash
# Trên Linux/Mac
ls -la .env.local

# Trên Windows
dir .env.local
```

**Nếu không tìm thấy file**, đó chính là nguyên nhân. Chuyển sang Bước 2.

**Nếu có file**, mở file và kiểm tra xem có dòng `GEMINI_API_KEY=...` chưa.

### Bước 2: Lấy Gemini API Key miễn phí

1. **Truy cập Google AI Studio**
   - Mở trình duyệt và vào: https://aistudio.google.com/app/apikey

2. **Đăng nhập**
   - Sử dụng tài khoản Google của bạn (Gmail)
   - Nếu chưa có tài khoản Google, hãy tạo một tài khoản miễn phí

3. **Tạo API Key**
   - Nhấn nút **"Create API key"** (Tạo khóa API)
   - Chọn **"Create API key in new project"** nếu đây là lần đầu
   - Hoặc chọn project có sẵn nếu bạn đã có

4. **Sao chép API Key**
   - API key sẽ hiển thị dạng: `AIzaSy...` (khoảng 39 ký tự)
   - Nhấn nút **Copy** để sao chép
   - ⚠️ **LƯU Ý**: Giữ API key này bí mật, không chia sẻ công khai

### Bước 3: Tạo file .env.local

#### Cách 1: Sử dụng file mẫu có sẵn (Khuyên dùng)

```bash
# Sao chép file template
cp .env.local.template .env.local
```

Sau đó mở file `.env.local` và thay thế `your_gemini_api_key_here` bằng API key bạn vừa lấy.

#### Cách 2: Tạo file mới

**Trên Linux/Mac:**
```bash
echo "GEMINI_API_KEY=your_api_key_here" > .env.local
```

**Trên Windows (PowerShell):**
```powershell
echo "GEMINI_API_KEY=your_api_key_here" > .env.local
```

**Hoặc tạo thủ công:**
1. Tạo file mới tên `.env.local` trong thư mục gốc project
2. Thêm nội dung:
```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Bước 4: Dán API Key vào file

Mở file `.env.local` bằng text editor (VS Code, Notepad++, v.v.) và thay thế:

**Trước:**
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Sau:**
```env
GEMINI_API_KEY=AIzaSyABC123XYZ456def789...
```

Lưu file lại.

### Bước 5: Khởi động lại ứng dụng

1. **Dừng server hiện tại**
   - Nhấn `Ctrl + C` trong terminal đang chạy server

2. **Khởi động lại**
   ```bash
   # Với npm
   npm run dev
   
   # Với pnpm
   pnpm dev
   
   # Với yarn
   yarn dev
   ```

3. **Kiểm tra**
   - Mở trình duyệt: http://localhost:3000
   - Thử tính năng chấm điểm hoặc chat AI
   - Nếu không còn lỗi → ✅ **Thành công!**

## 🔍 Cách kiểm tra API Key đã hoạt động

### Test 1: Kiểm tra environment variable

Thêm dòng log tạm thời vào file `lib/ai.ts`:

```typescript
export function ensureGeminiApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY
  console.log("API Key status:", apiKey ? "✅ Đã có" : "❌ Không có")
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set")
  }
  return apiKey
}
```

Sau đó khởi động lại và xem console output.

### Test 2: Thử tính năng AI

1. Vào trang **Tasks** (http://localhost:3000/tasks)
2. Tạo một bài viết mới
3. Nhấn nút **Score** để chấm điểm
4. Nếu có kết quả → ✅ **API hoạt động!**
5. Nếu vẫn lỗi → Xem phần "Các lỗi khác" bên dưới

## ⚠️ Các lỗi khác có thể gặp

### Lỗi 1: "Rate limit exceeded" / "Quota exhausted"

**Nguyên nhân:** Bạn đã sử dụng hết quota miễn phí (15 requests/phút)

**Giải pháp:**
- Đợi 1-2 phút rồi thử lại
- Gemini free tier có giới hạn: 15 requests/phút
- Nếu cần nhiều hơn, xem xét nâng cấp lên paid plan

### Lỗi 2: "Invalid API key"

**Nguyên nhân:** API key không đúng hoặc đã bị vô hiệu hóa

**Giải pháp:**
1. Kiểm tra lại API key có bị sai ký tự không
2. Vào https://aistudio.google.com/app/apikey
3. Xem trạng thái API key
4. Nếu cần, tạo API key mới

### Lỗi 3: "Network error" / "Connection timeout"

**Nguyên nhân:** Không kết nối được internet hoặc Google AI Studio bị chặn

**Giải pháp:**
- Kiểm tra kết nối internet
- Thử tắt VPN nếu đang bật
- Kiểm tra firewall có chặn kết nối đến `generativelanguage.googleapis.com` không

### Lỗi 4: "Model not found" / "gemini-2.0-flash not available"

**Nguyên nhân:** Model chưa available ở region của bạn

**Giải pháp:**
- Thử đổi model trong `lib/ai.ts` và `lib/gemini-native.ts`
- Thay `gemini-2.0-flash` bằng `gemini-1.5-flash` hoặc `gemini-1.5-pro`

### Lỗi 5: API Key có trong .env.local nhưng vẫn báo thiếu

**Nguyên nhân:** File .env.local không được load

**Giải pháp:**
1. Đảm bảo file tên chính xác là `.env.local` (có dấu chấm ở đầu)
2. File phải nằm ở **thư mục gốc** của project (cùng cấp với package.json)
3. **Khởi động lại server** sau khi tạo file
4. Kiểm tra file có bị ignore bởi `.gitignore` không (nó phải bị ignore)

## 📋 Checklist khắc phục

Làm theo thứ tự để đảm bảo không bỏ sót:

- [ ] File `.env.local` đã tồn tại trong thư mục gốc project
- [ ] File chứa dòng `GEMINI_API_KEY=...` với API key hợp lệ
- [ ] API key có 39 ký tự, bắt đầu bằng `AIzaSy`
- [ ] Không có khoảng trắng trước/sau dấu `=`
- [ ] Không có dấu ngoặc kép quanh API key
- [ ] Đã khởi động lại server sau khi tạo file
- [ ] Có thể truy cập https://aistudio.google.com/app/apikey
- [ ] API key còn hoạt động (không bị revoke)

## 🆘 Vẫn không được?

Nếu đã làm tất cả các bước trên mà vẫn lỗi:

1. **Kiểm tra log chi tiết**
   - Mở Developer Tools (F12) trong browser
   - Vào tab Console
   - Xem có lỗi gì được log không
   - Chụp ảnh và tìm kiếm error message trên Google

2. **Kiểm tra Network requests**
   - F12 → Tab Network
   - Filter "API" hoặc "gemini"
   - Xem response của request thất bại
   - Kiểm tra status code và error message

3. **Xóa cache và build lại**
   ```bash
   # Xóa cache
   rm -rf .next
   rm -rf node_modules/.cache
   
   # Build lại
   npm run build
   npm run dev
   ```

4. **Tạo issue trên GitHub**
   - Truy cập: https://github.com/son-nguyen123/ielts-write-better-app/issues
   - Tạo issue mới với tiêu đề: "[BUG] AI không hoạt động"
   - Mô tả chi tiết:
     - Bước nào đã làm
     - Lỗi gì đang gặp (kèm screenshot)
     - Môi trường: OS, Node version, npm/pnpm version

## 📚 Tài nguyên hữu ích

- [Google AI Studio](https://aistudio.google.com/app/apikey) - Tạo API key
- [Gemini API Documentation](https://ai.google.dev/docs) - Tài liệu chính thức
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables) - Cách hoạt động của .env
- [FIX_GEMINI_API_KEY.md](./FIX_GEMINI_API_KEY.md) - Tài liệu tiếng Anh chi tiết

## 💡 Tips bổ sung

### Bảo mật API Key

- ✅ **Nên làm:**
  - Lưu API key trong `.env.local`
  - Thêm `.env.local` vào `.gitignore`
  - Không share API key với ai
  - Tạo API key riêng cho mỗi project

- ❌ **Không nên:**
  - Commit `.env.local` lên Git
  - Hard-code API key trong source code
  - Share API key trên Discord, Telegram, etc.
  - Đăng screenshot có chứa API key

### Quản lý Quota

Gemini Free Tier giới hạn:
- 15 requests/phút
- 1,500 requests/ngày
- 1 triệu tokens/ngày

Để tối ưu:
- Không spam request liên tục
- Cache kết quả nếu có thể
- Sử dụng rate limiting (đã có sẵn trong code)

### Firebase (Optional)

Nếu muốn sử dụng Firebase cho authentication và database, xem hướng dẫn chi tiết tại [README.md](./README.md#bước-3-thiết-lập-firebase).

---

**Tác giả:** Son Nguyen  
**Cập nhật:** December 2024  
**Phiên bản:** 1.0
