import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useContext } from 'react'
import { HomeContext } from '../view';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ResponsiveContainer, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
interface CustomCurveChartProps {
    onClick: () => void;
  }

export const CustomLineChart1 : React.FC<CustomCurveChartProps> = ({ onClick }) => {
    const {dishesWastedData} = useContext(HomeContext)
  return <Card onClick={onClick} className="transition-all cursor-pointer hover:shadow-lg">
    <CardHeader>
      <CardTitle>Cost of Wasted Food vs. Dishes Wasted</CardTitle>
      <CardDescription>Bar chart showing cost of wasted food by dish</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer
        config={{
          cost: {
            label: "Cost",
            color: "hsl(var(--chart-2))",
          },
        }}
        className="h-[400px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dishesWastedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="var(--color-cost)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>
}
