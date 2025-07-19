"use client"

import Image from "next/image"
import Link from "next/link"
import { Play, Plus, ThumbsUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

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

interface StreamplayCardProps {
  content: Content
}

export function StreamplayCard({ content }: StreamplayCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative min-w-[200px] md:min-w-[250px] group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image */}
      <div className="relative aspect-[16/9] rounded-md overflow-hidden">
        <Image
          src={content.thumbnailUrl || "/placeholder.svg"}
          alt={content.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link href={`/watch/${content._id}`}>
            <Button size="icon" className="bg-white text-black hover:bg-white/80">
              <Play className="h-5 w-5 fill-current" />
            </Button>
          </Link>
        </div>

        {/* Type Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant={content.type === "movie" ? "default" : "secondary"} className="text-xs">
            {content.type === "movie" ? "Movie" : "Series"}
          </Badge>
        </div>
      </div>

      {/* Expanded Info on Hover */}
      {isHovered && (
        <div className="absolute top-full left-0 right-0 bg-gray-900 rounded-b-md p-4 z-20 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex space-x-2">
              <Button size="sm" asChild>
                <Link href={`/watch/${content._id}`}>
                  <Play className="h-4 w-4 mr-1 fill-current" />
                </Link>
              </Button>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <h3 className="text-white font-semibold text-sm mb-1">{content.title}</h3>
          <p className="text-gray-400 text-xs mb-2 line-clamp-2">{content.description}</p>

          <div className="flex flex-wrap gap-1">
            {content.genre.slice(0, 3).map((g) => (
              <Badge key={g} variant="outline" className="text-xs">
                {g}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
