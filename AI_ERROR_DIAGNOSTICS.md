# AI Error Diagnostics and Troubleshooting Guide

## Tóm tắt (Summary)
Hệ thống chẩn đoán lỗi AI giúp phân biệt giữa:
- ⚙️ **Vấn đề Code**: Lỗi do cấu hình hoặc implementation
- 🌐 **Vấn đề API**: Lỗi do giới hạn hoặc vấn đề từ Google Gemini API
- ❓ **Vấn đề Chưa Rõ**: Cần kiểm tra thêm

The AI error diagnostics system helps distinguish between:
- ⚙️ **Code Issues**: Errors due to configuration or implementation
- 🌐 **API Issues**: Errors due to limits or problems from Google Gemini API
- ❓ **Unknown Issues**: Need further investigation

---

## Overview

This application now includes comprehensive error diagnostics to help users and developers understand **exactly why AI features fail** and whether the issue is due to:
1. Code/configuration problems
2. API quota/rate limits
3. Other external factors

## Key Features

### 1. Error Type Classification

The system automatically classifies errors into specific types:

| Error Type | Description | Is Code Issue? | Is API Issue? |
|------------|-------------|----------------|---------------|
| `MISSING_API_KEY` | API key not configured in environment | ✅ Yes | ❌ No |
| `INVALID_API_KEY` | API key is invalid, expired, or lacks permissions | ❌ No | ✅ Yes |
| `RATE_LIMIT` | Too many requests in a short time (burst) | ❌ No | ✅ Yes |
| `QUOTA_EXCEEDED` | Daily/monthly quota limit reached | ❌ No | ✅ Yes |
| `BILLING_ISSUE` | Billing not enabled or payment required | ❌ No | ✅ Yes |
| `INVALID_MODEL` | Model name is incorrect or unavailable | ✅ Yes | ❌ No |
| `CORS_ERROR` | Cross-origin request blocked | ✅ Yes | ❌ No |
| `NETWORK_ERROR` | Network connectivity issue | ❌ No | ❌ No |
| `GENERIC_ERROR` | Unclassified error | ❓ Unknown | ❓ Unknown |

### 2. Detailed Diagnostic Information

For each error, the system provides:
- **Error Type**: Classification of the error
- **Status Code**: HTTP status code (e.g., 429, 401, 500)
- **Message**: English error description
- **Vietnamese Message**: User-friendly Vietnamese explanation
- **Possible Causes**: List of potential root causes
- **Troubleshooting Steps**: Step-by-step instructions to fix
- **Is Code Issue**: Boolean indicating if it's a code/config problem
- **Is API Issue**: Boolean indicating if it's an API/quota problem
- **Timestamp**: When the error occurred
- **Response Body**: Sanitized API response (sensitive data redacted)

### 3. Vietnamese User Messages

All error messages include Vietnamese translations to help Vietnamese-speaking users:

```
🔍 **Chẩn đoán lỗi:**

⚙️ **Vấn đề Code**
**Thông báo:** Chưa cấu hình API key. Đây là vấn đề về cấu hình code, không phải API.

**Nguyên nhân có thể:**
1. Missing .env.local file
2. GEMINI_API_KEY not set in environment variables
3. Environment variables not loaded properly

**Cách khắc phục:**
1. Create .env.local file in project root
2. Add: GEMINI_API_KEY=your_api_key_here
3. Restart development server
4. Get API key from: https://aistudio.google.com/app/apikey

**Thời gian:** 26/12/2025 15:28:18
```

## How It Works

### Backend (API Routes)

All AI API routes now use the enhanced diagnostics:

```typescript
import { createDiagnosticErrorResponse, diagnoseError } from "@/lib/error-utils"

try {
  // AI API call
} catch (error: any) {
  // Diagnose error with detailed information
  const diagnostics = diagnoseError(error)
  
  // Log detailed diagnostic information
  console.error("[endpoint] Diagnostic information:", {
    errorType: diagnostics.errorType,
    statusCode: diagnostics.statusCode,
    isCodeIssue: diagnostics.isCodeIssue,
    isApiIssue: diagnostics.isApiIssue,
    timestamp: diagnostics.timestamp,
  })
  
  // Create diagnostic response
  const diagnosticResponse = createDiagnosticErrorResponse(error)
  
  // Return with appropriate status code
  return Response.json(diagnosticResponse, { status: diagnostics.statusCode || 500 })
}
```

### Frontend (UI Components)

The chat interface and other UI components automatically format and display diagnostic information:

