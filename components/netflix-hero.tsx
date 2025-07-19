"use client"

import { Button } from "@/components/ui/button"
import { Play, Info } from "lucide-react"
import Link from "next/link"

interface StreamplayHeroProps {
  title: string
  description: string
  backgroundImage: string
  videoId: string
}

export function StreamplayHero({ title, description, backgroundImage, videoId }: StreamplayHeroProps) {
  return (
    <div className="relative h-[80vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm scale-105 transition-all duration-700"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />
      {/* Stronger Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-transparent" />
      {/* Content */}
      <div className="relative z-10 container px-4 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl">{title}</h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed drop-shadow-lg">{description}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="bg-white text-black hover:bg-white/80 font-semibold">
            <Link href={`/watch/${videoId}`}>
              <Play className="mr-2 h-5 w-5 fill-current" />
              Play
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="bg-gray-500/70 text-white hover:bg-gray-500/50 font-semibold"
          >
            <Link href={`/watch/${videoId}`}>
              <Info className="mr-2 h-5 w-5" />
              More Info
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
