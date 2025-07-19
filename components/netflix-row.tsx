"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
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
}

export function StreamplayRow({ title, content }: StreamplayRowProps) {
  const [scrollPosition, setScrollPosition] = useState(0)

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
