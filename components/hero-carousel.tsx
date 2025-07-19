import React, { useState } from "react"
import { ChevronLeft, ChevronRight, Play, Plus } from "lucide-react"

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
    <div className="relative w-full h-[420px] md:h-[520px] flex items-center justify-center overflow-hidden rounded-xl shadow-xl bg-black">
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
        {/* Platform Badge (optional) */}
        {featured.platform && (
          <div className="absolute left-4 top-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow">
            {featured.platform}
          </div>
        )}
        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-2 drop-shadow-lg tracking-wide">
          {featured.title}
        </h1>
        {/* Subtitle/Genre/Info */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-6 text-lg text-white/80 font-medium">
          {featured.language && <span>{featured.language}</span>}
          {featured.genre && featured.genre.length > 0 && <span>{featured.genre.join(" • ")}</span>}
          {featured.ageRating && <span>{featured.ageRating}</span>}
        </div>
        {/* Description */}
        <p className="max-w-2xl text-white/90 text-lg mb-8 line-clamp-3">
          {featured.description}
        </p>
        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <a
            href={featured.youtubeUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-3 rounded-full text-lg shadow-xl transition"
          >
            <Play className="w-5 h-5" /> Play Now
          </a>
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