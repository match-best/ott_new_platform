"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/providers"
import { StreamplayNavbar } from "@/components/netflix-navbar"
import { StreamplayCard } from "@/components/netflix-card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { redirect } from "next/navigation"

export default function SeriesPage() {
  const { user, isLoading } = useAuth()
  const [series, setSeries] = useState<any[]>([])
  const [filteredSeries, setFilteredSeries] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/content?type=series")
      .then((res) => res.json())
      .then((data) => {
        setSeries(data)
        setFilteredSeries(data)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!isLoading && !user) {
      redirect("/login")
    }
  }, [user, isLoading])

  useEffect(() => {
    let filtered = series

    if (searchTerm) {
      filtered = filtered.filter(
        (show) =>
          show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          show.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedGenres.length > 0) {
      filtered = filtered.filter((show) => selectedGenres.some((genre) => show.genre.includes(genre)))
    }

    setFilteredSeries(filtered)
  }, [series, searchTerm, selectedGenres])

  const allGenres = Array.from(new Set(series.flatMap((show) => show.genre)))

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
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
          <h1 className="text-white text-3xl font-bold mb-8">TV Shows</h1>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search TV shows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {allGenres.map((genre) => (
                <Badge
                  key={genre}
                  variant={selectedGenres.includes(genre) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-red-600"
                  onClick={() => toggleGenre(genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          {/* Series Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredSeries.map((show) => (
              <StreamplayCard key={show._id} content={show} />
            ))}
          </div>

          {filteredSeries.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No TV shows found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
