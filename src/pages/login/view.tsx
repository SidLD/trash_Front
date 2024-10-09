import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mountain } from 'lucide-react'
import { login } from '@/lib/api'
import { LoginType } from '@/lib/interface'
import { auth } from '@/lib/services'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'

export default function LoginView() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload:LoginType = {email, password}
      const {data} = await login(payload) as unknown as any
      toast({
        title: "Success",
        description: "Welcome",
      })
      if(data){
        auth.storeToken(data.token)
        setEmail('')
        setPassword('')
      }
    } catch (error:any) {
      console.log(error.response)
      toast({
        title: "Error",
        variant: "destructive",
        description: `${error.response.data.message}`,
      })
    }
    // navigate('/dashboard')
  }

  return (
    <div className="flex w-full">
      {/* Logo Section */}
      <div className="items-center justify-center hidden w-1/2 bg-gray-100 lg:flex">
        <div className="text-center">
          <Mountain className="w-32 h-32 mx-auto text-primary" />
          <h1 className="mt-4 text-4xl font-bold text-gray-900">Your Company</h1>
          <p className="mt-2 text-xl text-gray-600">Welcome back!</p>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="flex items-center justify-center w-full px-6 py-12 lg:w-1/2">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  type="email" 
                  placeholder="Enter your username" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Login</Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      <Toaster  />
    </div>
  )
}