import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useContext } from 'react'
import { HomeContext } from '../view';
interface CustomCurveChartProps {
    onClick: () => void;
  }

export const TableChart  : React.FC<CustomCurveChartProps> = ({ onClick }) => {
    const {foodWasteData} = useContext(HomeContext)
  return <Card onClick={onClick} className="mt-8 transition-all cursor-pointer hover:shadow-lg">
  <CardHeader>
    <CardTitle>Food Waste Data Table</CardTitle>
    <CardDescription>Detailed information about food waste incidents</CardDescription>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Stall Number</TableHead>
          <TableHead>Date of Waste</TableHead>
          <TableHead>Food Category</TableHead>
          <TableHead>Dishes Wasted</TableHead>
          <TableHead>Quantity (kg)</TableHead>
          <TableHead>Cost (₱)</TableHead>
          <TableHead>Reason for Waste</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {foodWasteData.map((row:any) => (
          <TableRow key={row.id}>
            <TableCell>{row.id}</TableCell>
            <TableCell>{row.stallNumber}</TableCell>
            <TableCell>{row.dateOfWaste}</TableCell>
            <TableCell>{row.foodCategory}</TableCell>
            <TableCell>{row.dishesWasted}</TableCell>
            <TableCell>{row.quantity}</TableCell>
            <TableCell>{row.cost}</TableCell>
            <TableCell>{row.reasonForWaste}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </CardContent>
</Card>
}
