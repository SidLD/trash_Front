import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client';
import { CustomPieChart } from './_components/CustomPieChart'
import { CustomLineChart1 } from './_components/CustomLineChart1'
import { CustomLineChart2 } from './_components/CustomLineChart2'
import { CustomCurveChart } from './_components/CostomCurveChart'
import { CustomCurveChart2 } from './_components/CostomCurveChart2'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getStat } from '@/lib/api';

export interface FoodWasteData {
  _id: string;
  dateOfWaste: string;
  foodCategory: string[];
  dishesWasted: string[];
  quantity: number;
  cost: number;
  reasonForWaste: string[];
  notableIngredients: string[];
  temperature: string;
  mealType: string;
  wasteStage: string;
  preventable: string;
  disposalMethod: string;
  environmentalConditions: string;
  relevantEvents: string;
  additionalComments: string;
  status: string;
  userId: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface HomeContextType {
  foodWasteData: FoodWasteData[];
  pieChartData: { name: string; value: number }[];
  foodCategoryData: { name: string; value: number }[];
  dishesWastedData: { name: string; value: number }[];
  stageOfWasteData: { name: string; value: number }[];
  lineChartData: { date: string; quantity: number; cost: number }[];
  scatterChartData: { x: number; y: number }[];
  COLORS: string[];
}

export const HomeContext = createContext<HomeContextType>({
  foodWasteData: [],
  pieChartData: [],
  foodCategoryData: [],
  dishesWastedData: [],
  stageOfWasteData: [],
  lineChartData: [],
  scatterChartData: [],
  COLORS: [],
})

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C', '#D0ED57', '#FFA07A', '#20B2AA']

const preparePieChartData = (data: FoodWasteData[]): { name: string; value: number }[] => {
  const dishesWastedData = data.reduce((acc: { [key: string]: number }, curr) => {
    curr.dishesWasted.forEach(dish => {
      if (dish !== 'None') {
        acc[dish] = (acc[dish] || 0) + curr.quantity
      }
    })
    return acc
  }, {})
  return Object.entries(dishesWastedData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5) // Take top 5 dishes
}

const prepareBarChartData = (data: FoodWasteData[], key: 'foodCategory' | 'dishesWasted' | 'wasteStage'): { name: string; value: number }[] => {
  const groupedData = data.reduce((acc: { [key: string]: number }, curr) => {
    const categories = curr[key]
    if (Array.isArray(categories)) {
      categories.forEach(category => {
        acc[category] = (acc[category] || 0) + curr.cost
      })
    } else {
      acc[categories] = (acc[categories] || 0) + curr.cost
    }
    return acc
  }, {})
  return Object.entries(groupedData).map(([name, value]) => ({ name, value }))
}

const prepareLineChartData = (data: FoodWasteData[]): { date: string; quantity: number; cost: number }[] => {
  return data.map(item => ({
    date: item.dateOfWaste,
    quantity: item.quantity,
    cost: item.cost
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

const prepareScatterChartData = (data: FoodWasteData[]): { x: number; y: number }[] => {
  return data.map(item => ({
    x: item.quantity,
    y: item.cost
  }))
}

type ChartType = 'pie' | 'line1' | 'line2' | 'curve1' | 'curve2' | null;

export function HomeView() {
  const [selectedChart, setSelectedChart] = useState<ChartType>(null)
  const [foodWasteData, setFoodWasteData] = useState<FoodWasteData[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  
  useEffect(() => {
    const initData = async () => {
      try {
        const { data } = await getStat({}) as { data: { data: FoodWasteData[] } };
        setFoodWasteData(data.data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    }
    void initData();

    const newSocket = io(`${import.meta.env.VITE_API_URL}`, {
      transports: ["websocket"]
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('update-data', (newData: any) => {
        console.log("New data received:", newData);
        setFoodWasteData(prevData => [...prevData, JSON.parse(newData)]);
      });
    }
  }, [socket]);

  const pieChartData = preparePieChartData(foodWasteData)
  const foodCategoryData = prepareBarChartData(foodWasteData, 'foodCategory')
  const dishesWastedData = prepareBarChartData(foodWasteData, 'dishesWasted')
  const stageOfWasteData = prepareBarChartData(foodWasteData, 'wasteStage')
  const lineChartData = prepareLineChartData(foodWasteData)
  const scatterChartData = prepareScatterChartData(foodWasteData)

  const contextValue: HomeContextType = {
    foodWasteData,
    pieChartData,
    foodCategoryData,
    dishesWastedData,
    stageOfWasteData,
    lineChartData,
    scatterChartData,
    COLORS
  }

  const chartRef = useRef<HTMLDivElement>(null)
  const handleChartClick = useCallback((chartType: ChartType) => {
    setSelectedChart(chartType)
  }, [])

  const handleOutsideClick = useCallback((event: MouseEvent) => {
    if (chartRef.current && !chartRef.current.contains(event.target as Node)) {
      setSelectedChart(null)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [handleOutsideClick])

  const renderChart = (chartType: ChartType) => {
    switch (chartType) {
      case 'pie':
        return <CustomPieChart onClick={() => handleChartClick('pie')} />
      case 'line1':
        return <CustomLineChart1 onClick={() => handleChartClick('line1')} />
      case 'line2':
        return <CustomLineChart2 onClick={() => handleChartClick('line2')} />
      case 'curve1':
        return <CustomCurveChart onClick={() => handleChartClick('curve1')} />
      case 'curve2':
        return <CustomCurveChart2 onClick={() => handleChartClick('curve2')} />
      default:
        return null
    }
  }

  const getPossibleFactors = () => {
    const factors = new Set<string>()
    foodWasteData.forEach(item => {
      factors.add(item.relevantEvents)
    })
    return Array.from(factors).filter(factor => factor !== 'None')
  }
  
  return (
    <HomeContext.Provider value={contextValue}>
      <div className="container mx-auto">
        <h1 className="my-4 text-2xl font-bold">Food Waste Dashboard</h1>
        {selectedChart ? (
          <div ref={chartRef} className="space-y-8">
            <div >
              {renderChart(selectedChart)}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Possible Factors</CardTitle>
                <CardDescription>Factors contributing to food waste</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Factor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getPossibleFactors().map((factor, index) => (
                      <TableRow key={index}>
                        <TableCell>{factor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <div className='w-full h-fit'>
              {renderChart('pie')}
            </div>
            <div className='gap-2 lg:flex'>
              {renderChart('line1')}
              {renderChart('line2')}
            </div>
            <div className='gap-2 lg:flex'>
              {renderChart('curve1')}
              {renderChart('curve2')}
            </div>
          </div>
        )}
      </div>
    </HomeContext.Provider>
  )
}