"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/providers"
import { StreamplayNavbar } from "@/components/netflix-navbar"
import { StreamplayCard } from "@/components/netflix-card"
import { Button } from "@/components/ui/button"
import { User, Heart, Clock, Settings } from "lucide-react"
import { redirect } from "next/navigation"

export default function ProfilePage() {
  const { user, logout, isLoading } = useAuth()
  const [content, setContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [watchlist, setWatchlist] = useState<any[]>([])
  const [recentlyWatched, setRecentlyWatched] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        setContent(data)
        setWatchlist(data.slice(0, 4))
        setRecentlyWatched(data.slice(2, 6))
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!isLoading && !user) {
      redirect("/login")
    }
  }, [user, isLoading])

  const handleLogout = () => {
    logout()
    redirect("/")
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-black">
      <StreamplayNavbar />

      <div className="pt-20 px-4">
        <div className="container mx-auto">
          {/* Profile Header */}
          <div className="flex items-center space-x-6 mb-12">
            <div className="h-24 w-24 rounded-full bg-red-600 flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold mb-2">{user.email}</h1>
              <p className="text-gray-400 capitalize">{user.role} Account</p>
              <div className="flex items-center space-x-4 mt-4">
                <Button variant="outline" className="border-gray-600 text-white bg-transparent">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" onClick={handleLogout} className="border-gray-600 text-white bg-transparent">
                  Sign Out
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{watchlist.length}</div>
              <div className="text-gray-400">My List</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{recentlyWatched.length}</div>
              <div className="text-gray-400">Recently Watched</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <User className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">Premium</div>
              <div className="text-gray-400">Membership</div>
            </div>
          </div>

          {/* My List */}
          <section className="mb-12">
            <h2 className="text-white text-2xl font-bold mb-6 flex items-center">
              <Heart className="mr-3 h-6 w-6 text-red-500" />
              My List
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {watchlist.map((content) => (
                <StreamplayCard key={content._id} content={content} />
              ))}
            </div>
          </section>

          {/* Recently Watched */}
          <section>
            <h2 className="text-white text-2xl font-bold mb-6 flex items-center">
              <Clock className="mr-3 h-6 w-6 text-blue-500" />
              Continue Watching
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {recentlyWatched.map((content) => (
                <StreamplayCard key={content._id} content={content} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
