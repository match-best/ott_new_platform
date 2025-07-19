"use client"

import { StreamplayNavbar } from "@/components/netflix-navbar"
import { StreamplayHero } from "@/components/netflix-hero"
import { StreamplayRow } from "@/components/netflix-row"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Fuse from "fuse.js"
import { HeroCarousel } from "@/components/hero-carousel"

export default function HomePage() {
  const [content, setContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dbName, setDbName] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetch("/api/content").then(async (res) => {
      const data = await res.json()
      console.log("API DATA:", data)
      setContent(data)
      setLoading(false)
      const dbHeader = res.headers.get("x-db-used")
      if (dbHeader) setDbName(dbHeader)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  // Fuzzy search setup
  const fuse = new Fuse(content, {
    keys: ["title", "description"],
    threshold: 0.4, // typo-tolerant
  })
  const filteredContent = searchTerm
    ? fuse.search(searchTerm).map((result) => result.item)
    : content
  const featuredContentList = filteredContent.filter((c) => c.featured)
  const trendingNow = filteredContent.filter((c) => c.trending)
  const popularMovies = filteredContent.filter((c) => c.popular && c.type === "movie")
  const topSeries = filteredContent.filter((c) => c.topSeries && c.type === "series")

  return (
    <div className="min-h-screen bg-black">
      <StreamplayNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Hero Section */}
      {featuredContentList.length > 0 ? (
        <HeroCarousel items={featuredContentList} />
      ) : (
        <div className="text-white text-center py-8">No featured content available.</div>
      )}

      {/* Content Rows */}
      <div className="relative z-10 pt-8 space-y-8">
        {trendingNow.length > 0 && <StreamplayRow title="Trending Now" content={trendingNow} />}
        {popularMovies.length > 0 && <StreamplayRow title="Popular Movies" content={popularMovies} />}
        {topSeries.length > 0 && <StreamplayRow title="Top TV Shows" content={topSeries} />}
        <StreamplayRow title="Action Movies" content={filteredContent.filter((c) => c.genre.includes("Action"))} />
        <StreamplayRow
          title="Drama Series"
          content={filteredContent.filter((c) => c.genre.includes("Drama") && c.type === "series")}
        />
        {filteredContent.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No content found matching your search.</p>
          </div>
        )}
      </div>
      {/* Show DB name for debugging */}
      {dbName && (
        <div className="fixed bottom-2 right-2 bg-black/80 text-green-400 px-3 py-1 rounded text-xs z-50">
          Database: {dbName}
        </div>
      )}
    </div>
  )
}
