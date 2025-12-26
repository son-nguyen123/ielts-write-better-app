# 🎯 IELTS WriteBetter

<div align="center">

**Ứng dụng cải thiện kỹ năng viết IELTS được hỗ trợ bởi AI**

Một nền tảng toàn diện giúp bạn nâng cao điểm IELTS Writing thông qua phản hồi chi tiết dựa trên 4 tiêu chí chấm điểm chính thức của IELTS.

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Latest-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.9-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📖 Giới thiệu

**IELTS WriteBetter** là một ứng dụng web hiện đại được xây dựng để giúp người học IELTS cải thiện kỹ năng viết một cách hiệu quả. Ứng dụng sử dụng Google Gemini AI để cung cấp phản hồi chi tiết, chính xác dựa trên 4 tiêu chí chấm điểm IELTS chính thức:

- **TR (Task Response)**: Mức độ hoàn thành yêu cầu đề bài
- **CC (Coherence & Cohesion)**: Tính mạch lạc và liên kết
- **LR (Lexical Resource)**: Vốn từ vựng và cách sử dụng
- **GRA (Grammatical Range & Accuracy)**: Ngữ pháp và độ chính xác

Ứng dụng không chỉ chấm điểm mà còn cung cấp hệ sinh thái công cụ luyện tập toàn diện, giúp bạn xác định điểm yếu và cải thiện có mục tiêu.

---

## ⚠️ QUAN TRỌNG: Cấu hình API Key

> **🔴 TẤT CẢ TÍNH NĂNG AI TRONG ỨNG DỤNG SẼ KHÔNG HOẠT ĐỘNG NẾU BẠN CHƯA CẤU HÌNH `GEMINI_API_KEY`**

Trước khi chạy ứng dụng, bạn **BẮT BUỘC** phải có Gemini API Key (miễn phí) từ Google. Nếu thiếu API key, tất cả các tính năng AI sẽ báo lỗi:
- ❌ Chấm điểm bài viết không hoạt động
- ❌ Kiểm tra ngữ pháp không hoạt động  
- ❌ Diễn giải câu không hoạt động
- ❌ AI chat không hoạt động
- ❌ Tạo outline không hoạt động

### 🚀 Cách Cấu hình Nhanh (2 phút)

**Bước 1:** Lấy API Key miễn phí
1. Truy cập: https://aistudio.google.com/app/apikey
2. Đăng nhập bằng tài khoản Google
3. Nhấn "Create API key"
4. Sao chép API key

**Bước 2:** Tạo file `.env.local` trong thư mục gốc project

```bash
# Sao chép file mẫu
cp .env.local.template .env.local

# Hoặc tạo mới và thêm dòng này:
echo "GEMINI_API_KEY=your_api_key_here" > .env.local
```

**Bước 3:** Dán API key vào file `.env.local`

