"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/components/providers"
import { StreamplayNavbar } from "@/components/netflix-navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Plus, ThumbsUp, ThumbsDown, Share } from "lucide-react"
import { redirect } from "next/navigation"

export default function WatchPage() {
  const { id } = useParams()
  const { user, isLoading } = useAuth()
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      redirect("/login")
    }
  }, [user, isLoading])

  useEffect(() => {
    if (id) {
      fetch(`/api/content/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setContent(data)
          setLoading(false)
        })
    }
  }, [id])

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/)
    return match ? match[1] : ""
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user || !content || content.error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Content not found</div>
      </div>
    )
  }

  const videoId = getYouTubeVideoId(content.youtubeUrl)

  return (
    <div className="min-h-screen bg-black">
      <StreamplayNavbar />

      <div className="pt-16">
        {/* Video Player */}
        <div className="relative aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Content Info */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl">
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">{content.title}</h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-semibold">98% Match</span>
                <Badge variant="outline" className="text-white border-gray-600">
                  {new Date().getFullYear()}
                </Badge>
                <Badge variant="outline" className="text-white border-gray-600 uppercase">
                  {content.type}
                </Badge>
                <Badge variant="outline" className="text-white border-gray-600">
                  HD
                </Badge>
              </div>
            </div>

            <p className="text-gray-300 text-lg mb-6 leading-relaxed max-w-3xl">{content.description}</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {content.genre.map((g: string) => (
                <Badge key={g} variant="secondary" className="bg-gray-800 text-white">
                  {g}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Button className="bg-white text-black hover:bg-gray-200 font-semibold">
                <Play className="mr-2 h-5 w-5 fill-current" />
                Play
              </Button>
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent">
                <Plus className="mr-2 h-4 w-4" />
                My List
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
              >
                <Share className="h-4 w-4" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{content.views.toLocaleString()}</div>
                <div className="text-gray-400 text-sm">Views</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{Math.floor(content.watchTime / 60)}</div>
                <div className="text-gray-400 text-sm">Minutes</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">98%</div>
                <div className="text-gray-400 text-sm">Match</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">8.5</div>
                <div className="text-gray-400 text-sm">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