```typescript
import { formatErrorResponse } from "@/lib/error-utils"

// When error occurs
if (!response.ok) {
  const errorData = await response.json()
  const formattedError = formatErrorResponse(errorData)
  // Display formatted error to user
}
```

## Common Error Scenarios

### Scenario 1: Missing API Key (Code Issue)

**Symptoms:**
- Error message: "GEMINI_API_KEY is not set"
- Status code: 500
- AI features don't work at all

**Diagnosis:**
```json
{
  "errorType": "MISSING_API_KEY",
  "isCodeIssue": true,
  "isApiIssue": false,
  "vietnameseMessage": "Chưa cấu hình API key. Đây là vấn đề về cấu hình code, không phải API.",
  "possibleCauses": [
    "Missing .env.local file",
    "GEMINI_API_KEY not set in environment variables"
  ],
  "troubleshootingSteps": [
    "Create .env.local file in project root",
    "Add: GEMINI_API_KEY=your_api_key_here",
    "Restart development server"
  ]
}
```

**Solution:**
1. Create `.env.local` file
2. Add `GEMINI_API_KEY=your_actual_key`
3. Restart server

---

### Scenario 2: Rate Limit Hit (API Issue)

**Symptoms:**
- Error: "Too many requests" or "Resource exhausted"
- Status code: 429
- Works sometimes, fails other times
- Google AI Studio dashboard shows RPM: 5/5

**Diagnosis:**
```json
{
  "errorType": "RATE_LIMIT",
  "isCodeIssue": false,
  "isApiIssue": true,
  "vietnameseMessage": "Gửi request quá nhanh, vượt giới hạn tốc độ. Đây là vấn đề về tần suất gọi API.",
  "possibleCauses": [
    "Multiple requests sent simultaneously",
    "Burst of traffic from multiple users",
    "Free tier limits are strict"
  ],
  "troubleshootingSteps": [
    "Wait 1-2 minutes before retrying",
    "Check if server-side rate limiting is working",
    "Enable billing for higher rate limits"
  ]
}
```

**Solution:**
1. Wait 1-2 minutes
2. Verify rate limiting is enabled in code
3. Consider enabling billing for higher limits

---

### Scenario 3: Quota Exceeded (API Issue)

**Symptoms:**
- Error: "Quota exceeded" or "RPD limit reached"
- Status code: 429
- Google AI Studio shows RPD: 22/20 (exceeded daily limit)

**Diagnosis:**
```json
{
  "errorType": "QUOTA_EXCEEDED",
  "isCodeIssue": false,
  "isApiIssue": true,
  "vietnameseMessage": "Đã vượt giới hạn quota API (RPM: requests per minute, RPD: requests per day). Đây là vấn đề về giới hạn API, không phải code.",
  "possibleCauses": [
    "Free tier RPD limit reached (e.g., 20 requests/day)",
    "Monthly quota exhausted",
    "Too many concurrent users"
  ],
  "troubleshootingSteps": [
    "Wait until tomorrow for daily quota reset",
    "Check usage at: https://aistudio.google.com/app/apikey",
    "Enable billing for higher limits",
    "Request quota increase from Google"
  ]
}
```

**Solution:**
1. Wait for daily quota reset (next day)
2. Enable billing to increase limits
3. Request quota increase from Google

---

### Scenario 4: Invalid API Key (API Issue)

**Symptoms:**
- Error: "Unauthorized" or "API key not valid"
- Status code: 401 or 403
- API key exists but doesn't work

**Diagnosis:**
```json
{
  "errorType": "INVALID_API_KEY",
  "isCodeIssue": false,
  "isApiIssue": true,
  "vietnameseMessage": "API key không hợp lệ hoặc hết hạn. Đây là vấn đề về cấu hình API key.",
  "possibleCauses": [
    "API key is incorrect or expired",
    "Using API key from wrong project",
    "API key has been revoked"
  ],
  "troubleshootingSteps": [
    "Verify API key at: https://aistudio.google.com/app/apikey",
    "Generate new API key if needed",
    "Update GEMINI_API_KEY in .env.local"
  ]
}
```

**Solution:**
1. Go to Google AI Studio
2. Verify API key is valid
3. Generate new key if necessary
4. Update `.env.local` with new key

## API Endpoints Updated

All AI endpoints now return diagnostic information:

- ✅ `/api/ai/score-essay` - Essay scoring
- ✅ `/api/ai/chat` - AI chatbot
- ✅ `/api/ai/grammar-check` - Grammar checking
- ✅ `/api/ai/paraphrase` - Text paraphrasing
- ✅ `/api/ai/generate-outline` - Outline generation
- ✅ `/api/ai/generate-prompts` - Prompt generation (with fallback to sample prompts)
- ✅ `/api/ai/models` - Model listing

