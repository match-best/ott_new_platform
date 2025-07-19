"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"

interface User {
  email: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("streamplay-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (email: string, password: string) => {
    if (email === "user@example.com" && password === "Test@123") {
      const userData = { email, role: "user" as const }
      setUser(userData)
      localStorage.setItem("streamplay-user", JSON.stringify(userData))
      return true
    }
    if (email === "admin@example.com" && password === "Admin@123") {
      const userData = { email, role: "admin" as const }
      setUser(userData)
      localStorage.setItem("streamplay-user", JSON.stringify(userData))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("streamplay-user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  )
}