```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Bước 4:** Khởi động lại ứng dụng

```bash
npm run dev
# hoặc
pnpm dev
```

✅ **Hoàn tất!** Tất cả tính năng AI giờ đã hoạt động.

📖 **Xem hướng dẫn chi tiết tại:** [Bước 4: Thiết lập Google Gemini AI](#bước-4-thiết-lập-google-gemini-ai)

---

## ✨ Tính năng chính

### 🤖 1. Chấm điểm & Phản hồi AI Thông minh

- **Chấm điểm tự động** dựa trên 4 tiêu chí IELTS chính thức
- **Phản hồi chi tiết** cho từng tiêu chí với:
  - Điểm số cụ thể (0.0 - 9.0)
  - Điểm mạnh (Strengths)
  - Vấn đề cần khắc phục (Issues)
  - Đề xuất cải thiện (Suggestions)
  - Ví dụ minh họa (Examples)
- **Phản hồi theo dòng** (Line-level feedback): Highlight trực tiếp lỗi trong bài viết
- **Tóm tắt tổng quan** và danh sách hành động cần làm (Action Items)
- Sử dụng **Google Gemini 2.0 Flash** cho kết quả nhanh và chính xác

### 📝 2. Quản lý Bài viết (Task Management)

- **Tạo và quản lý** bài viết IELTS Task 1 và Task 2
- **Lưu nháp** và chỉnh sửa bất cứ lúc nào
- **Theo dõi trạng thái**: Draft → Submitted → Scored
- **Lịch sử phiên bản** (Revisions): Lưu tất cả các lần chấm điểm
- **So sánh phiên bản**: Xem sự cải thiện giữa các bài viết
- **Đếm từ tự động** và kiểm tra độ dài bài viết
- **Thống kê chi tiết**: Điểm số, thời gian tạo, thời gian cập nhật

### 🎯 3. Dashboard Thông minh

Dashboard hiển thị tổng quan về tiến trình học tập với các thông tin:

#### **Thẻ tổng quan (Overview Cards)**
- **Điểm trung bình hiện tại**: Theo dõi band score trung bình
- **Điểm tốt nhất gần đây**: Động lực từ thành tích cao nhất
- **Tổng số bài đã nộp**: Số lượng bài viết hoàn thành
- **Khoảng cách đến mục tiêu**: Hiển thị bằng màu (đỏ nếu chưa đạt, xanh nếu vượt mục tiêu)

#### **Thiết lập mục tiêu (Target Setting)**
- Đặt band score mục tiêu (5.0 - 9.0)
- Đặt deadline để tạo động lực
- Hiển thị tiến trình đạt mục tiêu

#### **Phân tích ưu tiên kỹ năng (Skill Priority)**
- So sánh điểm hiện tại vs mục tiêu cho từng tiêu chí
- Mức độ ưu tiên (Cao/Trung bình/Thấp) với màu sắc trực quan
- Progress bars cho mỗi kỹ năng
- Đề xuất 2 kỹ năng cần tập trung nhất

#### **Vấn đề cần cải thiện nhanh (Focus Section)** ⭐
- **Top 4 lỗi hay mắc phải** từ lịch sử phản hồi
- Hiển thị số lần xuất hiện
- Gắn nhãn kỹ năng liên quan (TR/CC/LR/GRA)
- Gợi ý hành động cụ thể
- Pro Tips để học hiệu quả

#### **Kế hoạch học tập cá nhân hóa**
- Mục tiêu luyện tập: Số bài/tuần được đề xuất
- Ước tính thời gian đạt mục tiêu
- Loại bài tập nên tập trung (Task 1/Task 2)

### 🛠️ 4. Công cụ Luyện tập (Practice Tools)

#### **📚 Thư viện đề bài (Prompt Library)**
- Bộ sưu tập đề bài IELTS Task 1 & Task 2
- Lọc theo loại đề và chủ đề
- Lưu đề yêu thích
- Gợi ý đề bài phù hợp với mục tiêu

#### **📋 Lập dàn ý (Essay Planner)**
- Tạo dàn ý có cấu trúc cho bài viết
- AI gợi ý ý tưởng dựa trên đề bài
- Mẫu dàn ý cho Task 1 và Task 2
- Lưu và tái sử dụng dàn ý

#### **✍️ Paraphrase Tool**
- Diễn đạt lại câu với nhiều phong cách:
  - Formal (Trang trọng)
  - Academic (Học thuật)
  - Simple (Đơn giản)
  - Complex (Phức tạp)
- So sánh câu gốc và câu paraphrase
- Học từ vựng đồng nghĩa

#### **🔍 Grammar Checker**
- Kiểm tra lỗi ngữ pháp chi tiết
- Giải thích lỗi và cách sửa
- Đề xuất câu đúng
- Highlight lỗi trong văn bản

### 💬 5. AI Chatbot Hỗ trợ 24/7

- Trả lời câu hỏi về IELTS Writing
- Giải thích các tiêu chí chấm điểm
- Tư vấn chiến lược làm bài
- Hướng dẫn cách cải thiện từng kỹ năng
- Chat lịch sử được lưu trữ

### 📊 6. Báo cáo Tiến độ (Progress Reports)

- **Biểu đồ xu hướng điểm số** theo thời gian
- **Phân tích từng tiêu chí**: Xem tiến bộ của TR, CC, LR, GRA
- **So sánh trước và sau**: Xem sự cải thiện qua các bài
- **Thống kê chi tiết**:
  - Số bài đã làm theo thời gian
  - Điểm trung bình theo tuần/tháng
  - Tỷ lệ đạt mục tiêu
- **Xuất báo cáo PDF** (tính năng sắp có)

### 👤 7. Hồ sơ Người dùng (User Profile)

- Quản lý thông tin cá nhân
- Đặt mục tiêu band score
- Tùy chỉnh khu vực trọng tâm (Focus Areas)
- Cài đặt sở thích học tập
- Quản lý tài khoản và bảo mật

---

## 🏗️ Công nghệ sử dụng

### **Frontend**
- **Next.js 15.2.4** - React framework với App Router
- **React 19** - Thư viện UI
- **TypeScript 5** - Type safety
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Component library cao cấp
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **Geist Font** - Font chữ hiện đại

### **Backend & Database**
- **Firebase**
  - **Authentication**: Email/Password, Google OAuth
  - **Firestore**: NoSQL database
  - **Storage**: File storage cho attachments
- **Next.js API Routes**: RESTful API endpoints

### **AI & Machine Learning**
- **Google Gemini 2.0 Flash**: Model AI cho chấm điểm
- **@google/generative-ai**: SDK chính thức
- **@ai-sdk/google**: Vercel AI SDK integration

### **Data Visualization**
- **Recharts**: Biểu đồ và visualization
- **date-fns**: Xử lý ngày tháng

### **Form & Validation**
- **React Hook Form**: Quản lý form
- **Zod**: Schema validation

### **Development Tools**
- **ESLint**: Code linting
- **Prettier**: Code formatting (via config)
- **TypeScript**: Static type checking

---

## 🚀 Hướng dẫn Cài đặt

### Yêu cầu hệ thống

Trước khi bắt đầu, đảm bảo máy tính của bạn có:

- **Node.js** 18.0 trở lên ([Download](https://nodejs.org/))
- **pnpm**, **npm** hoặc **yarn** (khuyên dùng pnpm)
- **Git** để clone repository
- **Firebase account** (miễn phí) - [Đăng ký tại đây](https://firebase.google.com/)
- **Google AI Studio account** (miễn phí) - [Đăng ký tại đây](https://aistudio.google.com/)

### Bước 1: Clone Repository

```bash
git clone https://github.com/son-nguyen123/ielts-write-better-app.git
cd ielts-write-better-app
```

### Bước 2: Cài đặt Dependencies

Sử dụng package manager bạn thích:

```bash
# Với pnpm (khuyên dùng)
pnpm install

