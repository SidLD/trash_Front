import React, { useContext } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { HomeContext } from '../view'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Legend } from 'recharts'

interface CustomCurveChartProps {
  onClick: () => void
  data1: Array<{ date: string; quantity: number; cost: number }>
  data2?: Array<{ date: string; quantity: number; cost: number }>
  month1: string
  month2?: string
  title: string
  xAxisLabel: string
  yAxisLabel: string
  dataKey: 'quantity' | 'cost'
}

export const CustomCurveChart: React.FC<CustomCurveChartProps> = ({
  onClick,
  data1,
  data2,
  month1,
  month2,
  title,
  xAxisLabel,
  yAxisLabel,
  dataKey
}) => {
  const { COLORS } = useContext(HomeContext)

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem)
    return `${date.getDate()}/${date.getMonth() + 1}`
  }

  const formatYAxis = (value: number) => {
    return dataKey === 'cost' ? `₱${value.toFixed(2)}` : value.toFixed(2)
  }

  const renderLine = (data: Array<{ date: string; quantity: number; cost: number }>, color: string, name: string) => (
    <Line
      type="monotone"
      dataKey={dataKey}
      data={data}
      name={name}
      stroke={color}
      activeDot={{ r: 8 }}
      connectNulls
    />
  )

  return (
    <Card onClick={onClick} className="transition-all cursor-pointer hover:shadow-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Comparison of {month1} {month2 ? `and ${month2}` : ''}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            [month1]: {
              label: month1,
              color: COLORS[0],
            },
            ...(month2 ? {
              [month2]: {
                label: month2,
                color: COLORS[1],
              }
            } : {})
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis}
                label={{ value: xAxisLabel, position: 'insideBottom', offset: -5 }} 
              />
              <YAxis 
                tickFormatter={formatYAxis}
                label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} 
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {renderLine(data1, COLORS[0], month1)}
              {month2 && data2 && renderLine(data2, COLORS[1], month2)}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}