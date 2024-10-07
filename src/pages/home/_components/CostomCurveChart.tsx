import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useContext } from 'react'
import { HomeContext } from '../view';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ResponsiveContainer,CartesianGrid, XAxis, YAxis, Legend, Line, LineChart } from 'recharts';

interface CustomCurveChartProps {
    onClick: () => void;
  }

export const CustomCurveChart : React.FC<CustomCurveChartProps> = ({ onClick }) => {
    const {lineChartData} = useContext(HomeContext)
  return  <Card onClick={onClick} className="transition-all cursor-pointer hover:shadow-lg">
  <CardHeader>
    <CardTitle>Date of Waste vs. Quantity and Cost</CardTitle>
    <CardDescription>Line chart showing quantity and cost over time</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer
      config={{
        quantity: {
          label: "Quantity",
          color: "hsl(var(--chart-4))",
        },
        cost: {
          label: "Cost",
          color: "hsl(var(--chart-5))",
        },
      }}
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={lineChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="quantity" stroke="var(--color-quantity)" />
          <Line yAxisId="right" type="monotone" dataKey="cost" stroke="var(--color-cost)" />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  </CardContent>
</Card>
}