# Hoặc với npm
npm install

# Hoặc với yarn
yarn install
```

### Bước 3: Thiết lập Firebase

#### 3.1. Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** hoặc **"Thêm dự án"**
3. Đặt tên project (ví dụ: "ielts-writebetter")
4. Bỏ chọn Google Analytics nếu không cần
5. Click **"Create project"**

#### 3.2. Kích hoạt Authentication

1. Trong Firebase Console, vào **Authentication** → **Get started**
2. Vào tab **Sign-in method**
3. Kích hoạt các phương thức:
   - **Email/Password**: Click Enable
   - **Google**: Click Enable và chọn support email

#### 3.3. Tạo Firestore Database

1. Vào **Firestore Database** → **Create database**
2. Chọn **Start in production mode** (sẽ cấu hình rules sau)
3. Chọn location gần bạn nhất (ví dụ: `asia-southeast1`)
4. Click **Enable**

#### 3.4. Kích hoạt Storage

1. Vào **Storage** → **Get started**
2. Chọn **Start in production mode**
3. Chọn location giống Firestore
4. Click **Done**

#### 3.5. Lấy Firebase Config

1. Vào **Project settings** (icon bánh răng)
2. Scroll xuống phần **"Your apps"**
3. Click icon **Web** (`</>`)
4. Đặt tên app (ví dụ: "WriteBetter Web")
5. Click **Register app**
6. Copy các thông tin config

### Bước 4: Thiết lập Google Gemini AI

#### 4.1. Lấy API Key

1. Truy cập [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Đăng nhập bằng Google account
3. Click **"Create API key"**
4. Chọn project hoặc tạo mới
5. Copy API key (lưu ý: chỉ hiển thị 1 lần)

#### 4.2. Kiểm tra Quota

- Free tier: 15 requests/phút, 1 triệu tokens/ngày
- Xem quota tại: [AI Studio Usage](https://aistudio.google.com/app/apikey)

### Bước 5: Cấu hình Environment Variables

#### 5.1. Tạo file `.env.local`

Copy file template với hướng dẫn chi tiết:

```bash
# Khuyên dùng: Sao chép file template có hướng dẫn tiếng Việt
cp .env.local.template .env.local

# Hoặc từ file example đơn giản hơn
cp .env.example .env.local
```

#### 5.2. Điền thông tin

Mở file `.env.local` và điền các thông tin:

```env
# ============================================
# GEMINI AI CONFIGURATION
# ============================================
# API Key từ Google AI Studio
# Get your key at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# ============================================
# FIREBASE CONFIGURATION
# ============================================
# Lấy từ Firebase Console > Project Settings > Your apps > SDK setup and configuration

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

> **Lưu ý**: File `.env.local` đã được thêm vào `.gitignore`, không bao giờ commit file này lên Git!

### Bước 6: Cấu hình Firebase Code

Uncomment (bỏ dấu comment) code Firebase trong các file:

#### 6.1. `lib/firebase.ts`

```typescript
// Bỏ comment khối code Firebase config
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// ... rest of the file
```

#### 6.2. `lib/firebase-auth.ts` và `lib/firebase-firestore.ts`

Uncomment tất cả functions trong 2 file này.

### Bước 7: Cấu hình Firestore Security Rules

