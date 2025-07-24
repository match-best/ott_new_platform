"use client"

import { useEffect, useState } from "react"
import { StreamplayNavbar } from "@/components/netflix-navbar"
import { ContentCard } from "@/components/content-card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, Sparkles, Tv, Calendar, Star, ChevronDown, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function SeriesPage() {
  const [series, setSeries] = useState<any[]>([])
  const [filteredSeries, setFilteredSeries] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedRating, setSelectedRating] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<string>("popularity")

  useEffect(() => {
    fetch("/api/content?type=series")
      .then((res) => res.json())
      .then((data) => {
        setSeries(data || [])
        setFilteredSeries(data || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching series:", err)
        setSeries([])
        setFilteredSeries([])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let filtered = [...series]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (show) =>
          show.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          show.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          show.creator?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          show.cast?.some((actor: string) => actor.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Genre filter
    if (selectedGenres.length > 0) {
      filtered = filtered.filter((show) => 
        show.genre && Array.isArray(show.genre) && selectedGenres.some((genre) => show.genre.includes(genre))
      )
    }

    // Year filter
    if (selectedYear) {
      filtered = filtered.filter((show) => show.year === selectedYear)
    }

    // Rating filter
    if (selectedRating) {
      filtered = filtered.filter((show) => {
        const rating = parseFloat(show.rating || "0")
        const minRating = parseFloat(selectedRating)
        return rating >= minRating
      })
    }

    // Status filter (e.g., Ongoing, Completed)
    if (selectedStatus) {
      filtered = filtered.filter((show) => show.status === selectedStatus)
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (b.year || 0) - (a.year || 0)
        case "oldest":
          return (a.year || 0) - (b.year || 0)
        case "rating":
          return parseFloat(b.rating || "0") - parseFloat(a.rating || "0")
        case "title":
          return a.title.localeCompare(b.title)
        case "episodes":
          return (b.episodes || 0) - (a.episodes || 0)
        default: // popularity
          return (b.views || 0) - (a.views || 0)
      }
    })

    setFilteredSeries(filtered)
  }, [series, searchTerm, selectedGenres, selectedYear, selectedRating, selectedStatus, sortBy])

  const allGenres = Array.from(new Set(series.flatMap((show) => show.genre || [])))
  const allYears = Array.from(new Set(series.map((show) => show.year).filter(Boolean))).sort((a, b) => b - a)

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => 
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    )
  }

  const clearFilters = () => {
    setSelectedGenres([])
    setSelectedYear("")
    setSelectedRating("")
    setSelectedStatus("")
    setSortBy("popularity")
  }

  const activeFiltersCount = selectedGenres.length + (selectedYear ? 1 : 0) + (selectedRating ? 1 : 0) + (selectedStatus ? 1 : 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl animate-pulse mx-auto mb-8 flex items-center justify-center shadow-2xl">
            <Tv className="w-10 h-10 text-white animate-pulse" />
          </div>
          <div className="text-white text-3xl font-bold mb-3 tracking-wide">Loading TV Shows</div>
          <div className="text-purple-300 text-lg">Preparing your binge-watching list...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black">
      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">StreamPlay</h1>
                <p className="text-xs text-purple-300 -mt-1 font-semibold">BINGE</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {[
                { label: "Home", href: "/" },
                { label: "Movies", href: "/movies" },
                { label: "TV Shows", href: "/series", active: true },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "px-4 py-2.5 rounded-xl transition-all duration-300",
                    item.active
                      ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/30"
                      : "text-gray-300 hover:text-white hover:bg-slate-800/50"
                  )}
                >
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <div className="pt-20 md:pt-28 px-4 md:px-6 pb-16">
        <div className="container mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 flex items-center gap-3">
              <Tv className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
              TV Shows
            </h1>
            <p className="text-gray-400 text-lg">
              {filteredSeries.length} series ready to binge-watch
            </p>
          </div>

          {/* Search and Sort Bar */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search TV shows, actors, creators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-slate-800/50 border-slate-700/50 text-white rounded-xl focus:ring-2 focus:ring-purple-500 text-base placeholder:text-gray-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Filter & Sort Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "px-4 py-3 rounded-xl flex items-center gap-2 transition-all",
                    showFilters
                      ? "bg-purple-600 text-white"
                      : "bg-slate-800/50 text-gray-300 hover:text-white hover:bg-slate-700/50"
                  )}
                >
                  <Filter className="h-5 w-5" />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 pr-10 bg-slate-800/50 text-white rounded-xl appearance-none cursor-pointer hover:bg-slate-700/50 transition-colors"
                  >
                    <option value="popularity">Most Popular</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="rating">Highest Rated</option>
                    <option value="episodes">Most Episodes</option>
                    <option value="title">A-Z Title</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-slate-800/30 rounded-xl p-6 space-y-6 animate-fadeIn backdrop-blur-sm border border-slate-700/50">
                {/* Genres */}
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-purple-500 rounded-full"></span>
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {allGenres.map((genre) => (
                      <Badge
                        key={genre}
                        variant={selectedGenres.includes(genre) ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer transition-all hover:scale-105",
                          selectedGenres.includes(genre)
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 border-transparent"
                            : "border-slate-600 hover:border-purple-500"
                        )}
                        onClick={() => toggleGenre(genre)}
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Year, Rating, and Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Year Filter */}
                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-400" />
                      Release Year
                    </h3>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700/50 text-white rounded-lg border border-slate-600 focus:border-purple-500"
                    >
                      <option value="">All Years</option>
                      {allYears.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      Minimum Rating
                    </h3>
                    <select
                      value={selectedRating}
                      onChange={(e) => setSelectedRating(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700/50 text-white rounded-lg border border-slate-600 focus:border-purple-500"
                    >
                      <option value="">All Ratings</option>
                      <option value="9">9+ ⭐</option>
                      <option value="8">8+ ⭐</option>
                      <option value="7">7+ ⭐</option>
                      <option value="6">6+ ⭐</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      Status
                    </h3>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700/50 text-white rounded-lg border border-slate-600 focus:border-purple-500"
                    >
                      <option value="">All Status</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="upcoming">Upcoming</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-purple-400 hover:text-purple-300 font-medium text-sm transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Series Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {filteredSeries.map((show) => (
              <ContentCard key={show._id} content={show} />
            ))}
          </div>

          {/* No Results */}
          {filteredSeries.length === 0 && (
            <div className="text-center py-20">
              <Tv className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No TV shows found</p>
              <p className="text-gray-500 text-sm">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
