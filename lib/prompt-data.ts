export type Prompt = {
  id: string
  title: string
  description: string
}

export const task1Prompts: Prompt[] = [
  { id: "1", title: "Bar Chart: Global CO2 Emissions", description: "Describe changes in emissions from 2000-2020" },
  { id: "2", title: "Line Graph: Internet Usage", description: "Compare internet usage across age groups" },
  {
    id: "3",
    title: "Pie Chart: Energy Sources",
    description: "Analyze renewable vs non-renewable energy distribution",
  },
]

export const task2Prompts: Prompt[] = [
  { id: "4", title: "Technology and Society", description: "Discuss the impact of technology on modern life" },
  { id: "5", title: "Education Systems", description: "Compare traditional vs modern education approaches" },
  { id: "6", title: "Environmental Issues", description: "Debate solutions to climate change" },
]