1. Vào **Firestore Database** → **Rules**
2. Paste rules sau:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Chỉ cho phép user đọc/ghi data của chính họ
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Tasks subcollection
      match /tasks/{taskId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Reports subcollection
      match /reports/{reportId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

3. Click **Publish**

### Bước 8: Cấu hình Storage Rules

1. Vào **Storage** → **Rules**
2. Paste rules sau:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      // Chỉ cho phép user upload/download files của họ
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

### Bước 9: Chạy Development Server

```bash
# Khởi động server development
pnpm dev

# Hoặc
npm run dev

# Server sẽ chạy tại http://localhost:3000
```

### Bước 10: Kiểm tra

1. Mở trình duyệt và truy cập `http://localhost:3000`
2. Đăng ký tài khoản mới
3. Thử tạo bài viết và chấm điểm
4. Kiểm tra các tính năng khác

---

## 📁 Cấu trúc Project

```
ielts-write-better-app/
│
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes
│   │   ├── ai/                  # AI endpoints
│   │   │   ├── chat/           # Chatbot API
│   │   │   ├── generate-outline/  # Essay planner API
│   │   │   ├── generate-prompts/  # Prompt generator API
│   │   │   ├── grammar-check/     # Grammar checker API
│   │   │   ├── paraphrase/        # Paraphrase API
│   │   │   └── score-essay/       # Essay scoring API
│   │   ├── essays/              # Essay CRUD operations
│   │   └── reports/             # Progress reports API
│   │
│   ├── auth/                    # Authentication pages
│   │   ├── login/              # Login page
│   │   └── register/           # Register page
│   │
│   ├── dashboard/               # Main dashboard
│   ├── tasks/                   # Task management
│   │   ├── [id]/               # Task detail/edit
│   │   └── new/                # Create new task
│   │
│   ├── practice/                # Practice tools
│   │   ├── prompts/            # Prompt library
│   │   ├── planner/            # Essay planner
│   │   ├── paraphrase/         # Paraphrase tool
│   │   └── grammar/            # Grammar checker
│   │
│   ├── chat/                    # AI Chatbot
│   ├── reports/                 # Progress reports
│   ├── profile/                 # User profile
│   │
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
│
├── components/                   # React Components
│   ├── auth/                    # Auth components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── AuthGuard.tsx
│   │
│   ├── dashboard/               # Dashboard components
│   │   ├── OverviewCards.tsx
│   │   ├── SkillPriority.tsx
│   │   ├── FocusSection.tsx
│   │   └── StudyPlan.tsx
│   │
│   ├── tasks/                   # Task components
│   │   ├── TaskList.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskEditor.tsx
│   │   ├── FeedbackDisplay.tsx
│   │   └── RevisionHistory.tsx
│   │
│   ├── practice/                # Practice components
│   │   ├── PromptCard.tsx
│   │   ├── EssayPlanner.tsx
│   │   ├── ParaphraseTool.tsx
│   │   └── GrammarChecker.tsx
│   │
│   ├── chat/                    # Chat components
│   │   ├── ChatInterface.tsx
│   │   ├── MessageList.tsx
│   │   └── ChatInput.tsx
│   │
│   ├── reports/                 # Report components
│   │   ├── ProgressChart.tsx
│   │   ├── ScoreBreakdown.tsx
│   │   └── ComparisonView.tsx
│   │
│   ├── navigation/              # Navigation components
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── MobileNav.tsx
│   │
│   └── ui/                      # Reusable UI components (shadcn/ui)
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       └── ... (50+ components)
│
├── lib/                          # Utility functions & configs
│   ├── firebase.ts              # Firebase initialization
│   ├── firebase-auth.ts         # Auth helpers
│   ├── firebase-firestore.ts    # Firestore helpers
│   ├── server-rate-limiter.ts   # Rate limiting cho Gemini API
│   ├── retry-utils.ts           # Retry logic
│   └── utils.ts                 # General utilities
│
├── hooks/                        # Custom React Hooks
│   ├── useAuth.ts               # Auth hook
│   ├── useTasks.ts              # Tasks hook
│   ├── useReports.ts            # Reports hook
│   └── useToast.ts              # Toast notifications
│
├── types/                        # TypeScript types
│   ├── tasks.ts                 # Task related types
│   └── reports.ts               # Report related types
│
├── public/                       # Static assets
│   ├── images/
│   └── icons/
│
├── styles/                       # Additional styles
│
├── .env.example                  # Environment variables example
├── .env.local                    # Local environment (not in git)
├── .gitignore                    # Git ignore file
├── components.json               # shadcn/ui config
├── next.config.mjs               # Next.js config
├── package.json                  # Dependencies
├── pnpm-lock.yaml               # Lock file
├── postcss.config.mjs           # PostCSS config
├── tailwind.config.js           # Tailwind config (v4)
├── tsconfig.json                # TypeScript config
└── README.md                     # Documentation
```

---

## 💾 Cấu trúc Database (Firestore)

### Collection: `users`

```typescript
users/{userId}
├── name: string                 // Tên người dùng
├── email: string                // Email
├── photoURL?: string            // Avatar URL
├── targetBand: number           // Band điểm mục tiêu (5.0-9.0)
├── targetDeadline?: Timestamp   // Deadline đạt mục tiêu
├── focusAreas: {                // Khu vực trọng tâm
│   TR: number,                  // Task Response priority (0-3)
│   CC: number,                  // Coherence & Cohesion priority
│   LR: number,                  // Lexical Resource priority
│   GRA: number                  // Grammar priority
│ }
├── preferences: {               // Cài đặt
│   emailNotifications: boolean,
│   weeklyGoal: number,          // Số bài/tuần
│   preferredTaskType: "Task 1" | "Task 2" | "Both"
│ }
├── stats: {                     // Thống kê tổng quan
│   totalTasks: number,
│   totalScored: number,
│   averageBand: number,
│   bestBand: number
│ }
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

### Subcollection: `users/{userId}/tasks`

```typescript
tasks/{taskId}
├── title: string                // Tiêu đề bài viết
├── taskType: "Task 1" | "Task 2"  // Loại bài
├── prompt: string               // Đề bài
├── promptId?: string            // ID của prompt từ library
├── response: string             // Bài viết của user
├── wordCount: number            // Số từ
├── status: "draft" | "submitted" | "scored"  // Trạng thái
│
├── feedback?: {                 // Phản hồi từ AI
│   overallBand: number,         // Điểm tổng (0.0-9.0)
│   summary: string,             // Tóm tắt chung
│   
│   criteria: {                  // Điểm từng tiêu chí
│     TR: {
│       score: number,           // Điểm (0.0-9.0)
│       strengths: string[],     // Điểm mạnh
│       issues: string[],        // Vấn đề
│       suggestions: string[],   // Đề xuất
│       examples: string[]       // Ví dụ
│     },
│     CC: { /* tương tự TR */ },
│     LR: { /* tương tự TR */ },
│     GRA: { /* tương tự TR */ }
│   },
│   
│   actionItems: string[],       // Danh sách hành động
│   
│   lineLevelFeedback?: [{       // Phản hồi theo dòng
│     startIndex: number,        // Vị trí bắt đầu
│     endIndex: number,          // Vị trí kết thúc
│     category: "grammar" | "lexical" | "coherence" | "task_response",
│     comment: string,           // Nhận xét
│     suggestedRewrite?: string  // Đề xuất sửa
│   }]
│ }
│
├── revisions?: [{               // Lịch sử chấm điểm
│   id: string,
│   overallBand: number,
│   summary: string,
│   createdAt: Timestamp,
│   feedback: { /* tương tự trên */ }
│ }]
│
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

### Subcollection: `users/{userId}/reports`

```typescript
reports/{reportId}
├── type: "weekly" | "monthly" | "custom"  // Loại báo cáo
├── startDate: Timestamp         // Ngày bắt đầu
├── endDate: Timestamp           // Ngày kết thúc
│
├── summary: {                   // Tóm tắt
│   totalTasks: number,
│   averageBand: number,
│   improvement: number,         // Sự cải thiện (%)
│   highestScore: number,
│   lowestScore: number
│ }
│
├── criteriaBreakdown: {         // Phân tích từng tiêu chí
│   TR: { average: number, trend: "up" | "down" | "stable" },
│   CC: { average: number, trend: "up" | "down" | "stable" },
│   LR: { average: number, trend: "up" | "down" | "stable" },
│   GRA: { average: number, trend: "up" | "down" | "stable" }
│ }
│
├── commonIssues: [{             // Vấn đề thường gặp
│   issue: string,
│   frequency: number,
│   category: CriterionKey,
│   suggestion: string
│ }]
│
├── tasksIncluded: string[]      // IDs của tasks trong báo cáo
├── createdAt: Timestamp
└── generatedAt: Timestamp
```

---

## 🔌 API Endpoints

### Authentication APIs

Sử dụng Firebase Authentication SDK (client-side), không có API routes riêng.

### AI APIs

#### `POST /api/ai/score-essay`
Chấm điểm bài viết IELTS

**Request:**
```json
{
  "essayText": "string",
  "taskType": "Task 1" | "Task 2",
  "prompt": "string"
}
```

**Response:**
```json
{
  "overallBand": 7.5,
  "summary": "...",
  "criteria": {
    "TR": { "score": 8.0, "strengths": [...], "issues": [...], ... },
    "CC": { "score": 7.5, ... },
    "LR": { "score": 7.5, ... },
    "GRA": { "score": 7.0, ... }
  },
  "actionItems": [...],
  "lineLevelFeedback": [...]
}
```

#### `POST /api/ai/chat`
AI Chatbot conversation

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "How to improve Task Response?" }
  ]
}
```

**Response:**
```json
{
  "message": "To improve Task Response, you should..."
}
```

#### `POST /api/ai/grammar-check`
Kiểm tra ngữ pháp

**Request:**
```json
{
  "text": "I has been studying English since 5 years."
}
```

**Response:**
```json
{
  "corrections": [{
    "original": "I has been",
    "corrected": "I have been",
    "explanation": "Subject-verb agreement...",
    "position": { "start": 0, "end": 9 }
  }]
}
```

#### `POST /api/ai/paraphrase`
Paraphrase văn bản

**Request:**
```json
{
  "text": "The chart shows...",
  "style": "formal" | "academic" | "simple" | "complex"
}
```

**Response:**
```json
{
  "original": "The chart shows...",
  "paraphrased": "The diagram illustrates...",
  "alternatives": ["The graph depicts...", ...]
}
```

#### `POST /api/ai/generate-outline`
Tạo dàn ý bài viết

**Request:**
```json
{
  "prompt": "Some people think...",
  "taskType": "Task 2"
}
```

**Response:**
```json
{
  "outline": {
    "introduction": ["Hook", "Background", "Thesis"],
    "body1": ["Topic sentence", "Explanation", "Example"],
    "body2": [...],
    "conclusion": [...]
  }
}
```

#### `POST /api/ai/generate-prompts`
Tạo đề bài mới

**Request:**
```json
{
  "taskType": "Task 2",
  "topic": "environment",
  "count": 5
}
```

**Response:**
```json
{
  "prompts": [
    {
      "id": "...",
      "text": "Some people believe...",
      "type": "Task 2",
      "topic": "environment",
      "difficulty": "medium"
    }
  ]
}
```

### Essay APIs

#### `GET /api/essays`
Lấy danh sách bài viết

**Query params:**
- `status`: draft | submitted | scored
- `limit`: number
- `orderBy`: createdAt | updatedAt | overallBand

**Response:**
```json
{
  "tasks": [...],
  "total": 50,
  "hasMore": true
}
```

#### `GET /api/essays/[id]`
Lấy chi tiết 1 bài viết

#### `POST /api/essays`
Tạo bài viết mới

#### `PATCH /api/essays/[id]`
Cập nhật bài viết

#### `DELETE /api/essays/[id]`
Xóa bài viết

### Report APIs

#### `GET /api/reports/overview`
Tổng quan tiến độ

#### `GET /api/reports/trends`
Xu hướng điểm số

#### `POST /api/reports/target`
Cập nhật mục tiêu

---

## 🎮 Hướng dẫn Sử dụng

### 1. Đăng ký và Đăng nhập

- Truy cập `/auth/register` để tạo tài khoản
- Hoặc đăng nhập bằng Google
- Thiết lập mục tiêu ban đầu

### 2. Tạo bài viết mới

1. Vào **Dashboard** → Click **"New Task"**
2. Chọn loại bài: **Task 1** hoặc **Task 2**
3. Chọn đề bài từ thư viện hoặc nhập đề tự do
4. Viết bài trong editor
5. Click **"Submit for Scoring"**

### 3. Xem kết quả chấm điểm

- Điểm tổng và điểm từng tiêu chí
- Điểm mạnh và điểm yếu
- Gợi ý cải thiện cụ thể
- Lỗi được highlight trong bài viết

### 4. So sánh phiên bản

- Vào chi tiết bài viết
- Click **"Revision History"**
- Chọn 2 phiên bản để so sánh
- Xem sự thay đổi điểm số

### 5. Sử dụng công cụ luyện tập

#### Grammar Checker
1. Vào **Practice** → **Grammar Checker**
2. Paste văn bản cần kiểm tra
3. Xem lỗi và cách sửa

#### Paraphrase Tool
1. Vào **Practice** → **Paraphrase**
2. Nhập câu cần diễn đạt lại
3. Chọn style phù hợp
4. Copy kết quả

#### Essay Planner
1. Vào **Practice** → **Planner**
2. Nhập đề bài
3. AI tạo dàn ý gợi ý
4. Chỉnh sửa và lưu

### 6. Theo dõi tiến độ

- Vào **Reports** để xem:
  - Biểu đồ xu hướng
  - Điểm trung bình
  - Phân tích từng kỹ năng
  - Vấn đề thường gặp

### 7. Chat với AI

- Click icon **Chat** ở navigation
- Hỏi bất kỳ câu hỏi nào về IELTS Writing
- Nhận tư vấn và hướng dẫn

---

## 💻 Development

### Scripts có sẵn

```bash
# Chạy development server
pnpm dev

