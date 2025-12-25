import { generateObject } from "ai"
import { getGoogleModel } from "@/lib/ai"
import { retryWithBackoff, GEMINI_RETRY_CONFIG } from "@/lib/retry-utils"
import { withRateLimit } from "@/lib/server-rate-limiter"
import { z } from "zod"

export const maxDuration = 30
const RATE_LIMIT_FALLBACK_MESSAGE =
  "AI tạo đề bài đang vượt giới hạn sử dụng (prompt generation is rate limited). Đã dùng bộ đề mẫu tạm thời, vui lòng thử lại sau vài phút để nhận đề mới."

const promptSchema = z.object({
  prompts: z.array(
    z.object({
      id: z.string(),
      type: z.enum(["Task 1", "Task 2"]),
      title: z.string(),
      description: z.string(),
      tags: z.array(z.string()),
    })
  ),
})

type GeneratePromptsRequest = {
  taskType?: "Task 1" | "Task 2" | "all" | null
  topics?: string[]
  count?: number
}

// Helper function to generate sample prompts when API is not available
function generateSamplePrompts(taskType: string, topics: string[], count: number) {
  const task1Templates = [
    {
      type: "Task 1" as const,
      templates: [
        (topic: string) => ({
          id: crypto.randomUUID(),
          type: "Task 1" as const,
          title: `Bar Chart: ${topic} Trends`,
          description: `The bar chart illustrates the changes in ${topic.toLowerCase()} across different regions from 2010 to 2024. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.`,
          tags: ["Bar Chart", topic, "Trends", "Comparison"],
        }),
        (topic: string) => ({
          id: crypto.randomUUID(),
          type: "Task 1" as const,
          title: `Line Graph: ${topic} Growth`,
          description: `The line graph shows the trend in ${topic.toLowerCase()} development across five countries between 2015 and 2025. Describe the main trends and make relevant comparisons.`,
          tags: ["Line Graph", topic, "Growth", "International"],
        }),
        (topic: string) => ({
          id: crypto.randomUUID(),
          type: "Task 1" as const,
          title: `Pie Chart: ${topic} Distribution`,
          description: `The pie charts compare the distribution of ${topic.toLowerCase()} resources in two different years, 2010 and 2023. Summarize the information and highlight the key changes.`,
          tags: ["Pie Chart", topic, "Distribution", "Change"],
        }),
      ],
    },
  ]

  const task2Templates = [
    (topic: string) => ({
      id: crypto.randomUUID(),
      type: "Task 2" as const,
      title: `${topic} and Modern Society`,
      description: `Some people believe that ${topic.toLowerCase()} has significantly improved our quality of life, while others argue it has created new challenges. Discuss both views and give your own opinion.`,
      tags: [topic, "Society", "Opinion", "Discussion"],
    }),
    (topic: string) => ({
      id: crypto.randomUUID(),
      type: "Task 2" as const,
      title: `The Role of ${topic}`,
      description: `To what extent do you agree or disagree that governments should invest more resources in ${topic.toLowerCase()} to ensure future prosperity?`,
      tags: [topic, "Government", "Investment", "Opinion"],
    }),
    (topic: string) => ({
      id: crypto.randomUUID(),
      type: "Task 2" as const,
      title: `${topic} Challenges`,
      description: `What are the main problems associated with ${topic.toLowerCase()} in today's world, and what solutions can be implemented to address these issues?`,
      tags: [topic, "Problems", "Solutions", "Contemporary"],
    }),
  ]

  const prompts = []
  const selectedTopics = topics.slice(0, count)

  for (let i = 0; i < count; i++) {
    const topic = selectedTopics[i % selectedTopics.length]
    const shouldBeTask1 = taskType === "Task 1" || (taskType === "all" && Math.random() > 0.5)

    if (shouldBeTask1 && taskType !== "Task 2") {
      const template = task1Templates[0].templates[i % task1Templates[0].templates.length]
      prompts.push(template(topic))
    } else {
      const template = task2Templates[i % task2Templates.length]
      prompts.push(template(topic))
    }
  }

  return prompts
}

export async function POST(req: Request) {
  let requestData: GeneratePromptsRequest | null = null
  try {
    requestData = await req.json()
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { taskType, topics, count } = requestData || {}
  const promptCount = count || 4
  const selectedTopics = topics && topics.length > 0 ? topics : ["general"]
  const selectedTaskType: "Task 1" | "Task 2" | "all" =
    taskType === "Task 1" || taskType === "Task 2" || taskType === "all" ? taskType : "all"

  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.log("[v0] GEMINI_API_KEY not found, using sample prompts")
      const samplePrompts = generateSamplePrompts(selectedTaskType, selectedTopics, promptCount)
      return Response.json({ prompts: samplePrompts })
    }

    let taskTypeInstruction = ""
    if (selectedTaskType === "Task 1") {
      taskTypeInstruction = "Generate only IELTS Task 1 prompts (describing graphs, charts, diagrams, processes, or maps)."
    } else if (selectedTaskType === "Task 2") {
      taskTypeInstruction = "Generate only IELTS Task 2 prompts (essay questions on various topics)."
    } else {
      taskTypeInstruction = "Generate a mix of IELTS Task 1 and Task 2 prompts."
    }

    const topicsInstruction = selectedTopics.join(", ")

    // Use server-side rate limiting to prevent quota exhaustion
    const { object } = await withRateLimit(() =>
      retryWithBackoff(
        () =>
          generateObject({
            model: getGoogleModel(),
            schema: promptSchema,
            prompt: `Generate ${promptCount} unique and diverse IELTS writing prompts.

${taskTypeInstruction}

Focus on these topics: ${topicsInstruction}

Requirements:
- Make each prompt unique and realistic
- For Task 1: Include specific chart/graph types (bar chart, line graph, pie chart, table, process diagram, map)
- For Task 2: Create thought-provoking essay questions on relevant topics
- Each prompt should have:
  - A unique ID (use UUID format)
  - Correct type ("Task 1" or "Task 2")
  - A descriptive title
  - A detailed description/question
  - 2-4 relevant tags

Ensure variety in:
- Question types (opinion, discussion, problem-solution, advantages-disadvantages)
- Difficulty levels
- Contemporary and relevant topics`,
            temperature: 0.9,
          }),
        GEMINI_RETRY_CONFIG
      )
    )

    return Response.json({ prompts: object.prompts })
  } catch (error: any) {
    console.error("[v0] Error generating prompts:", error)
    
    // Check for rate limit / quota errors
    const errorMessage = error?.message || error?.toString() || ""
    const isRateLimitError = 
      error?.status === 429 ||
      error?.response?.status === 429 ||
      errorMessage.toLowerCase().includes("too many requests") ||
      errorMessage.toLowerCase().includes("quota") ||
      errorMessage.toLowerCase().includes("rate limit") ||
      errorMessage.includes("429")
    
    if (isRateLimitError) {
      const samplePrompts = generateSamplePrompts(selectedTaskType, selectedTopics, promptCount)
      return Response.json({
        prompts: samplePrompts,
        fallback: true,
        message: RATE_LIMIT_FALLBACK_MESSAGE,
      })
    }
    
    return Response.json({ 
      error: "Failed to generate prompts",
      errorType: "GENERIC"
    }, { status: 500 })
  }
}
