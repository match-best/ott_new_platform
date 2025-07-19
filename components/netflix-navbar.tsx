"use client"

import Link from "next/link"
import { useAuth } from "@/components/providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogIn, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"
import { User } from "lucide-react"

export function StreamplayNavbar({ searchTerm, setSearchTerm }: { searchTerm?: string, setSearchTerm?: (v: string) => void }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [showSearch, setShowSearch] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showSearch])

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Movies", href: "/movies" },
    { label: "Shows", href: "/series" },
    { label: "Sports", href: "#" },
    { label: "Live TV", href: "#" },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 shadow-xl rounded-b-xl">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-primary to-pink-400 flex items-center justify-center">
              <span className="text-white text-2xl font-extrabold">S</span>
            </div>
            <span className="font-extrabold text-2xl text-white tracking-tight">StreamPlay</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6 ml-8">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-lg font-medium text-white/80 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link href="#" className="flex items-center text-lg font-medium text-primary ml-2">
              <span className="mr-1">&#x1F451;</span>Subscribe
            </Link>
          </div>
        </div>
        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-white hover:text-primary" onClick={() => setShowSearch((v) => !v)}>
            <Search className="h-5 w-5" />
          </Button>
          {showSearch && setSearchTerm && (
            <Input
              ref={inputRef}
              placeholder="Search movies, series..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white w-56 ml-2"
              style={{ transition: 'width 0.2s' }}
            />
          )}
          {!user && (
            <Button
              asChild
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 rounded-xl px-6 font-semibold"
            >
              <Link href="/login" className="flex items-center">
                <LogIn className="h-5 w-5 mr-2" />Login
              </Link>
            </Button>
          )}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-white hover:text-primary rounded-xl">
                  <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border-border rounded-xl shadow-xl">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="text-white">
                    Profile
                  </Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="text-white">
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logout} className="text-white">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  )
}
