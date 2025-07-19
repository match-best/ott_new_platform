"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/providers"
import { StreamplayNavbar } from "@/components/netflix-navbar"
import { StreamplayHero } from "@/components/netflix-hero"
import { StreamplayRow } from "@/components/netflix-row"
import { redirect } from "next/navigation"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const [content, setContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        setContent(data)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!isLoading && !user) {
      redirect("/login")
    }
  }, [user, isLoading])

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  const featuredContent = content[1] // Inception as hero
  const continueWatching = content.slice(2, 8)
  const recommendedMovies = content.filter((c) => c.type === "movie")
  const popularSeries = content.filter((c) => c.type === "series")

  return (
    <div className="min-h-screen bg-black">
      <StreamplayNavbar />

      {/* Hero Section */}
      {featuredContent && (
        <StreamplayHero
          title={featuredContent.title}
          description={featuredContent.description}
          backgroundImage={featuredContent.thumbnailUrl}
          videoId={featuredContent._id}
        />
      )}

      {/* Content Rows */}
      <div className="relative z-10 -mt-32 space-y-8 pb-20">
        <StreamplayRow title="Continue Watching" content={continueWatching} />
        <StreamplayRow title="Recommended for You" content={recommendedMovies} />
        <StreamplayRow title="Popular TV Shows" content={popularSeries} />
        <StreamplayRow title="Action Thrillers" content={content.filter((c) => c.genre.includes("Action"))} />
        <StreamplayRow title="Sci-Fi Movies" content={content.filter((c) => c.genre.includes("Sci-Fi"))} />
      </div>
    </div>
  )
}