## Error Response Format

### Standard Error Response

```json
{
  "error": "API quota limit exceeded (RPM, RPD, or monthly limit reached)",
  "errorType": "QUOTA_EXCEEDED",
  "vietnameseMessage": "Đã vượt giới hạn quota API. Đây là vấn đề về giới hạn API, không phải code.",
  "diagnostics": {
    "statusCode": 429,
    "possibleCauses": [
      "Free tier RPM limit reached (e.g., 5 requests/minute)",
      "Free tier RPD limit reached (e.g., 20 requests/day)",
      "Monthly quota exhausted"
    ],
    "troubleshootingSteps": [
      "Wait 1-2 minutes for rate limit reset",
      "Check usage at: https://aistudio.google.com/app/apikey",
      "Enable billing for higher limits"
    ],
    "isCodeIssue": false,
    "isApiIssue": true,
    "timestamp": "2025-12-26T08:28:18.319Z"
  }
}
```

## Server Logs

Enhanced logging helps developers debug issues:

```
[score-essay] Diagnostic information: {
  errorType: 'QUOTA_EXCEEDED',
  statusCode: 429,
  message: 'API quota limit exceeded (RPM, RPD, or monthly limit reached)',
  isCodeIssue: false,
  isApiIssue: true,
  possibleCauses: [
    'Free tier RPM limit reached (e.g., 5 requests/minute)',
    'Free tier RPD limit reached (e.g., 20 requests/day)',
    'Monthly quota exhausted',
    'Too many concurrent users'
  ],
  timestamp: '2025-12-26T08:28:18.319Z'
}
```

## Benefits

1. **Clear Root Cause Identification**: Users immediately know if the problem is:
   - Configuration/code issue (they or admin can fix)
   - API limit issue (need to wait or upgrade)
   - Other issue (need to investigate)

2. **Actionable Troubleshooting**: Step-by-step instructions guide users to resolution

3. **Vietnamese Support**: Vietnamese-speaking users get clear explanations in their language

4. **Better Debugging**: Developers get detailed logs with all relevant information

5. **Reduced Support Burden**: Self-service diagnostics reduce the need for manual support

## Answering the Original Question

**Question:** "Bạn đánh giá lí do AI của tôi không hoạt động do code hay do API?"  
(Do you assess whether my AI is not working due to code or API?)

**Answer with Diagnostics:**

The new diagnostic system will automatically tell you:

- If `isCodeIssue: true` → **Vấn đề do code/cấu hình** (Code/configuration problem)
  - Check API key configuration
  - Check model names in code
  - Check environment setup

- If `isApiIssue: true` → **Vấn đề do API/quota** (API/quota problem)
  - Check Google AI Studio dashboard for quota usage
  - Verify RPM, RPD, monthly limits
  - Enable billing if needed
  - Wait for quota reset

- If both are `false` → **Vấn đề khác** (Other problem)
  - Check network connectivity
  - Check server logs
  - Investigate further

## Example Use Case from Problem Statement

Based on the image showing:
- Banner: "You have reached a data limit"
- Model gemini-2.5-flash: RPM: 5/5, RPD: 22/20

**Diagnosis:**
```
errorType: "QUOTA_EXCEEDED"
isCodeIssue: false
isApiIssue: true
vietnameseMessage: "Đã vượt giới hạn quota API (RPD: 22/20). Đây là vấn đề về giới hạn API, không phải code."

Possible Causes:
1. Free tier RPD limit reached (20 requests/day limit, currently at 22)
2. Free tier RPM limit reached (5 requests/minute)

Troubleshooting Steps:
1. Wait until tomorrow for daily quota reset
2. Check usage at: https://aistudio.google.com/app/apikey
3. Enable billing for higher limits (if applicable)
4. Request quota increase from Google
```

**Clear Answer:** The AI is not working due to **API quota limits**, not code issues.

## Related Files

- `lib/error-utils.ts` - Core diagnostic utilities
- `app/api/ai/*/route.ts` - All AI API endpoints with diagnostics
- `components/chat/chat-interface.tsx` - Frontend diagnostic display
- `RATE_LIMITING.md` - Rate limiting implementation details
- `FIX_GEMINI_API_KEY.md` - API key configuration guide

## Future Enhancements

Potential improvements:
1. Add real-time quota monitoring dashboard
2. Add email notifications for quota warnings
3. Add automatic quota usage analytics
4. Add suggestions for optimal API usage patterns
5. Add integration with Google Cloud Monitoring

---

**Last Updated:** December 26, 2025
