# Chat Feature Setup Guide

## Overview
This guide helps you troubleshoot and configure the AI Chat feature in the IELTS WriteBetter application.

## Common Issues and Solutions

### Issue 1: "404 - Failed to load resource" on `/api/ai/models`

**Cause**: The Gemini API models endpoint is failing to fetch available models.

**Solutions**:
1. **Verify API Key**: Make sure your `GEMINI_API_KEY` is valid and properly set in `.env.local`
   ```bash
   # .env.local
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

2. **Get a Valid API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key" or "Get API Key"
   - Copy the key and add it to your `.env.local` file

3. **Fallback Models**: The application now includes fallback models, so even if the API fails, you'll still have models available:
   - `gemini-2.0-flash-exp` (Experimental - Higher rate limits)
   - `gemini-1.5-flash` (Stable)
   - `gemini-1.5-pro` (Most capable)

### Issue 2: "429 - AI chat đang vượt giới hạn sử dụng"

**Cause**: You're hitting Gemini API rate limits.

**Solutions**:
1. **Wait Between Requests**: The rate limiter enforces a 4-second delay between requests. Wait at least 1-2 minutes before retrying after seeing this error.

2. **Check Your Quota**:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Check your usage dashboard
   - Free tier limits:
     - 15 requests per minute (RPM)
     - 1,000,000 tokens per minute (TPM)
     - 200 requests per day (RPD)

3. **Upgrade Your Plan**: If you need higher limits, consider:
   - Enabling billing in Google Cloud Console
   - Requesting quota increases

4. **Use Experimental Model**: The app now defaults to `gemini-2.0-flash-exp` which has higher rate limits than other models.

### Issue 3: Chat Not Responding or Loading Forever

**Solutions**:
1. **Check Browser Console**: Open Developer Tools (F12) and look for error messages
2. **Verify Environment Variables**: Make sure `.env.local` is properly configured
3. **Restart Development Server**: 
   ```bash
   npm run dev
   ```
4. **Clear Browser Cache**: Sometimes cached responses cause issues

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the project root:

```env
# Required: Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Firebase Configuration (for authentication and data storage)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Access the Chat

Navigate to `http://localhost:3000/chat`

## Model Selection

The application now uses a smart model selection strategy:

1. **Primary Model**: `gemini-2.0-flash-exp` (Experimental)
   - Faster responses
   - Higher rate limits
   - Best for development and high-usage scenarios

2. **Fallback Models**: If the primary model fails:
   - `gemini-1.5-flash`: Stable and reliable
   - `gemini-1.5-pro`: Most capable, slower but more accurate

3. **Custom Model Selection**: Users can select their preferred model from the Settings panel in the chat interface.

## Rate Limiting Configuration

The application includes built-in rate limiting to prevent quota exhaustion:

- **Max Concurrent Requests**: 1 (only one AI request at a time)
- **Minimum Interval**: 4 seconds between requests
- **Maximum Rate**: ~15 requests per minute

This ensures stable operation within free tier limits.

## Error Messages and What They Mean

| Error Message | Meaning | Solution |
|--------------|---------|----------|
| "AI chat đang vượt giới hạn sử dụng" | Rate limit exceeded | Wait 1-2 minutes before retrying |
| "Lỗi xác thực API" | API key is invalid or missing | Check your API key configuration |
| "Failed to load Gemini models" | Cannot fetch available models | Fallback models will be used automatically |
| "Request failed with status 404" | API endpoint not found | Check your Gemini API key is valid |

## Testing the Chat Feature

1. **Send a Simple Message**:
   ```
   Hello, can you help me improve my IELTS writing?
   ```

2. **Test with Essay Context**:
   - Click "Bài viết đã chấm" panel
   - Select a scored essay from the dropdown
   - Use quick action buttons or ask specific questions

3. **Verify Model Selection**:
   - Check the "Gemini model" dropdown in Settings
   - Try switching between available models
   - Confirm requests are working with different models

## Deployment Considerations

### Vercel Deployment

When deploying to Vercel:

1. Add environment variables in Vercel dashboard:
   - Settings → Environment Variables
   - Add `GEMINI_API_KEY` and any Firebase config variables

2. Verify the deployment URL is using HTTPS

3. Check Vercel function logs if issues occur:
   - Vercel Dashboard → Your Project → Logs
   - Look for errors related to `/api/ai/chat` or `/api/ai/models`

### Production Best Practices

1. **Monitor API Usage**: Regularly check your Gemini API quota usage
2. **Set Up Alerts**: Configure alerts when approaching rate limits
3. **Enable Billing**: Consider enabling billing for production use to avoid interruptions
4. **Use Latest Models**: Keep the model selection updated as new models are released

## Getting Help

If you continue to experience issues:

1. Check the browser console for detailed error messages
2. Review server logs for API-related errors
3. Verify your Gemini API key is active and has quota remaining
4. Open an issue in the GitHub repository with:
   - Error messages from console
   - Steps to reproduce
   - Your environment (browser, OS, etc.)

## Summary of Changes Made

This update includes:

1. ✅ **Dynamic Model Selection**: Changed from hardcoded `gemini-2.0-flash` to `gemini-2.0-flash-exp` with fallback support
2. ✅ **Fallback Models**: Added predefined fallback models when API fetch fails
3. ✅ **Better Error Handling**: Improved error messages for rate limits and auth errors
4. ✅ **Enhanced User Feedback**: Clear Vietnamese error messages for better UX
5. ✅ **Robust API Routes**: Models endpoint now returns fallback models instead of failing completely

These changes ensure the chat feature works reliably even when facing API issues or rate limits.
