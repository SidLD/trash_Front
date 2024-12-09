import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useContext } from 'react'
import { HomeContext } from '../view';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ResponsiveContainer,CartesianGrid, XAxis, YAxis, Scatter, ScatterChart } from 'recharts';

interface CustomCurveChartProps {
  onClick: () => void;
}

export const CustomCurveChart2  : React.FC<CustomCurveChartProps> = ({ onClick }) => {
    const {scatterChartData} = useContext(HomeContext)
  return     <Card onClick={onClick} className="transition-all cursor-pointer hover:shadow-lg">
  <CardHeader>
    <CardTitle>Quantity of Food Waste vs. Cost of Wasted Food</CardTitle>
    <CardDescription>Scatter plot showing relationship between quantity and cost</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer
      config={{
        scatter: {
          label: "Quantity vs Cost",
          color: "hsl(var(--chart-6))",
        },
      }}
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" name="Cost" unit="₱" />
          <YAxis dataKey="y" name="Quantity" unit="kg" />
          <ChartTooltip content={<ChartTooltipContent />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Quantity vs Cost" data={scatterChartData} fill="var(--color-scatter)" />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartContainer>
  </CardContent>
</Card>
}
