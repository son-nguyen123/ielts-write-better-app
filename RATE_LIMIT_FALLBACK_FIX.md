# Fix for Prompt Generation Rate Limit Errors

## Problem
The prompt generation feature at `/practice/prompts` was failing when the Gemini API hit rate limits (HTTP 429 errors), showing error messages to users instead of providing a graceful fallback experience.

### Error Symptoms
- API endpoint `/api/ai/generate-prompts` returning 429 status
- Console errors: "AI tạo đề bài đang vượt giới hạn sử dụng"
- Users unable to access practice prompts
- No fallback mechanism when API quota is exceeded

## Root Cause
While the application had sample prompt generation logic built in, it was only used when:
- The `GEMINI_API_KEY` environment variable was not set

When the API key was configured but the API hit rate limits, the error was returned to the user instead of falling back to sample prompts.

## Solution Implemented

### 1. Backend Changes (`app/api/ai/generate-prompts/route.ts`)

Added graceful fallback to sample prompts when rate limit errors occur:

```typescript
if (isRateLimitError) {
  // Fallback to sample prompts when rate limit is hit
  console.log("[v0] Rate limit hit, falling back to sample prompts")
  const samplePrompts = generateSamplePrompts(selectedTaskType, selectedTopics, promptCount)
  return Response.json({ 
    prompts: samplePrompts,
    usingSampleData: true,
    message: "Đang sử dụng đề bài mẫu do giới hạn API. Các đề bài vẫn phù hợp để luyện tập."
  })
}
```

**Key improvements:**
- Parse request body once at the beginning to avoid re-parsing errors
- Detect rate limit errors (429 status, quota messages)
- Return sample prompts with `usingSampleData: true` flag
- Include user-friendly Vietnamese message
- Log fallback for debugging

### 2. Frontend Changes (`components/practice/prompts-library.tsx`)

Updated to handle sample data responses gracefully:

```typescript
// Show appropriate message based on whether using sample data
if (result.usingSampleData) {
  toast.info(result.message || "Đang sử dụng đề bài mẫu do giới hạn API")
} else {
  toast.success("New prompts generated!")
}
```

**Key improvements:**
- Display informative toast (blue) when using sample data
- Display success toast (green) when using AI-generated prompts
- Users are informed but not alarmed by the fallback

### 3. Sample Prompt Generation Logic Fix

Fixed TypeScript error in the sample prompt generation logic:

**Before:**
```typescript
const shouldBeTask1 = taskType === "Task 1" || (taskType === "all" && Math.random() > 0.5)
if (shouldBeTask1 && taskType !== "Task 2") { ... }
```

**After:**
```typescript
const shouldBeTask1 = taskType === "Task 1" || (taskType !== "Task 2" && Math.random() > 0.5)
if (shouldBeTask1) { ... }
```

This simplified logic properly handles all three cases:
- `taskType === "Task 1"` → Always Task 1
- `taskType === "Task 2"` → Always Task 2  
- `taskType === "all"` or other → Random mix 50/50

## Benefits

1. **No Service Interruption**: Users can continue practicing even when API quota is exceeded
2. **Transparent Experience**: Users are informed they're using sample prompts
3. **Quality Maintained**: Sample prompts are well-structured and suitable for practice
4. **Cost Efficient**: Reduces wasted API calls during rate limit periods
5. **Better UX**: No error screens, just informative messages

## Sample Prompt Quality

The sample prompts are not inferior - they include:
- **Task 1 Prompts**: Bar charts, line graphs, pie charts with realistic scenarios
- **Task 2 Prompts**: Opinion essays, discussion essays, problem-solution essays
- **Diverse Topics**: Technology, Education, Environment, Health, Society, etc.
- **Proper Structure**: Title, description, tags, unique IDs

## Testing

To verify the fix works:

1. **Simulate Rate Limit** (for testing):
   - Set `GEMINI_API_KEY` to an invalid or quota-exceeded key
   - Or modify code to throw rate limit error

2. **Expected Behavior**:
   - Navigate to `/practice/prompts`
   - Click "Generate New Prompts"
   - See blue info toast: "Đang sử dụng đề bài mẫu do giới hạn API..."
   - 6 sample prompts are displayed
   - Prompts are usable for practice

3. **Normal Behavior** (when API is available):
   - Same flow as above
   - Green success toast: "New prompts generated!"
   - AI-generated prompts are displayed

## Rate Limit Detection

The code detects rate limits through multiple checks:
- HTTP status code 429
- Error message contains "too many requests"
- Error message contains "quota"
- Error message contains "rate limit"
- Error message contains "429"

This comprehensive detection ensures we catch all rate limit scenarios.

## Related Files

- `app/api/ai/generate-prompts/route.ts` - API endpoint with fallback logic
- `components/practice/prompts-library.tsx` - Frontend component
- `lib/server-rate-limiter.ts` - Rate limiting infrastructure
- `lib/retry-utils.ts` - Retry configuration
- `RATE_LIMITING.md` - General rate limiting documentation

## Future Improvements

Potential enhancements:
1. Cache AI-generated prompts to reduce API calls
2. Expand sample prompt library with more variety
3. Allow users to manually switch between AI and sample prompts
4. Add telemetry to track fallback usage
5. Implement progressive rate limiting (reduce frequency before fallback)

## Deployment Notes

This fix requires no configuration changes:
- Works with existing environment variables
- No new dependencies
- Backward compatible
- Safe to deploy immediately

The feature will automatically use sample prompts when rate limits are hit, providing a seamless experience for users regardless of API quota status.
