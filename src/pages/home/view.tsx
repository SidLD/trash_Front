import  { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client';
import { CustomPieChart } from './_components/CustomPieChart'
import { CustomPieChart2 } from './_components/CustomPieChart2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getStat } from '@/lib/api';
import { Trash2, DollarSign, FileText } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, LineChart, Line, ScatterChart, Scatter } from 'recharts';

export interface FoodWasteData {
  _id: string;
  dateOfWaste: string;
  foodCategory: string[];
  dishesWasted: string[];
  quantity: number;
  cost: number;
  reasonForWaste: string[];
  notableIngredients: string[];
  temperature: 'hot' | 'normal' | 'cold' | "didn't notice";
  mealType: string;
  wasteStage: string;
  preventable: string;
  disposalMethod: string;
  environmentalConditions: string;
  relevantEvents: string;
  otherRelevantEvents: string;
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
  pieChartData2: { name: string; value: number }[];
  foodCategoryData: { name: string; value: number }[];
  dishesWastedData: { name: string; value: number }[];
  stageOfWasteData: { name: string; value: number }[];
  lineChartData: { date: string; quantity: number; cost: number }[];
  scatterChartData: { quantity: number; cost: number; temperature: string }[];
  COLORS: string[];
}

export const HomeContext = createContext<HomeContextType>({
  foodWasteData: [],
  pieChartData: [],
  pieChartData2: [],
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
}

const preparePieChartData2 = (data: FoodWasteData[]): { name: string; value: number }[] => {
  const dishesWastedData = data.reduce((acc: { [key: string]: number }, curr) => {
    curr.reasonForWaste.forEach(dish => {
      if (dish !== 'None') {
        acc[dish] = (acc[dish] || 0) + curr.quantity
      }
    })
    return acc
  }, {})
  return Object.entries(dishesWastedData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

const prepareBarChartData = (data: FoodWasteData[], key: 'foodCategory' | 'dishesWasted' | 'wasteStage'): { name: string; value: number }[] => {
  const groupedData = data.reduce((acc: { [key: string]: number }, curr) => {
    const categories = curr[key]
    if (Array.isArray(categories)) {
      categories.forEach(category => {
        acc[category] = (acc[category] || 0) + (key === 'dishesWasted' ? curr.cost : curr.quantity)
      })
    } else {
      acc[categories] = (acc[categories] || 0) + (key === 'dishesWasted' ? curr.cost : curr.quantity)
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

const prepareScatterChartData = (data: FoodWasteData[]): { quantity: number; cost: number; temperature: string }[] => {
  return data
    .filter(item => item.temperature !== "didn't notice")
    .map(item => ({
      quantity: item.quantity,
      cost: item.cost,
      temperature: item.temperature
    }))
}

type ChartType = 'pie1' | 'pie2'| 'bar1' | 'bar2' | 'bar3' | 'line1' | 'line2' | 'scatter1' | 'scatter2' | null;

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
  const pieChartData2 = preparePieChartData2(foodWasteData)
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
    pieChartData2,
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
    const commonProps = {
      width: 600,
      height: 300,
      margin: { top: 5, right: 30, left: 5, bottom: 5 },
    };

    switch (chartType) {
      case 'pie1':
        return <CustomPieChart onClick={() => handleChartClick('pie1')} />
      case 'pie2':
        return <CustomPieChart2 onClick={() => handleChartClick('pie2')} />
      case 'bar1':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={foodCategoryData} onClick={() => handleChartClick('bar1')}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" label={{ value: 'Food Category', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Quantity of Food Waste (kg)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Quantity (kg)" />
            </BarChart>
          </ResponsiveContainer>
        )
      case 'bar2':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={dishesWastedData} onClick={() => handleChartClick('bar2')}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" label={{ value: 'Dishes Wasted', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Cost of Wasted Food', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" name="Cost ($)" />
            </BarChart>
          </ResponsiveContainer>
        )
      case 'bar3':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={stageOfWasteData} onClick={() => handleChartClick('bar3')}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" label={{ value: 'Stage of Waste', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Quantity of Food Waste', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#ffc658" name="Quantity (kg)" />
            </BarChart>
          </ResponsiveContainer>
        )
      case 'line1':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={lineChartData} onClick={() => handleChartClick('line1')}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" label={{ value: 'Date of Waste', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Quantity of Food Waste (kg)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="quantity" stroke="#8884d8" name="Quantity (kg)" />
            </LineChart>
          </ResponsiveContainer>
        )
      case 'line2':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={lineChartData} onClick={() => handleChartClick('line2')}>
              <CartesianGrid strokeDasharray="3 3" className="w-full" />
              <XAxis 
                dataKey="date" 
                type="category" 
                label={{ value: 'Date of Waste', position: 'insideBottom', offset: -5 }} 
              />
              <YAxis 
                dataKey="cost" 
                type="number" 
                label={{ value: 'Cost of Wasted Food ($)', angle: -90, position: 'insideLeft', offset: -5 }} 
              />
              
              <Tooltip />
              <Legend />
              
              <Line 
                type="monotone" 
                dataKey="cost" 
                stroke="#82ca9d" 
                name="Cost ($)" 
              />
            </LineChart>
          </ResponsiveContainer>
        )
      case 'scatter1':
        return (
          <ResponsiveContainer {...commonProps}>
            <ScatterChart onClick={() => handleChartClick('scatter1')}>
              <CartesianGrid />
              <XAxis type="number" dataKey="cost" name="Cost ($)" label={{ value: 'Cost ($)', position: 'insideBottom', offset: -5 }} />
              <YAxis type="number" dataKey="quantity" name="Quantity (kg)" label={{ value: 'Quantity (kg)', angle: -90, position: 'insideLeft' }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Food Waste" data={scatterChartData} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        )
      case 'scatter2':
        return (
          <ResponsiveContainer {...commonProps}>
            <ScatterChart onClick={() => handleChartClick('scatter2')}>
              <CartesianGrid />
              <XAxis dataKey="cost" type="number" name="Cost ($)" label={{ value: 'Cost ($)', position: 'insideBottom', offset: -5 }} />
              <YAxis dataKey="temperature" type="category" name="Temperature" label={{ value: 'Temperature', angle: -90, position: 'insideLeft' }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Food Waste" data={scatterChartData} fill="#82ca9d" />
            </ScatterChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  const getPossibleFactors = (): string[] => {
    const factors = new Set<string>();
    foodWasteData.forEach(item => {
      if(item.relevantEvents === 'Other' && item.otherRelevantEvents != null){
        factors.add(item.otherRelevantEvents);
      }
      if (item.relevantEvents !== 'None' && item.relevantEvents != 'Other') {
        
        factors.add(item.relevantEvents);
      }
    });
    return Array.from(factors);
  };

  const totalWaste = foodWasteData.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = foodWasteData.reduce((sum, item) => sum + item.cost, 0);
  const recordCount = foodWasteData.length
  
  return (
    <HomeContext.Provider value={contextValue}>
      <div className="p-4 mx-auto">
        <h1 className="my-4 text-2xl font-bold">Food Waste Dashboard</h1>
        <div className="grid gap-4 mb-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Waste</CardTitle>
              <Trash2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWaste.toFixed(2)} kg</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recordCount}</div>
            </CardContent>
          </Card>
        </div>
        <div ref={chartRef} className="space-y-8">
          {selectedChart ? (
            <Card className="p-4">
              <CardHeader>
                <CardTitle>{getChartTitle(selectedChart)}</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <div style={{ minWidth: '500px' }}>
                  {renderChart(selectedChart)}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 ">
              {(['pie1', 'pie2', 'bar1', 'bar2', 'bar3', 'line1', 'line2', 'scatter1', 'scatter2'] as ChartType[]).map((chartType) => (
                <Card key={chartType} className="p-4">
                  <CardHeader>
                    <CardTitle>{getChartTitle(chartType)}</CardTitle>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <div style={{ minWidth: '500px' }}>
                      {renderChart(chartType)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {selectedChart && (
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
          )}
        </div>
      </div>
    </HomeContext.Provider>
  )
}

function getChartTitle(chartType: ChartType): string {
  switch (chartType) {
    case 'pie1':
      return 'Food Waste by Dish'
    case 'pie2':
      return 'Reasons for Food Waste'
    case 'bar1':
      return 'Quantity of Food Waste (kg) vs. Food Category'
    case 'bar2':
      return 'Cost of Wasted Food vs. Dishes Wasted'
    case 'bar3':
      return 'Quantity of Food Waste vs. Stage of Waste'
    case 'line1':
      return 'Date of Waste vs. Quantity of Food Waste (kg)'
    case 'line2':
      return 'Cost of Wasted Food vs. Date of Waste'
    case 'scatter1':
      return 'Cost of Wasted Food vs. Quantity of Food Waste'
    case 'scatter2':
      return 'Cost of Wasted Food vs. Temperature Factor'
    default:
      return 'Chart'
  }
}