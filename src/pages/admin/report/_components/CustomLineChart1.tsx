import React, { useContext } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { HomeContext } from '../view'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { ResponsiveContainer, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

interface CustomBarChartProps {
  onClick: () => void
  data1: Array<{ name: string; value: number }>
  data2?: Array<{ name: string; value: number }>
  month1: string
  month2?: string
  title: string
  xAxisLabel: string
  yAxisLabel: string
}

export const CustomBarChart: React.FC<CustomBarChartProps> = ({ 
  onClick, 
  data1, 
  data2, 
  month1, 
  month2, 
  title,
  xAxisLabel,
  yAxisLabel
}) => {
  const { COLORS } = useContext(HomeContext)

  // Combine data for both months
  const combinedData = data1.map(item => ({
    name: item.name,
    [month1]: item.value,
    ...(data2 ? { [month2 as string]: data2.find(d => d.name === item.name)?.value || 0 } : {})
  }))

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
            <BarChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                label={{ value: xAxisLabel, position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey={month1} fill={COLORS[0]} />
              {month2 && <Bar dataKey={month2} fill={COLORS[1]} />}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}