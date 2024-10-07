
import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client';
import { TableChart } from './_components/TableChart'
import { CustomPieChart } from './_components/CustomPieChart'
import { CustomLineChart1 } from './_components/CustomLineChart1'
import { CustomLineChart2 } from './_components/CustomLineChart2'
import { CustomCurveChart } from './_components/CostomCurveChart'
import { CustomCurveChart2 } from './_components/CostomCurveChart2'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export interface FoodWasteData {
  id: string;
  stallNumber: number;
  dateOfWaste: string;
  foodCategory: string;
  dishesWasted: string;
  quantity: number;
  cost: number;
  reasonForWaste: string;
  foodIngredients: string;
  temperatureFactor: string;
  mealType: string;
  stageOfWaste: string;
  wasteDistribution: string;
  preventable: string;
  disposalMethod: string;
  environmentalConditions: string;
  relevantEvent: string;
  additionalComments: string;
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

const foodWasteData: FoodWasteData[] = [
  { id: "24-0001", stallNumber: 1, dateOfWaste: "10-2-2024", foodCategory: "Rice, Vegetables", dishesWasted: "Adobo, Tinola", quantity: 1.5, cost: 150, reasonForWaste: "Spoilage, Over-preparation", foodIngredients: "Coconut Milk, Milk", temperatureFactor: "Hot", mealType: "Lunch", stageOfWaste: "Consumer Stage", wasteDistribution: "More on Consumer Side", preventable: "Yes", disposalMethod: "Thrown Away & Collected", environmentalConditions: "Power Outage", relevantEvent: "University Intramurals", additionalComments: "Food wasted due to heat" },
  { id: "24-0002", stallNumber: 2, dateOfWaste: "10-1-2024", foodCategory: "Meat, Seafood", dishesWasted: "Menudo, Paksiw", quantity: 2, cost: 250, reasonForWaste: "Expired, Contamination", foodIngredients: "Milk", temperatureFactor: "Cold", mealType: "Dinner", stageOfWaste: "Retail Stage", wasteDistribution: "50% Consumer & 50% Food Stalls", preventable: "No", disposalMethod: "Used for Animal Feed", environmentalConditions: "Refrigeration Issues", relevantEvent: "City Festival", additionalComments: "" },
  { id: "24-0003", stallNumber: 3, dateOfWaste: "9-30-2024", foodCategory: "Baked Goods, Drinks", dishesWasted: "None", quantity: 0.7, cost: 50, reasonForWaste: "Improper Storage, Spoilage", foodIngredients: "None", temperatureFactor: "Normal", mealType: "Merienda", stageOfWaste: "Consumer Stage", wasteDistribution: "More on Food Stalls Side", preventable: "Yes", disposalMethod: "Thrown Away & Collected", environmentalConditions: "None", relevantEvent: "Acquaintance Party", additionalComments: "Too much stock left unused" },
  { id: "24-0004", stallNumber: 4, dateOfWaste: "9-28-2024", foodCategory: "Fruits, Meat", dishesWasted: "Afritada, Caldereta", quantity: 3, cost: 300, reasonForWaste: "Spoilage", foodIngredients: "None", temperatureFactor: "Hot", mealType: "Lunch", stageOfWaste: "Retail Stage", wasteDistribution: "More on Food Stalls Side", preventable: "No", disposalMethod: "Composted", environmentalConditions: "Spoilage due to Weather", relevantEvent: "Foundation Day", additionalComments: "Leftovers from event" },
  { id: "24-0005", stallNumber: 5, dateOfWaste: "9-27-2024", foodCategory: "Rice, Vegetables", dishesWasted: "Pinakbet, Pakbet", quantity: 1.8, cost: 180, reasonForWaste: "Over-preparation, Spoilage", foodIngredients: "None", temperatureFactor: "Normal", mealType: "Lunch", stageOfWaste: "Consumer Stage", wasteDistribution: "More on Consumer Side", preventable: "Yes", disposalMethod: "Used for Animal Feed", environmentalConditions: "None", relevantEvent: "Charity Events", additionalComments: "Large batch prepared unnecessarily" },
  { id: "24-0006", stallNumber: 6, dateOfWaste: "9-25-2024", foodCategory: "Rice, Meat, Drinks", dishesWasted: "Bicol Express, Dinuguan", quantity: 2.5, cost: 275, reasonForWaste: "Over-preparation", foodIngredients: "Coconut Milk", temperatureFactor: "Cold", mealType: "Dinner", stageOfWaste: "Consumer Stage", wasteDistribution: "50% Consumer & 50% Food Stalls", preventable: "No", disposalMethod: "Thrown Away & Collected", environmentalConditions: "Refrigeration Issues", relevantEvent: "University Intramurals", additionalComments: "Cooling system failed" },
  { id: "24-0007", stallNumber: 7, dateOfWaste: "9-24-2024", foodCategory: "Meat, Processed Foods", dishesWasted: "Pork Steak, Sari-Sari", quantity: 1.2, cost: 100, reasonForWaste: "Spoilage", foodIngredients: "Milk", temperatureFactor: "Hot", mealType: "Dinner", stageOfWaste: "Retail Stage", wasteDistribution: "More on Food Stalls Side", preventable: "No", disposalMethod: "Thrown Away & Collected", environmentalConditions: "Spoilage due to Weather", relevantEvent: "Acquaintance Party", additionalComments: "Overestimated demand" },
  { id: "24-0008", stallNumber: 8, dateOfWaste: "9-23-2024", foodCategory: "Vegetables, Fruits, Meat", dishesWasted: "Afritada, Tinola", quantity: 2, cost: 200, reasonForWaste: "Contamination", foodIngredients: "None", temperatureFactor: "Normal", mealType: "Lunch", stageOfWaste: "Consumer Stage", wasteDistribution: "More on Consumer Side", preventable: "Yes", disposalMethod: "Composted", environmentalConditions: "None", relevantEvent: "City Festival", additionalComments: "Left exposed during event" },
  { id: "24-0009", stallNumber: 9, dateOfWaste: "9-22-2024", foodCategory: "Baked Goods, Drinks", dishesWasted: "None", quantity: 0.5, cost: 40, reasonForWaste: "Quality Issues, Over-preparation", foodIngredients: "None", temperatureFactor: "Hot", mealType: "Merienda", stageOfWaste: "Consumer Stage", wasteDistribution: "More on Consumer Side", preventable: "Yes", disposalMethod: "Used for Animal Feed", environmentalConditions: "None", relevantEvent: "University Intramurals", additionalComments: "Prepared too many pastries" },
  { id: "24-0010", stallNumber: 10, dateOfWaste: "9-21-2024", foodCategory: "Meat, Seafood, Processed Foods", dishesWasted: "Caldereta, Paksiw", quantity: 1.7, cost: 200, reasonForWaste: "Spoilage", foodIngredients: "None", temperatureFactor: "Cold", mealType: "Dinner", stageOfWaste: "Retail Stage", wasteDistribution: "50% Consumer & 50% Food Stalls", preventable: "No", disposalMethod: "Thrown Away & Collected", environmentalConditions: "Refrigeration Issues", relevantEvent: "Foundation Day", additionalComments: "Refrigerators failed overnight" },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C', '#D0ED57', '#FFA07A', '#20B2AA']

const preparePieChartData = (data: FoodWasteData[]): { name: string; value: number }[] => {
  const dishesWastedData = data.reduce((acc: { [key: string]: number }, curr) => {
    const dishes = curr.dishesWasted.split(', ')
    dishes.forEach(dish => {
      if (dish !== 'None') {
        acc[dish] = (acc[dish] || 0) + 1
      }
    })
    return acc
  }, {})
  return Object.entries(dishesWastedData).map(([name, value]) => ({ name, value }))
}

const prepareBarChartData = (data: FoodWasteData[], key: keyof FoodWasteData): { name: string; value: number }[] => {
  const groupedData = data.reduce((acc: { [key: string]: number }, curr) => {
    const categories = (curr[key] as string).split(', ')
    categories.forEach(category => {
      acc[category] = (acc[category] || 0) + curr.quantity
    })
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
    x: item.cost,
    y: item.quantity
  }))
}

type ChartType = 'table' | 'pie' | 'line1' | 'line2' | 'curve1' | 'curve2' | null;

export function HomeView() {
  const [selectedChart, setSelectedChart] = useState<ChartType>(null)

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_API_URL}`, {
      transports: ["websocket"]
    })

    socket.on('update-data', (data) => {
      console.log(data)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const pieChartData = preparePieChartData(foodWasteData)
  const foodCategoryData = prepareBarChartData(foodWasteData, 'foodCategory')
  const dishesWastedData = prepareBarChartData(foodWasteData, 'dishesWasted')
  const stageOfWasteData = prepareBarChartData(foodWasteData, 'stageOfWaste')
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
      case 'table':
        return <TableChart onClick={() => handleChartClick('table')} />
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
      factors.add(item.relevantEvent)
    })
    return Array.from(factors).filter(factor => factor !== 'None')
  }
  
  return (
    <HomeContext.Provider value={contextValue}>
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Food Waste Dashboard</h1>
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
        <div className="grid grid-cols-1 gap-2 space-x-8 space-y-8 lg:grid-cols-1">
          {renderChart('table')}
          {renderChart('pie')}
          {renderChart('line1')}
          {renderChart('line2')}
          {renderChart('curve1')}
          {renderChart('curve2')}
        </div>
      )}
    </div>
  </HomeContext.Provider>
  )
}