# Build production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Type check
tsc --noEmit
```

### Thêm component mới (shadcn/ui)

```bash
# Thêm 1 component
pnpx shadcn@latest add button

# Thêm nhiều components
pnpx shadcn@latest add button card dialog input
```

### Coding Standards

- **TypeScript**: Luôn sử dụng types, tránh `any`
- **Components**: Functional components với hooks
- **Naming**: PascalCase cho components, camelCase cho functions
- **File organization**: 1 component = 1 file
- **Imports**: Sử dụng absolute imports với `@/`

### Git Workflow

```bash
# Tạo branch mới
git checkout -b feature/ten-tinh-nang

# Commit changes
git add .
git commit -m "feat: thêm tính năng XYZ"

# Push và tạo PR
git push origin feature/ten-tinh-nang
```

---

## 🚢 Deployment

### Deploy lên Vercel (Khuyên dùng)

#### Bước 1: Chuẩn bị

1. Push code lên GitHub
2. Đảm bảo `.env.local` không được commit

#### Bước 2: Import vào Vercel

1. Truy cập [vercel.com](https://vercel.com/)
2. Click **"New Project"**
3. Import repository từ GitHub
4. Chọn framework: **Next.js**

#### Bước 3: Cấu hình Environment Variables

Trong Vercel Dashboard, thêm các biến môi trường:

```
GEMINI_API_KEY=...
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

