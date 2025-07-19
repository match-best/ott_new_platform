"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const success = login(email, password)

    if (success) {
      toast({
        title: "Welcome to StreamPlay!",
        description: "Login successful",
      })
      router.push("/dashboard")
    } else {
      toast({
        title: "Login failed",
        description: "Invalid credentials",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1489599162810-1e666c2c4c5b?w=1920&h=1080&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md p-8 bg-black/75 rounded-lg">
        <div className="text-center mb-8">
          <h1 className="text-red-600 text-3xl font-bold mb-2">STREAMPLAY</h1>
          <h2 className="text-white text-2xl font-semibold">Sign In</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white mt-1"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white mt-1"
              placeholder="Enter your password"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        {/* Test Credentials */}
        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
          <p className="text-white text-sm font-medium mb-2">Test Credentials:</p>
          <div className="space-y-1 text-xs text-gray-300">
            <p>User: user@example.com / Test@123</p>
            <p>Admin: admin@example.com / Admin@123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
