"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts"

interface PerformanceComparisonChartProps {
  beforeScores?: {
    TR: number
    CC: number
    LR: number
    GRA: number
  }
  currentScores: {
    TR: number
    CC: number
    LR: number
    GRA: number
  }
  showLabels?: boolean
}

// Color scheme from the requirements
const BEFORE_COLOR = "#9B5DE5" // Purple-pink for Before/Pre-test
const CURRENT_COLOR = "#FF9F1C" // Orange for Now/Current
const GRID_COLOR = "rgba(255,255,255,0.15)" // Light gray transparent
const BORDER_COLOR = "rgba(255,255,255,0.6)" // White transparent border

// Full criterion names
const CRITERIA_NAMES = {
  TR: "Task Achievement / Response",
  CC: "Coherence & Cohesion",
  LR: "Lexical Resource",
  GRA: "Grammatical Range & Accuracy"
}

export function PerformanceComparisonChart({ 
  beforeScores,
  currentScores,
  showLabels = true 
}: PerformanceComparisonChartProps) {
  // Prepare data for grouped bar chart
  const data = [
    {
      name: "Task Achievement /\nResponse",
      shortName: "TR",
      Before: beforeScores?.TR || 0,
      Current: currentScores.TR,
    },
    {
      name: "Coherence &\nCohesion",
      shortName: "CC",
      Before: beforeScores?.CC || 0,
      Current: currentScores.CC,
    },
    {
      name: "Lexical\nResource",
      shortName: "LR",
      Before: beforeScores?.LR || 0,
      Current: currentScores.LR,
    },
    {
      name: "Grammatical Range\n& Accuracy",
      shortName: "GRA",
      Before: beforeScores?.GRA || 0,
      Current: currentScores.GRA,
    },
  ]

  // Calculate improvement
  const calculateImprovement = () => {
    if (!beforeScores) return null
    
    const improvements = {
      TR: currentScores.TR - beforeScores.TR,
      CC: currentScores.CC - beforeScores.CC,
      LR: currentScores.LR - beforeScores.LR,
      GRA: currentScores.GRA - beforeScores.GRA,
    }
    
    const averageImprovement = (improvements.TR + improvements.CC + improvements.LR + improvements.GRA) / 4
    const maxImprovement = Math.max(...Object.values(improvements))
    const minImprovement = Math.min(...Object.values(improvements))
    const maxCriterion = Object.entries(improvements).find(([_, val]) => val === maxImprovement)?.[0]
    
    return { improvements, averageImprovement, maxImprovement, minImprovement, maxCriterion }
  }

  const improvementInfo = calculateImprovement()

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-[#0f172a] border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2 text-sm text-white">{CRITERIA_NAMES[data.shortName as keyof typeof CRITERIA_NAMES]}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-300">{entry.name}:</span>
              <span className="font-semibold text-white">{entry.value.toFixed(1)}</span>
            </div>
          ))}
          {beforeScores && (
            <div className="mt-2 pt-2 border-t border-gray-600">
              <span className="text-xs text-gray-400">
                Improvement: <span className={`font-semibold ${data.Current - data.Before >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {data.Current - data.Before >= 0 ? '+' : ''}{(data.Current - data.Before).toFixed(1)}
                </span>
              </span>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  // Custom label renderer with improvement indicators
  const renderCustomLabel = (props: any) => {
    const { x, y, width, value, dataKey } = props
    if (!showLabels || value === 0) return null
    
    // Show improvement delta for Current bars
    if (dataKey === 'Current' && beforeScores) {
      const criterionShortName = props.payload.shortName as keyof typeof beforeScores
      const beforeValue = beforeScores[criterionShortName]
      const improvement = value - beforeValue
      const improvementText = improvement >= 0 ? `+${improvement.toFixed(1)}` : improvement.toFixed(1)
      const color = improvement > 0 ? '#22c55e' : improvement < 0 ? '#ef4444' : '#9CA3AF'
      
      return (
        <g>
          <text
            x={x + width / 2}
            y={y - 20}
            fill="#FFFFFF"
            textAnchor="middle"
            fontSize={12}
            fontWeight={600}
          >
            {value.toFixed(1)}
          </text>
          <text
            x={x + width / 2}
            y={y - 5}
            fill={color}
            textAnchor="middle"
            fontSize={11}
            fontWeight={700}
          >
            ({improvementText})
          </text>
        </g>
      )
    }
    
    return (
      <text
        x={x + width / 2}
        y={y - 5}
        fill="#FFFFFF"
        textAnchor="middle"
        fontSize={12}
        fontWeight={600}
      >
        {value.toFixed(1)}
      </text>
    )
  }

  return (
    <Card className="rounded-2xl border-border bg-[#111827]">
      <CardHeader>
        <CardTitle className="text-2xl text-white">
          Your Progress – Performance across IELTS Criteria
        </CardTitle>
        <CardDescription className="text-gray-300">
          {beforeScores 
            ? "Comparison of your first submission vs current average performance across all IELTS criteria"
            : "Your current performance across all IELTS criteria"
          }
        </CardDescription>
        {improvementInfo && (
          <div className="mt-3 space-y-2">
            {improvementInfo.averageImprovement > 0 ? (
              <p className="text-sm text-green-400 font-semibold">
                📈 Average improvement: <span className="text-lg">+{improvementInfo.averageImprovement.toFixed(2)} bands</span> across all criteria
              </p>
            ) : improvementInfo.averageImprovement < 0 ? (
              <p className="text-sm text-orange-400 font-semibold">
                ⚠️ Average change: <span className="text-lg">{improvementInfo.averageImprovement.toFixed(2)} bands</span> - keep practicing!
              </p>
            ) : (
              <p className="text-sm text-gray-400 font-semibold">
                Your scores are stable. Focus on consistent practice for improvement.
              </p>
            )}
            {improvementInfo.maxImprovement > 0 && improvementInfo.maxCriterion && (
              <p className="text-sm text-gray-300">
                🎯 Best improvement: <span className="font-bold text-green-400">+{improvementInfo.maxImprovement.toFixed(2)} bands</span> in {improvementInfo.maxCriterion} ({CRITERIA_NAMES[improvementInfo.maxCriterion as keyof typeof CRITERIA_NAMES].split('/')[0].trim()})
              </p>
            )}
            {improvementInfo.minImprovement < 0 && (
              <p className="text-sm text-gray-300">
                💡 Areas needing attention: {Object.entries(improvementInfo.improvements)
                  .filter(([_, val]) => val < 0)
                  .map(([key, val]) => `${key} (${val.toFixed(2)})`)
                  .join(', ')}
              </p>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart 
            data={data} 
            margin={{ top: 30, right: 30, left: 10, bottom: 80 }}
            barGap={8}
            barCategoryGap="20%"
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={GRID_COLOR}
              vertical={false}
            />
            <XAxis 
              dataKey="name"
              tick={{ fill: "#E5E7EB", fontSize: 12 }}
              tickLine={{ stroke: "rgba(255,255,255,0.2)" }}
              interval={0}
              angle={0}
              textAnchor="middle"
              height={80}
            />
            <YAxis
              domain={[4, 9]}
              ticks={[4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9]}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              tickLine={{ stroke: "rgba(255,255,255,0.2)" }}
              label={{ 
                value: "Band Score", 
                angle: -90, 
                position: "insideLeft", 
                style: { fill: "#E5E7EB", fontSize: 14, fontWeight: 600 } 
              }}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="rect"
              formatter={(value) => (
                <span className="text-sm font-semibold text-white">{value}</span>
              )}
            />
            {beforeScores && (
              <Bar 
                dataKey="Before" 
                fill={BEFORE_COLOR}
                radius={[6, 6, 0, 0]}
                label={renderCustomLabel}
                stroke={BORDER_COLOR}
                strokeWidth={2}
                name="First Submission"
              />
            )}
            <Bar 
              dataKey="Current" 
              fill={CURRENT_COLOR}
              radius={[6, 6, 0, 0]}
              label={renderCustomLabel}
              stroke={BORDER_COLOR}
              strokeWidth={2}
              name="Current Average"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
