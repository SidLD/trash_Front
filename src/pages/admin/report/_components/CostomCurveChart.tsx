import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Legend, Line, LineChart } from 'recharts';

interface CustomCurveChartProps {
  onClick: () => void;
  data1: { date: string; quantity: number; cost: number }[];
  data2?: { date: string; quantity: number; cost: number }[];
  month1: string;
  month2?: string;
}

export const CustomCurveChart: React.FC<CustomCurveChartProps> = ({ onClick, data1, data2, month1, month2 }) => {
  return (
    <Card onClick={onClick} className="w-full transition-all cursor-pointer hover:shadow-lg">
      <CardHeader>
        <CardTitle>Date of Waste vs. Quantity and Cost</CardTitle>
        <CardDescription>Line chart showing quantity and cost over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            quantity1: {
              label: `Quantity (${month1})`,
              color: "hsl(var(--chart-4))",
            },
            cost1: {
              label: `Cost (${month1})`,
              color: "hsl(var(--chart-5))",
            },
            quantity2: {
              label: month2 ? `Quantity (${month2})` : "",
              color: "hsl(var(--chart-6))",
            },
            cost2: {
              label: month2 ? `Cost (${month2})` : "",
              color: "hsl(var(--chart-7))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                type="category"
                allowDuplicatedCategory={false}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="quantity" 
                data={data1} 
                name={`Quantity (${month1})`}
                stroke="var(--color-quantity1)" 
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="cost" 
                data={data1} 
                name={`Cost (${month1})`}
                stroke="var(--color-cost1)" 
              />
              {data2 && (
                <>
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="quantity" 
                    data={data2} 
                    name={`Quantity (${month2})`}
                    stroke="var(--color-quantity2)" 
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="cost" 
                    data={data2} 
                    name={`Cost (${month2})`}
                    stroke="var(--color-cost2)" 
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}