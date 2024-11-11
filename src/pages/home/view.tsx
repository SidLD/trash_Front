"use client"

import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { CustomPieChart } from './_components/CustomPieChart'
import { CustomPieChart2 } from './_components/CustomPieChart2'
import { CustomCurveChart } from './_components/CustomCurveChart'
import { CustomBarChart } from './_components/CustomLineChart1'
import { CustomScatterChart } from './_components/CustomScatterChart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getStat } from '@/lib/api'
import { FileText, Popcorn, PhilippinePeso } from 'lucide-react'

export interface FoodWasteData {
  _id: string
  dateOfWaste: string
  foodCategory: string[]
  dishesWasted: string[]
  quantity: number
  cost: number
  reasonForWaste: string[]
  notableIngredients: string[]
  temperature: 'hot' | 'normal' | 'cold' | "didn't notice"
  mealType: string
  wasteStage: string
  preventable: string
  disposalMethod: string
  environmentalConditions: string
  relevantEvents: string
  otherRelevantEvents: string
  additionalComments: string
  status: string
  userId: {
    _id: string
    username: string
    firstName: string
    lastName: string
    email: string
    role: string
    status: string
  }
  createdAt: string
  updatedAt: string
}

interface HomeContextType {
  foodWasteData: FoodWasteData[]
  pieChartData: { name: string; value: number }[]
  pieChartData2: { name: string; value: number }[]
  foodCategoryData: { name: string; value: number }[]
  dishesWastedData: { name: string; value: number }[]
  stageOfWasteData: { name: string; value: number }[]
  lineChartData: { date: string; quantity: number; cost: number }[]
  scatterChartData: { quantity: number; cost: number; temperature: string }[]
  COLORS: string[]
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

const COLORS: string[] = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C', '#D0ED57', '#FFA07A', '#20B2AA']

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

const prepareDisposalMethodChartData = (data: FoodWasteData[]): { name: string; value: number }[] => {
  const disposalMethodData = data.reduce((acc: { [key: string]: number }, curr) => {
    acc[curr.disposalMethod] = (acc[curr.disposalMethod] || 0) + curr.quantity
    return acc
  }, {})
  return Object.entries(disposalMethodData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

function getMonthYear(date: string): string {
  const d = new Date(date)
  return `${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`
}

function getCurrentMonthYear(): string {
  const now = new Date()
  return `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`
}

function aggregateDataByMonth(data: FoodWasteData[]): Record<string, { totalWaste: number; totalCost: number }> {
  return data.reduce((acc, curr) => {
    const monthYear = getMonthYear(curr.dateOfWaste)
    if (!acc[monthYear]) {
      acc[monthYear] = { totalWaste: 0, totalCost: 0 }
    }
    acc[monthYear].totalWaste += curr.quantity
    acc[monthYear].totalCost += curr.cost
    return acc
  }, {} as Record<string, { totalWaste: number; totalCost: number }>)
}

type ChartType = 'all' | 'pie1' | 'pie2' | 'pie3' | 'bar1' | 'bar2' | 'bar3' | 'line1' | 'line2' | 'scatter1' | 'scatter2' | null

export function HomeView(): JSX.Element {
  const [selectedChart, setSelectedChart] = useState<ChartType>(null)
  const [foodWasteData, setFoodWasteData] = useState<FoodWasteData[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)
  const [selectedMonth1, setSelectedMonth1] = useState<string>(getCurrentMonthYear())
  const [selectedMonth2, setSelectedMonth2] = useState<string | undefined>(undefined)
  const [selectedCharts, setSelectedCharts] = useState<ChartType[]>(['pie1', 'pie2', 'pie3', 'bar1', 'bar2', 'bar3', 'line1', 'line2', 'scatter1', 'scatter2'])
  
  useEffect(() => {
    const initData = async () => {
      try {
        const { data } = await getStat({}) as { data: { data: FoodWasteData[] } }
        setFoodWasteData(data.data)
      } catch (error) {
        console.error("Error fetching initial data:", error)
      }
    }
    void initData()

    const newSocket = io(`${import.meta.env.VITE_API_URL}`, {
      transports: ["websocket"]
    })
    setSocket(newSocket)
    console.log(newSocket)
    return () => {
      newSocket.disconnect()
    }
  }, [])

  useEffect(() => {
    console.log("test", socket)
    if (socket) {
      socket.on('update-data', (newData: string) => {
        console.log("New data received:", newData)
        setFoodWasteData(prevData => [...prevData, JSON.parse(newData)])
      })
    }
  }, [socket])

  const filterDataByMonth = (data: FoodWasteData[], month: string | undefined): FoodWasteData[] => {
    if (!month || month === 'all') return data
    return data.filter(item => getMonthYear(item.dateOfWaste) === month)
  }

  const pieChartData = preparePieChartData(filterDataByMonth(foodWasteData, selectedMonth1))
  const pieChartData2 = preparePieChartData2(filterDataByMonth(foodWasteData, selectedMonth1))
  const foodCategoryData = prepareBarChartData(filterDataByMonth(foodWasteData, selectedMonth1), 'foodCategory')
  const dishesWastedData = prepareBarChartData(filterDataByMonth(foodWasteData, selectedMonth1), 'dishesWasted')
  const stageOfWasteData = prepareBarChartData(filterDataByMonth(foodWasteData, selectedMonth1), 'wasteStage')
  const lineChartData = prepareLineChartData(filterDataByMonth(foodWasteData, selectedMonth1))
  const scatterChartData = prepareScatterChartData(filterDataByMonth(foodWasteData, selectedMonth1))
  const disposalMethodData = prepareDisposalMethodChartData(filterDataByMonth(foodWasteData, selectedMonth1))

  const pieChartData_2 = preparePieChartData(filterDataByMonth(foodWasteData, selectedMonth2))
  const pieChartData2_2 = preparePieChartData2(filterDataByMonth(foodWasteData, selectedMonth2))
  const foodCategoryData_2 = prepareBarChartData(filterDataByMonth(foodWasteData, selectedMonth2), 'foodCategory')
  const dishesWastedData_2 = prepareBarChartData(filterDataByMonth(foodWasteData, selectedMonth2), 'dishesWasted')
  const stageOfWasteData_2 = prepareBarChartData(filterDataByMonth(foodWasteData, selectedMonth2), 'wasteStage')
  const lineChartData_2 = prepareLineChartData(filterDataByMonth(foodWasteData, selectedMonth2))
  const scatterChartData_2 = prepareScatterChartData(filterDataByMonth(foodWasteData, selectedMonth2))
  const disposalMethodData_2 = prepareDisposalMethodChartData(filterDataByMonth(foodWasteData, selectedMonth2))

  const monthlyData = aggregateDataByMonth(foodWasteData)
  const months = ['all', ...Object.keys(monthlyData).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())]

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

  const renderChart = (chartType: ChartType): JSX.Element | null => {
    switch (chartType) {
      case 'pie1':
        return (
          <CustomPieChart
            onClick={() => handleChartClick('pie1')}
            data1={pieChartData}
            data2={selectedMonth2 ? pieChartData_2 : undefined}
            month1={selectedMonth1}
            month2={selectedMonth2}
            colors={COLORS}
          />
        )
      case 'pie2':
        return (
          <CustomPieChart2
            onClick={() => handleChartClick('pie2')}
            data1={pieChartData2}
            data2={selectedMonth2 ? pieChartData2_2 : undefined}
            month1={selectedMonth1}
            month2={selectedMonth2}
            colors={COLORS}
          />
        )
      case 'pie3':
        return (
          <CustomPieChart
            onClick={() => handleChartClick('pie3')}
            data1={disposalMethodData}
            data2={selectedMonth2 ? disposalMethodData_2 : undefined}
            month1={selectedMonth1}
            month2={selectedMonth2}
            colors={COLORS}
          />
        )
      case 'bar1':
        return (
          <CustomBarChart
            onClick={() => handleChartClick('bar1')}
            data1={foodCategoryData}
            data2={selectedMonth2 ? foodCategoryData_2 : undefined}
            month1={selectedMonth1}
            month2={selectedMonth2}
            title="Quantity of Food Waste (kg) vs. Food Category"
            xAxisLabel="Food Category"
            yAxisLabel="Quantity of Food Waste (kg)"
          />
        )
      case 'bar2':
        return (
          <CustomBarChart
            onClick={() => handleChartClick('bar2')}
            data1={dishesWastedData}
            data2={selectedMonth2 ? dishesWastedData_2 : undefined}
            month1={selectedMonth1}
            month2={selectedMonth2}
            title="Cost of Wasted Food vs. Dishes Wasted"
            xAxisLabel="Dishes Wasted"
            yAxisLabel="Cost of Wasted Food (₱)"
          />
        )
      case 'bar3':
        return (
          <CustomBarChart
            onClick={() => handleChartClick('bar3')}
            data1={stageOfWasteData}
            data2={selectedMonth2 ? stageOfWasteData_2 : undefined}
            month1={selectedMonth1}
            month2={selectedMonth2}
            title="Quantity of Food Waste vs. Stage of Waste"
            xAxisLabel="Stage of Waste"
            yAxisLabel="Quantity of Food Waste (kg)"
          />
        )
      case 'line1':
        return (
          <CustomCurveChart
            onClick={() => handleChartClick('line1')}
            data1={lineChartData}
            data2={selectedMonth2 ? lineChartData_2 : undefined}
            month1={selectedMonth1}
            month2={selectedMonth2}
            title="Date of Waste vs. Quantity of Food Waste"
            xAxisLabel="Date"
            yAxisLabel="Quantity of Food Waste (kg)"
            dataKey="quantity"
          />
        )
      case 'line2':
        return (
          <CustomCurveChart
            onClick={() => handleChartClick('line2')}
            data1={lineChartData}
            data2={selectedMonth2 ? lineChartData_2 : undefined}
            month1={selectedMonth1}
            month2={selectedMonth2}
            title="Date of Waste vs. Cost of Wasted Food"
            xAxisLabel="Date"
            yAxisLabel="Cost of Wasted Food (₱)"
            dataKey="cost"
          />
        )
      case 'scatter1':
        return (
          <CustomScatterChart
            onClick={() => handleChartClick('scatter1')}
            data1={scatterChartData}
            data2={selectedMonth2 ? scatterChartData_2 : undefined}
            month1={selectedMonth1}
            month2={selectedMonth2}
            title="Cost of Wasted Food vs. Quantity of Food Waste"
            xAxisLabel="Cost (₱)"
            yAxisLabel="Quantity (kg)"
          />
        )
      case 'scatter2':
        return (
          <CustomScatterChart
            onClick={() => handleChartClick('scatter2')}
            data1={scatterChartData}
            data2={selectedMonth2 ? scatterChartData_2 : undefined}
            month1={selectedMonth1}
            month2={selectedMonth2}
            title="Cost of Wasted Food vs. Temperature Factor"
            xAxisLabel="Cost (₱)"
            yAxisLabel="Temperature"
          />
        )
      default:
        return null
    }
  }

  const getPossibleFactors = (): string[] => {
    const factors = new Set<string>()
    foodWasteData.forEach(item => {
      if(item.relevantEvents === 'Other' && item.otherRelevantEvents != null){
        factors.add(item.otherRelevantEvents)
      }
      if (item.relevantEvents !== 'None' && item.relevantEvents !== 'Other') {
        factors.add(item.relevantEvents)
      }
    })
    return Array.from(factors)
  }

  const totalWaste = foodWasteData.reduce((sum, item) => sum + item.quantity, 0)
  const totalCost = foodWasteData.reduce((sum, item) => sum + item.cost, 0)
  const recordCount = foodWasteData.length
  
  return (
    <HomeContext.Provider value={contextValue}>
      <div className="p-4 mx-auto">
        <h1 className="my-4 text-2xl font-bold">Food Waste Dashboard</h1>
        <div className="grid gap-4 mb-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
              {`Total Waste ${
                selectedMonth1 && selectedMonth2
                  ? `from ${selectedMonth1} to ${selectedMonth2}`
                  : selectedMonth1
                  ? `for ${selectedMonth1}`
                  : ``
              }`}
            </CardTitle>              
            <Popcorn className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWaste.toFixed(2)} kg</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              <PhilippinePeso className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₱{totalCost.toFixed(2)}</div>
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
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="month1">Select First Month</Label>
            <Select onValueChange={setSelectedMonth1} value={selectedMonth1}>
              <SelectTrigger id="month1">
                <SelectValue>{selectedMonth1 === 'all' ? 'All Months' : selectedMonth1}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month === 'all' ? 'All Months' : month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="month2">Select Second Month</Label>
            <Select onValueChange={(value) => setSelectedMonth2(value === 'all' ? undefined : value)} value={selectedMonth2 || 'all'}>
              <SelectTrigger id="month2">
                <SelectValue>{selectedMonth2 || 'All Months'}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month === 'all' ? 'All Months' : month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mb-4">
          <Label htmlFor="chartSelection">Select Charts to Display</Label>
          <Select
            onValueChange={(value) => {
              if (value === 'all') {
                setSelectedCharts(['pie1', 'pie2', 'pie3', 'bar1', 'bar2', 'bar3', 'line1', 'line2', 'scatter1', 'scatter2']);
              } else {
                const selectedValues = Array.isArray(value) ? value : [value];
                setSelectedCharts(selectedValues as ChartType[]);
              }
            }}
          >
            <SelectTrigger id="chartSelection">
              <SelectValue placeholder="Select charts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Charts</SelectItem>
              {(['pie1', 'pie2', 'pie3', 'bar1', 'bar2', 'bar3', 'line1', 'line2', 'scatter1', 'scatter2'] as const).map((chartType) => (
                <SelectItem key={chartType} value={chartType}>
                  {getChartTitle(chartType)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              {selectedCharts.map((chartType) => (
                <Card key={chartType} className="p-4">
                  <CardContent className="flex overflow-x-auto">
                    <div className="flex">
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
                <CardTitle>Events happened during this time</CardTitle>
                <CardDescription>These events might have played a role in contributing to Food Waste</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Events</TableHead>
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
    case 'all':
      return 'All Charts'
    case 'pie1':
      return 'Food Waste by Dish'
    case 'pie2':
      return 'Reasons for Food Waste'
    case 'pie3':
      return 'Food Waste by Disposal Method'
    case 'bar1':
      return 'Quantity of Food Waste (kg) vs. Food Category'
    case 'bar2':
      return 'Cost of Wasted Food vs. Dishes Wasted'
    case 'bar3':
      return 'Quantity of Food Waste vs. Stage of Waste'
    case 'line1':
      return 'Date of Waste vs. Quantity of Food Waste'
    case 'line2':
      return 'Date of Waste vs. Cost of Wasted Food'
    case 'scatter1':
      return 'Cost of Wasted Food vs. Quantity of Food Waste'
    case 'scatter2':
      return 'Cost of Wasted Food vs. Temperature Factor'
    default:
      return 'Chart'
  }
}