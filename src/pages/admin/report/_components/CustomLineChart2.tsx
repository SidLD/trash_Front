import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useContext } from 'react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ResponsiveContainer, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { HomeContext } from '../view';
interface CustomCurveChartProps {
  onClick: () => void;
}

export const CustomLineChart2  : React.FC<CustomCurveChartProps> = ({ onClick }) => {
    const {stageOfWasteData} = useContext(HomeContext)
  return    <Card onClick={onClick} className="transition-all cursor-pointer hover:shadow-lg">
  <CardHeader>
    <CardTitle>Quantity of Food Waste vs. Stage of Waste</CardTitle>
    <CardDescription>Bar chart showing food waste quantity by stage</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer
      config={{
        quantity: {
          label: "Quantity",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={stageOfWasteData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--color-quantity)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  </CardContent>
</Card>
}