#### Bước 4: Deploy

1. Click **"Deploy"**
2. Đợi build hoàn tất (~2-3 phút)
3. Truy cập URL được cung cấp

#### Bước 5: Cấu hình Firebase cho Production

1. Vào Firebase Console → **Authentication** → **Authorized domains**
2. Thêm domain Vercel của bạn (ví dụ: `your-app.vercel.app`)
3. Làm tương tự trong **Firebase Hosting** (nếu dùng)

### Deploy lên Netlify

Tương tự Vercel, nhưng cần thêm build command:

```toml
# netlify.toml
[build]
  command = "pnpm build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
```

### Deploy lên VPS (Ubuntu)

```bash
# 1. Cài Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Cài PM2
npm install -g pm2

# 3. Clone và build
git clone <repo-url>
cd ielts-write-better-app
pnpm install
pnpm build

# 4. Chạy với PM2
pm2 start npm --name "ielts-app" -- start
pm2 save
pm2 startup
```

---

## 🛠️ Troubleshooting

### Lỗi thường gặp

#### 1. **Gemini API Quota Exceeded**

**Triệu chứng:** Lỗi "429 Too Many Requests"

**Giải pháp:**
- Kiểm tra usage tại [AI Studio](https://aistudio.google.com/app/apikey)
- Free tier: 15 RPM, 1M tokens/ngày
- Hệ thống đã có rate limiter (3s giữa mỗi request)
- Nếu vẫn gặp lỗi, tăng `minInterval` trong `lib/server-rate-limiter.ts`

```typescript
// lib/server-rate-limiter.ts
new ServerRateLimiter({
  maxConcurrent: 1,
  minInterval: 5000, // Tăng từ 3000 lên 5000ms
})
```

#### 2. **Firebase Authentication Error**

**Triệu chứng:** Không đăng nhập được

**Giải pháp:**
- Kiểm tra Firebase config trong `.env.local`
- Verify domain trong Firebase Console
- Xóa cache trình duyệt
- Kiểm tra Firestore rules

#### 3. **Build Failed**

**Triệu chứng:** `next build` báo lỗi

**Giải pháp:**
```bash
# Xóa cache và node_modules
rm -rf .next node_modules
pnpm install
pnpm build
```

#### 4. **Type Errors**

**Triệu chứng:** TypeScript errors

**Giải pháp:**
```bash
# Check types
tsc --noEmit

# Update types
pnpm add -D @types/react@latest @types/node@latest
```

#### 5. **Firestore Permission Denied**

**Triệu chứng:** Không đọc/ghi được data

**Giải pháp:**
- Kiểm tra Security Rules
- Verify user đã authenticated
- Check `userId` trong queries

### Logs và Debugging

#### Server logs (Development)

```bash
# Xem logs chi tiết
pnpm dev

# Logs sẽ hiển thị:
[Retry] Rate limit hit. Retry #1/3 after 5000ms
[score-essay] Error details: {...}
```

#### Client logs (Browser)

```javascript
// Thêm vào code để debug
console.log('User:', user)
console.log('Task:', task)
console.log('Feedback:', feedback)
```

#### Firebase logs

Vào Firebase Console → Firestore → **Usage** tab để xem:
- Số lượng reads/writes
- Bandwidth usage
- Errors

---

## 🔐 Security Best Practices

### Environment Variables

- ❌ **KHÔNG BAO GIỜ** commit `.env.local` lên Git
- ✅ Sử dụng `.env.example` làm template
- ✅ Rotate API keys định kỳ
- ✅ Sử dụng Vercel Environment Variables cho production

### Firestore Rules

- ✅ Luôn validate `request.auth`
- ✅ Giới hạn truy cập theo `userId`
- ✅ Không cho phép public read/write
- ✅ Test rules trước khi deploy

### API Rate Limiting

- ✅ Đã có server-side rate limiter
- ✅ Giới hạn 1 request/3s cho Gemini API
- ✅ Retry với exponential backoff
- ✅ Timeout sau 30s

### Input Validation

- ✅ Validate input với Zod schemas
- ✅ Sanitize user input trước khi lưu
- ✅ Limit file upload size
- ✅ Check authentication trước mọi API call

---

## 📊 Performance Optimization

### Đã triển khai

✅ **Code Splitting**: Next.js tự động split code
✅ **Image Optimization**: Next.js Image component
✅ **Server Components**: Giảm bundle size client
✅ **Rate Limiting**: Tránh spam Gemini API
✅ **Firestore Indexing**: Composite indexes cho queries phức tạp

### Khuyến nghị thêm

📝 **Caching**
```typescript
// Caching Gemini responses
const cacheKey = `score:${hash(essayText)}`
const cached = await getFromCache(cacheKey)
if (cached) return cached
```

📝 **Pagination**
```typescript
// Limit số tasks hiển thị
const TASKS_PER_PAGE = 20
```

📝 **Lazy Loading**
```typescript
// Lazy load components
const ReportCharts = dynamic(() => import('@/components/reports/Charts'), {
  loading: () => <Spinner />,
  ssr: false
})
```

---

## 🤝 Contributing

Chúng tôi hoan nghênh mọi đóng góp! Để contribute:

### Bước 1: Fork và Clone

```bash
# Fork repo trên GitHub
# Sau đó clone về máy
git clone https://github.com/YOUR_USERNAME/ielts-write-better-app.git
cd ielts-write-better-app
```

### Bước 2: Tạo Branch

```bash
git checkout -b feature/amazing-feature
```

### Bước 3: Make Changes

- Viết code với coding standards
- Thêm comments nếu cần
- Test kỹ trước khi commit

### Bước 4: Commit

```bash
git add .
git commit -m "feat: add amazing feature"
```

Commit message format:
- `feat:` - Tính năng mới
- `fix:` - Sửa bug
- `docs:` - Cập nhật docs
- `style:` - Format code
- `refactor:` - Refactor code
- `test:` - Thêm tests
- `chore:` - Maintenance tasks

### Bước 5: Push và Create PR

```bash
git push origin feature/amazing-feature
```

Sau đó tạo Pull Request trên GitHub với:
- Tiêu đề rõ ràng
- Mô tả chi tiết changes
- Screenshots nếu có UI changes
- Link đến related issues

### Code Review Process

1. Maintainers sẽ review PR
2. Có thể yêu cầu changes
3. Sau khi approved, PR sẽ được merge
4. Branch sẽ được xóa

---

## 📝 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 IELTS WriteBetter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Support & Contact

### Báo cáo Bug

Nếu phát hiện bug, vui lòng tạo issue trên GitHub với:
- Mô tả chi tiết bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/logs nếu có
- Environment (OS, browser, Node version)

### Yêu cầu Feature

Để đề xuất tính năng mới:
1. Mở GitHub Issue
2. Chọn template "Feature Request"
3. Mô tả feature và use case
4. Giải thích tại sao feature này hữu ích

### Liên hệ

- **GitHub Issues**: [Issues Page](https://github.com/son-nguyen123/ielts-write-better-app/issues)
- **Email**: [Your Email]
- **Discord**: [Your Discord Server] (nếu có)

---

## 🙏 Acknowledgments

Cảm ơn các công nghệ và thư viện tuyệt vời:

- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend services
- [Google Gemini](https://ai.google.dev/) - AI capabilities
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vercel](https://vercel.com/) - Hosting platform

---

## 📚 Additional Documentation

- 📄 [VIETNAMESE_SUMMARY.md](./VIETNAMESE_SUMMARY.md) - Tài liệu tiếng Việt về Rate Limiting
- 📄 [RATE_LIMITING.md](./RATE_LIMITING.md) - Chi tiết về rate limiter
- 📄 [DASHBOARD_ENHANCEMENT.md](./DASHBOARD_ENHANCEMENT.md) - Dashboard features
- 📄 [PROGRESS_REPORTS_IMPLEMENTATION.md](./PROGRESS_REPORTS_IMPLEMENTATION.md) - Progress reports

---

## 🗺️ Roadmap

### Version 2.0 (Coming Soon)

- [ ] 📱 **Mobile App** (React Native)
- [ ] 🎙️ **Speaking Practice** với AI
- [ ] 📖 **Reading Practice** với comprehension questions
- [ ] 👥 **Social Features**: Share essays, community feedback
- [ ] 🎯 **Advanced Analytics**: ML-powered insights
- [ ] 💳 **Premium Tier**: Unlimited scoring, priority support
- [ ] 🌍 **Multi-language Support**: English, Vietnamese, Chinese
- [ ] 🎨 **Custom Themes**: Dark mode, color schemes
- [ ] 📥 **Export Options**: PDF, DOCX, HTML
- [ ] 🔔 **Push Notifications**: Reminders, achievements

### Long-term Goals

- [ ] Integration với Cambridge/IDP practice tests
- [ ] Live tutor sessions
- [ ] Gamification với badges và leaderboards
- [ ] AI-powered study plan generator
- [ ] Collaborative writing với real-time editing

---

<div align="center">

**⭐ Nếu project này hữu ích, đừng quên cho 1 star trên GitHub! ⭐**

Made with ❤️ by the IELTS WriteBetter Team

[Report Bug](https://github.com/son-nguyen123/ielts-write-better-app/issues) · [Request Feature](https://github.com/son-nguyen123/ielts-write-better-app/issues) · [Documentation](https://github.com/son-nguyen123/ielts-write-better-app/wiki)

</div>
