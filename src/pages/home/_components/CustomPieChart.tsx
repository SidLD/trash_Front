import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useContext } from 'react'
import { HomeContext } from '../view';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ResponsiveContainer, Pie, Cell, Legend, PieChart } from 'recharts';
interface CustomCurveChartProps {
  onClick: () => void;
}

export const CustomPieChart : React.FC<CustomCurveChartProps> = ({ onClick }) => {
    const {pieChartData, COLORS} = useContext(HomeContext)
  return  <Card onClick={onClick} className="transition-all cursor-pointer hover:shadow-lg">
  <CardHeader>
    <CardTitle>Dishes Wasted Distribution</CardTitle>
    <CardDescription>Pie chart showing the distribution of wasted dishes</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer
      config={{
        dishes: {
          label: "Dishes",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="flex items-center justify-center"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieChartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {pieChartData.map((_entry:any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  </CardContent>
</Card>
}
