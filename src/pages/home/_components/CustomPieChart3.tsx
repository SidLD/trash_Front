import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ResponsiveContainer, Pie, Cell, Legend, PieChart } from 'recharts';

interface CustomPieChartProps {
  onClick: () => void;
  data1: { name: string; value: number }[];
  data2?: { name: string; value: number }[];
  month1: string;
  month2?: string;
  colors: string[];
}

export const CustomPieChart3: React.FC<CustomPieChartProps> = ({ onClick, data1, data2, month1, month2, colors }) => {
  return (
    <Card onClick={onClick} className="transition-all cursor-pointer hover:shadow-lg w-full max-w-[700px]">
      <CardHeader>
        <CardTitle>Food Waste by Disposal Method</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            dishes1: {
              label: `Dishes (${month1})`,
              color: "hsl(var(--chart-1))",
            },
            dishes2: {
              label: month2 ? `Dishes (${month2})` : "",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="flex items-center justify-center h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data1}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={month2 ? 80 : 150}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data1.map((_entry: any, index: number) => (
                  <Cell key={`cell-1-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              {data2 && (
                <Pie
                  data={data2}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={90}
                  outerRadius={150}
                  fill="#82ca9d"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data2.map((_entry: any, index: number) => (
                    <Cell key={`cell-2-${index}`} fill={colors[(index + 5) % colors.length]} />
                  ))}
                </Pie>
              )}
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}