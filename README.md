# IELTS WriteBetter

An AI-powered IELTS writing improvement application built with Next.js, featuring comprehensive feedback based on official IELTS criteria (TR/CC/LR/GRA).

## Features

- **AI-Powered Scoring**: Get detailed feedback on Task Response, Coherence & Cohesion, Lexical Resource, and Grammar & Accuracy
- **Task Management**: Create, edit, and track your IELTS Task 1 and Task 2 essays
- **Version Comparison**: Compare different versions of your essays side-by-side
- **Practice Tools**: 
  - Prompt library with filtering
  - Essay planner for structured outlines
  - Paraphrase tool with multiple style options
  - Grammar checker with detailed explanations
- **AI Chatbot**: Get instant help and feedback on your writing
- **Progress Reports**: Track your improvement over time with detailed analytics
- **User Profiles**: Customize your learning goals and preferences

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account (for backend services)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd ielts-writebetter
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up Firebase:
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Enable Storage
   - Copy your Firebase config

4. Create a \`.env.local\` file:
\`\`\`env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key
\`\`\`

   **Getting a Gemini API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the key and add it to your \`.env.local\` file
   
   **🇻🇳 Hướng dẫn tiếng Việt:** Xem [HƯỚNG_DẪN_THAY_ĐỔI_API_KEY.md](./HƯỚNG_DẪN_THAY_ĐỔI_API_KEY.md) để biết chi tiết cách thay đổi API key

   **AI Model Information:**
   - Default Gemini model is configurable via \`GEMINI_MODEL\` (defaults to \`gemini-2.0-flash\` on the v1 API)
   - The \`gemini-\` prefix is added automatically if you only provide the short model name (e.g., \`2.0-flash\`)
   - Uses the v1 API endpoint for content generation

5. Uncomment Firebase code in:
   - \`lib/firebase.ts\`
   - \`lib/firebase-auth.ts\`
   - \`lib/firebase-firestore.ts\`

6. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

7. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
├── app/                      # Next.js app directory
│   ├── auth/                # Authentication pages
│   ├── dashboard/           # Dashboard page
│   ├── tasks/               # Task management pages
│   ├── practice/            # Practice tools pages
│   ├── chat/                # AI chatbot page
│   ├── reports/             # Progress reports page
│   ├── profile/             # User profile page
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── auth/               # Authentication components
│   ├── chat/               # Chat interface components
│   ├── dashboard/          # Dashboard components
│   ├── home/               # Home page components
│   ├── navigation/         # Navigation components
│   ├── practice/           # Practice tool components
│   ├── profile/            # Profile components
│   ├── reports/            # Report components
│   ├── tasks/              # Task components
│   └── ui/                 # Reusable UI components
├── lib/                     # Utility functions
│   ├── firebase.ts         # Firebase initialization
│   ├── firebase-auth.ts    # Authentication helpers
│   ├── firebase-firestore.ts # Firestore helpers
│   └── utils.ts            # General utilities
└── hooks/                   # Custom React hooks
\`\`\`

## Firebase Setup

### Firestore Collections

\`\`\`
users/
  {userId}/
    - name: string
    - email: string
    - targetBand: number
    - focusAreas: object
    - preferences: object
    - createdAt: timestamp
    
    tasks/
      {taskId}/
        - title: string
        - type: "Task 1" | "Task 2"
        - prompt: string
        - response: string
        - status: "draft" | "submitted" | "scored"
        - scores: object
        - feedback: object
        - versions: array
        - createdAt: timestamp
        - updatedAt: timestamp
\`\`\`

### Security Rules

Set up Firestore security rules to ensure users can only access their own data:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /tasks/{taskId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
\`\`\`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
\`\`\`
