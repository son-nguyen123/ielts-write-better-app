import { NextRequest } from "next/server"
import { getGeminiModel } from "@/lib/gemini-native"
import { retryWithBackoff, GEMINI_RETRY_CONFIG } from "@/lib/retry-utils"
import { withRateLimit } from "@/lib/server-rate-limiter"

export const maxDuration = 60

/**
 * API endpoint to analyze a specific submission and generate targeted improvement suggestions
 * based on the gap between current score and target score
 */
export async function POST(req: NextRequest) {
  let requestData: any
  try {
    requestData = await req.json()
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  try {
    const { 
      submissionId,
      submissionTitle,
      weakestSkill, 
      currentScore, 
      targetScore,
      keySuggestion 
    } = requestData

    if (!submissionId || !weakestSkill || currentScore === undefined || targetScore === undefined) {
      return Response.json({ 
        error: "Missing required fields: submissionId, weakestSkill, currentScore, targetScore" 
      }, { status: 400 })
    }

    const gap = targetScore - currentScore

    // Sanitize user inputs to prevent prompt injection
    const sanitizedTitle = submissionTitle?.replace(/[`"'\n\r]/g, ' ').substring(0, 200) || "Untitled"
    const sanitizedSuggestion = keySuggestion?.replace(/[`"'\n\r]/g, ' ').substring(0, 500) || ""

    // If already at or above target, return a congratulatory message
    if (gap <= 0) {
      return Response.json({
        submissionId,
        submissionTitle,
        weakestSkill,
        currentScore,
        targetScore,
        gap: 0,
        improvementSuggestions: `🎉 **Congratulations!** You've already achieved or exceeded your target score of ${targetScore.toFixed(1)} in ${getCriterionFullName(weakestSkill)} with a score of ${currentScore.toFixed(1)}. Keep up the excellent work!`
      })
    }

    const model = getGeminiModel()

    // Create a detailed prompt for gap analysis
    const prompt = `You are an expert IELTS writing tutor analyzing a student's essay performance to help them reach their target score.

**Essay Details:**
- Title: ${sanitizedTitle}
- Weakest Criterion: ${getCriterionFullName(weakestSkill)}
- Current Score: ${currentScore.toFixed(1)}
- Target Score: ${targetScore.toFixed(1)}
- Gap to Close: +${gap.toFixed(1)} points
${sanitizedSuggestion ? `- Identified Issue: ${sanitizedSuggestion}` : ""}

**Your Task:**
Provide specific, actionable guidance to help the student improve from ${currentScore.toFixed(1)} to ${targetScore.toFixed(1)} in ${getCriterionFullName(weakestSkill)}.

**Structure your response as follows:**

## Key Issues to Address

List 2-3 specific problems that are preventing the student from reaching the target score in this criterion.

## Step-by-Step Improvement Plan

Provide a concrete action plan with 3-4 specific steps the student should take to improve.

## What Success Looks Like

Describe what a ${targetScore.toFixed(1)} response looks like for ${getCriterionFullName(weakestSkill)}, so the student knows what to aim for.

## Practice Exercise

Suggest one specific exercise or technique the student can use immediately to practice this skill.

**Important:**
- Be specific and actionable - avoid generic advice
- Focus on the ${gap.toFixed(1)}-point gap that needs to be closed
- Reference IELTS band descriptors for ${getCriterionFullName(weakestSkill)}
- Be encouraging but realistic about what needs improvement
- Keep your response concise but comprehensive (300-400 words)`

    // Use server-side rate limiting to prevent quota exhaustion
    const result = await withRateLimit(() =>
      retryWithBackoff(
        () => model.generateContent(prompt),
        GEMINI_RETRY_CONFIG
      )
    )
    
    const response = result.response
    const suggestions = response.text()

    return Response.json({
      submissionId,
      submissionTitle: sanitizedTitle,
      weakestSkill,
      currentScore,
      targetScore,
      gap,
      improvementSuggestions: suggestions,
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error("[analyze-submission-gap] Error:", error)
    const criterionName = getCriterionFullName(requestData?.weakestSkill || "")
    const fallbackSuggestions = buildFallbackSuggestions({
      submissionTitle: requestData?.submissionTitle,
      weakestSkill: criterionName,
      currentScore: requestData?.currentScore,
      targetScore: requestData?.targetScore,
      gap: (requestData?.targetScore ?? 0) - (requestData?.currentScore ?? 0),
      keySuggestion: requestData?.keySuggestion
    })

    return Response.json({
      submissionId: requestData?.submissionId,
      submissionTitle: requestData?.submissionTitle || "Untitled",
      weakestSkill: requestData?.weakestSkill,
      currentScore: requestData?.currentScore,
      targetScore: requestData?.targetScore,
      gap: (requestData?.targetScore ?? 0) - (requestData?.currentScore ?? 0),
      improvementSuggestions: fallbackSuggestions,
      generatedAt: new Date().toISOString(),
      fallback: true,
      error: error instanceof Error ? error.message : "Failed to analyze submission gap"
    })
  }
}

function getCriterionFullName(criterion: string): string {
  const names: Record<string, string> = {
    TR: "Task Response",
    CC: "Coherence & Cohesion",
    LR: "Lexical Resource",
    GRA: "Grammar & Accuracy"
  }
  return names[criterion] || criterion
}

function buildFallbackSuggestions({
  submissionTitle,
  weakestSkill,
  currentScore,
  targetScore,
  gap,
  keySuggestion
}: {
  submissionTitle?: string
  weakestSkill?: string
  currentScore?: number
  targetScore?: number
  gap?: number
  keySuggestion?: string
}) {
  const criterionName = weakestSkill || "your weakest criterion"
  const safeCurrent = currentScore ?? 0
  const safeTarget = targetScore ?? safeCurrent + (gap ?? 1)
  const safeGap = gap ?? Math.max(0, safeTarget - safeCurrent)
  const focusLine = keySuggestion ? `- Noted issue: ${keySuggestion}\n` : ""

  return `### Quick improvement plan for ${criterionName}

We couldn't generate an AI-powered analysis right now, so here is a concise plan to help you close the ${safeGap.toFixed(
    1
  )}-point gap from ${safeCurrent.toFixed(1)} to ${safeTarget.toFixed(1)}.

${focusLine}- **What to improve:** Target ${criterionName.toLowerCase()} in your next drafts.
- **Fixes to apply:** Simplify sentences, use clear topic sentences, and ensure every example links back to the question.
- **Practice loop:** Revisit "${submissionTitle || "your latest submission"}", rewrite one paragraph focusing on ${criterionName.toLowerCase()}, and compare against band ${safeTarget.toFixed(
    1
  )} descriptors.
- **Next step:** After rewriting, run the analysis again to get detailed AI feedback.`
}
