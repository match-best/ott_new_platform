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
  const [isContentLoaded, setIsContentLoaded] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      redirect("/login")
    }
  }, [user, isLoading])

  useEffect(() => {
    if (id) {
      setLoading(true)
      fetch(`/api/content/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setTimeout(() => {
            setContent(data)
            setIsContentLoaded(true)
            setLoading(false)
          }, 400)
        })
    }
  }, [id])

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/)
    return match ? match[1] : ""
  }

  if (isLoading || loading || !isContentLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl animate-pulse mx-auto mb-8 flex items-center justify-center shadow-2xl">
            <div className="w-10 h-10 bg-white rounded-xl opacity-90"></div>
          </div>
          <div className="text-white text-3xl font-bold mb-3 tracking-wide">Loading Video...</div>
          <div className="text-purple-300 text-lg mb-6">Please wait</div>
        </div>
      </div>
    )
  }

  if (!user || !content || content.error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Content not found</div>
      </div>
    )
  }

  const videoId = getYouTubeVideoId(content.youtubeUrl)

  return (
    <div className="min-h-screen bg-black page-transition">
      <StreamplayNavbar />
      <div className="section-fade">
        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        {/* Content Info - Wrapped in container */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto px-4 py-8 bg-gradient-to-b from-slate-900/80 to-black/80 rounded-2xl shadow-xl border border-slate-800">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-4 gradient-text">{content.title}</h1>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-green-400 font-semibold">98% Match</span>
              <Badge variant="outline" className="text-white border-gray-600 bg-slate-800/60">
                {new Date().getFullYear()}
              </Badge>
              <Badge variant="outline" className="text-white border-gray-600 uppercase bg-slate-800/60">
                {content.type}
              </Badge>
              <Badge variant="outline" className="text-white border-gray-600 bg-gradient-to-r from-amber-500 to-orange-500">
                HD
              </Badge>
            </div>
          </div>

          <p className="text-gray-300 text-lg mb-6 leading-relaxed max-w-3xl">
            {content.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {content.genre && Array.isArray(content.genre) && content.genre.map((g: string) => (
              <Badge key={g} variant="secondary" className="bg-slate-700/50 text-purple-300 border border-purple-500/30 hover:bg-purple-600/20 transition-colors duration-300">
                {g}
              </Badge>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg">
              <Play className="mr-2 h-5 w-5 fill-current" />
              Play
            </Button>
            <Button variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-900/30 bg-transparent">
              <Plus className="mr-2 h-4 w-4" />
              My List
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-slate-700 text-white hover:bg-slate-800 bg-transparent"
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-slate-700 text-white hover:bg-slate-800 bg-transparent"
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-slate-700 text-white hover:bg-slate-800 bg-transparent"
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
            <div className="bg-gradient-to-b from-slate-800/80 to-black/80 rounded-lg p-3 shadow-md border border-slate-700">
              <div className="text-xl font-bold text-white">{content.views.toLocaleString()}</div>
              <div className="text-gray-400 text-xs">Views</div>
            </div>
            <div className="bg-gradient-to-b from-slate-800/80 to-black/80 rounded-lg p-3 shadow-md border border-slate-700">
              <div className="text-xl font-bold text-white">{Math.floor(content.watchTime / 60)}</div>
              <div className="text-gray-400 text-xs">Minutes</div>
            </div>
            <div className="bg-gradient-to-b from-slate-800/80 to-black/80 rounded-lg p-3 shadow-md border border-slate-700">
              <div className="text-xl font-bold text-green-400">98%</div>
              <div className="text-gray-400 text-xs">Match</div>
            </div>
            <div className="bg-gradient-to-b from-slate-800/80 to-black/80 rounded-lg p-3 shadow-md border border-slate-700">
              <div className="text-xl font-bold text-amber-400">8.5</div>
              <div className="text-gray-400 text-xs">Rating</div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
