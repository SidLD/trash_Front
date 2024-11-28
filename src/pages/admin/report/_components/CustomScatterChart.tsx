import React, { useContext } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { ResponsiveContainer, ScatterChart, Scatter, CartesianGrid, XAxis, YAxis, Legend } from 'recharts'
import { HomeContext } from '../view'

interface CustomScatterChartProps {
  onClick: () => void
  data1: Array<{ cost: number; quantity: number }>
  data2?: Array<{ cost: number; quantity: number }>
  month1: string
  month2?: string
  title: string
  xAxisLabel: string
  yAxisLabel: string
}

export const CustomScatterChart: React.FC<CustomScatterChartProps> = ({
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
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis 
                type="number" 
                dataKey="cost" 
                name="Cost (₱)" 
                label={{ value: xAxisLabel, position: 'insideBottom', offset: -5 }} 
              />
              <YAxis 
                type="number" 
                dataKey="quantity" 
                name="Quantity (kg)" 
                label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} 
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Scatter name={month1} data={data1} fill={COLORS[0]} />
              {month2 && data2 && <Scatter name={month2} data={data2} fill={COLORS[1]} />}
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}