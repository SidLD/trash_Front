import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Users, UserCheck, Clock, Popcorn, PhilippinePeso } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserType } from '@/lib/interface'
import { getStat, getUsers } from '@/lib/api'

interface FoodWasteData {
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
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C', '#D0ED57', '#FFA07A', '#20B2AA']

// Mock API functions (replace these with actual API calls)
const fetchFoodWasteData = async (): Promise<FoodWasteData[]> => {
  // Simulating API call
  return new Promise( async (resolve) => {
    const { data } = await getStat({}) as { data: { data: FoodWasteData[] } };
    resolve(data.data)
  });
};

const fetchUserData = async (): Promise<User[]> => {
  // Simulating API call
  return new Promise(async (resolve) =>  {
    const {data} = await getUsers({}) as unknown as any 
      resolve(data.map(
        (user: UserType, index: number )=> {
        return {
          key: index,
          ...user
        }
      }))
  });
};

export default function ComprehensiveDashboard() {
  const [foodWasteData, setFoodWasteData] = useState<FoodWasteData[]>([]);
  const [userData, setUserData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodWaste, users] = await Promise.all([
          fetchFoodWasteData(),
          fetchUserData()
        ]);
        setFoodWasteData(foodWaste);
        setUserData(users);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalWaste = foodWasteData.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = foodWasteData.reduce((sum, item) => sum + item.cost, 0);
  const recordCount = foodWasteData.length;

  const totalUsers = userData.length;
  const approvedUsers = userData.filter(user => user.status === 'APPROVED').length;
  const pendingUsers = userData.filter(user => user.status === 'PENDING').length;

  const foodCategoryData = foodWasteData.reduce((acc, item) => {
    item.foodCategory.forEach(category => {
      acc[category] = (acc[category] || 0) + item.quantity;
    });
    return acc;
  }, {} as Record<string, number>);

  const dishesWastedData = foodWasteData.reduce((acc, item) => {
    item.dishesWasted.forEach(dish => {
      acc[dish] = (acc[dish] || 0) + item.quantity;
    });
    return acc;
  }, {} as Record<string, number>);

  const topDishesWasted = Object.entries(dishesWastedData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const userRoleData = userData.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Comprehensive Dashboard</h1>
      
      <Tabs defaultValue="food-waste">
        <TabsList className="mb-4">
          <TabsTrigger value="food-waste">Food Waste</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="food-waste">
          <div className="grid gap-4 mb-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Waste</CardTitle>
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

          <div className="grid gap-4 mb-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Food Categories Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(foodCategoryData).map(([name, value]) => ({ name, value }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {Object.entries(foodCategoryData).map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Wasted Dishes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topDishesWasted}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Food Waste Records</CardTitle>
              <CardDescription>Latest food waste entries</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Dishes</TableHead>
                      <TableHead>Quantity (kg)</TableHead>
                      <TableHead>Cost ($)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {foodWasteData.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>{new Date(item.dateOfWaste).toLocaleDateString()}</TableCell>
                        <TableCell>{item.foodCategory.join(', ')}</TableCell>
                        <TableCell>{item.dishesWasted.join(', ')}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.cost}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <div className="grid gap-4 mb-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Approved Users</CardTitle>
                <UserCheck className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvedUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Pending Users</CardTitle>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingUsers}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 mb-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Roles Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(userRoleData).map(([name, value]) => ({ name, value }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {Object.entries(userRoleData).map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>List of the 5 most recently added users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userData.slice(0, 5).map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.firstName} {user.lastName}</TableCell>
                
                        <TableCell>{user.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Comprehensive list of all registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userData.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.firstName} {user.lastName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.status}</TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}