"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Info, Star, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StreamplayCard } from "@/components/netflix-card"

interface Content {
  _id: string
  title: string
  description: string
  genre: string[]
  thumbnailUrl: string
  youtubeUrl: string
  type: "movie" | "series"
  views: number
}

interface StreamplayRowProps {
  title: string
  content: Content[]
  isHero?: boolean
}

export function StreamplayRow({ title, content, isHero = false }: StreamplayRowProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [heroIndex, setHeroIndex] = useState(0)

  // Auto-rotate hero content every 8 seconds
  useEffect(() => {
    if (isHero && content.length > 0) {
      const interval = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % Math.min(content.length, 5))
      }, 8000)
      return () => clearInterval(interval)
    }
  }, [isHero, content.length])

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById(`row-${title.replace(/\s+/g, "-")}`)
    if (container) {
      const scrollAmount = 300
      const newPosition =
        direction === "left" ? Math.max(0, scrollPosition - scrollAmount) : scrollPosition + scrollAmount

      container.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    }
  }

  if (!content || content.length === 0) return null

  // Hero Section Layout
  if (isHero) {
    const heroContent = content[heroIndex]
    const heroItems = content.slice(0, 5) // Show max 5 hero items

    return (
      <div className="relative mb-12">
        {/* Hero Background */}
        <div className="relative h-[70vh] min-h-[500px] overflow-hidden rounded-2xl mx-4">
          {/* Background Image with Gradient Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
            style={{ 
              backgroundImage: `url(${heroContent.thumbnailUrl})`,
              filter: 'brightness(0.4)'
            }}
          />
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-2xl ml-8 md:ml-16 text-white space-y-6">
              {/* Badge */}
              <div className="flex items-center space-x-3">
                <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded">
                  {heroContent.type.toUpperCase()}
                </span>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>Featured</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                {heroContent.title}
              </h1>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {heroContent.genre.slice(0, 3).map((genre, index) => (
                  <span 
                    key={index} 
                    className="bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full border border-white/30"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-lg text-gray-200 leading-relaxed max-w-xl line-clamp-3">
                {heroContent.description}
              </p>

              {/* Stats */}
              <div className="flex items-center space-x-6 text-sm text-gray-300">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{heroContent.views.toLocaleString()} views</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-3 text-lg"
                >
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Play Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-3 text-lg"
                >
                  <Info className="w-5 h-5 mr-2" />
                  More Info
                </Button>
              </div>
            </div>
          </div>

          {/* Hero Indicators */}
          <div className="absolute bottom-6 right-6 flex space-x-2">
            {heroItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setHeroIndex(index)}
                className={`w-2 h-8 rounded-full transition-all duration-300 ${
                  index === heroIndex 
                    ? 'bg-white' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Hero Thumbnail Row */}
        <div className="relative mt-8 px-4">
          <h3 className="text-white text-lg font-semibold mb-4">Featured Content</h3>
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
            {heroItems.map((item, index) => (
              <div 
                key={item._id}
                onClick={() => setHeroIndex(index)}
                className={`flex-shrink-0 cursor-pointer transition-all duration-300 ${
                  index === heroIndex 
                    ? 'ring-2 ring-white scale-105' 
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div className="relative w-32 h-20 rounded-lg overflow-hidden">
                  <img 
                    src={item.thumbnailUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-1 left-2 text-white text-xs font-medium truncate w-28">
                    {item.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Regular Row Layout (unchanged)
  return (
    <div className="relative group mb-8">
      <h2 className="text-white text-xl md:text-2xl font-semibold mb-4 px-4">{title}</h2>

      <div className="relative">
        {/* Left Arrow */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Content Row */}
        <div
          id={`row-${title.replace(/\s+/g, "-")}`}
          className="flex space-x-2 overflow-x-auto scrollbar-hide px-4 pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {content.map((item) => (
            <StreamplayCard key={item._id} content={item} />
          ))}
        </div>

        {/* Right Arrow */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}