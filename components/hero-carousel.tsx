import React, { useState } from "react"
import { ChevronLeft, ChevronRight, Play, Plus } from "lucide-react"
import Link from "next/link"

interface HeroCarouselProps {
  items: any[]
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ items }) => {
  const [current, setCurrent] = useState(0)
  if (!items || items.length === 0) return null

  const goTo = (idx: number) => {
    setCurrent((idx + items.length) % items.length)
  }

  const featured = items[current]

  return (
    <div className="relative w-full max-w-6xl mx-auto aspect-[16/6] h-[340px] md:h-[400px] flex items-center justify-center overflow-hidden rounded-2xl shadow-xl bg-black">
      {/* Background Image */}
      <img
        src={featured.thumbnailUrl}
        alt={featured.title}
        className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full w-full px-4 text-center">
        {/* OTT Provider Logo (top-right) */}
        {featured.platformLogoUrl && (
          <img
            src={featured.platformLogoUrl}
            alt={featured.platform || "Provider"}
            className="absolute right-4 top-4 w-14 h-14 object-contain rounded-md bg-white/80 p-1 shadow z-20"
          />
        )}
        {/* Subtitle (above title) */}
        {featured.subtitle && (
          <div className="text-white text-lg font-semibold tracking-wide mb-1 uppercase drop-shadow-lg">
            {featured.subtitle}
          </div>
        )}
        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-2 drop-shadow-lg tracking-wide">
          {featured.title}
        </h1>
        {/* Info line: Language, Genre, Age */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-6 text-base text-white/90 font-medium">
          {featured.language && <span>{featured.language}</span>}
          {featured.genre && featured.genre.length > 0 && <span>• {featured.genre.join(" • ")}</span>}
          {featured.ageRating && <span>• {featured.ageRating}</span>}
        </div>
        {/* Description removed as per screenshot */}
        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <Link href={`/watch/${featured._id}`} legacyBehavior>
            <a className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-3 rounded-full text-lg shadow-xl transition">
              <Play className="w-5 h-5" /> Play Now
            </a>
          </Link>
          <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 rounded-full text-lg shadow-xl transition">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
      {/* Left Arrow */}
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 z-30"
        onClick={() => goTo(current - 1)}
        aria-label="Previous"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>
      {/* Right Arrow */}
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 z-30"
        onClick={() => goTo(current + 1)}
        aria-label="Next"
      >
        <ChevronRight className="w-7 h-7" />
      </button>
      {/* Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-30">
        {items.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${idx === current ? "bg-pink-500" : "bg-white/40"}`}
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
} 