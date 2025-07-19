"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/providers"
import { StreamplayNavbar } from "@/components/netflix-navbar"
import { StreamplayCard } from "@/components/netflix-card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { redirect } from "next/navigation"

export default function MoviesPage() {
  const { user, isLoading } = useAuth()
  const [movies, setMovies] = useState<any[]>([])
  const [filteredMovies, setFilteredMovies] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/content?type=movie")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data)
        setFilteredMovies(data)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!isLoading && !user) {
      redirect("/login")
    }
  }, [user, isLoading])

  useEffect(() => {
    let filtered = movies

    if (searchTerm) {
      filtered = filtered.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movie.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedGenres.length > 0) {
      filtered = filtered.filter((movie) => selectedGenres.some((genre) => movie.genre.includes(genre)))
    }

    setFilteredMovies(filtered)
  }, [movies, searchTerm, selectedGenres])

  const allGenres = Array.from(new Set(movies.flatMap((movie) => movie.genre)))

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
          <h1 className="text-white text-3xl font-bold mb-8">Movies</h1>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search movies..."
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

          {/* Movies Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredMovies.map((movie) => (
              <StreamplayCard key={movie._id} content={movie} />
            ))}
          </div>

          {filteredMovies.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No movies found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
