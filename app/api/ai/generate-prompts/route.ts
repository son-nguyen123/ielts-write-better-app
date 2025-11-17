import { generateObject } from "ai"
import { getGoogleModel } from "@/lib/ai"
import { z } from "zod"

export const maxDuration = 30

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
  try {
    const { taskType, topics, count } = await req.json()

    const promptCount = count || 4
    const selectedTopics = topics && topics.length > 0 ? topics : ["general"]
    const selectedTaskType = taskType || "all"

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

    const { object } = await generateObject({
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
    })

    return Response.json({ prompts: object.prompts })
  } catch (error) {
    console.error("[v0] Error generating prompts:", error)
    return Response.json({ error: "Failed to generate prompts" }, { status: 500 })
  }
}
