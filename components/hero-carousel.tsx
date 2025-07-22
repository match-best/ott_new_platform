import React, { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Plus, Info, Star, Clock } from "lucide-react"
import Link from "next/link"

interface HeroCarouselProps {
  items: any[]
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ items }) => {
  const [current, setCurrent] = useState(0)
  
  if (!items || items.length === 0) return null

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length)
    }, 8000) // Change slide every 8 seconds
    
    return () => clearInterval(timer)
  }, [items.length])

  const goTo = (idx: number) => {
    setCurrent((idx + items.length) % items.length)
  }

  const featured = items[current]

  return (
    <div className="relative w-full mx-auto aspect-[21/9] h-[450px] md:h-[550px] lg:h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 to-black">
      {/* Background Image with Enhanced Overlay */}
      <div className="absolute inset-0">
        <img
          src={featured.thumbnailUrl}
          alt={featured.title}
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-out"
        />
        {/* Multi-layer gradient overlay for premium look */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
      </div>
      
      {/* Content Container */}
      <div className="relative z-20 flex items-center justify-between h-full w-full max-w-7xl mx-auto px-6 lg:px-8">
        {/* Left Content */}
        <div className="flex-1 max-w-2xl space-y-6">
          {/* Platform Badge */}
          {featured.platform && (
            <div className="inline-flex items-center space-x-2 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-500/30">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-purple-300 text-sm font-semibold uppercase tracking-wide">
                {featured.platform}
              </span>
            </div>
          )}
          
          {/* Subtitle */}
          {featured.subtitle && (
            <div className="text-purple-300 text-lg font-semibold tracking-wide uppercase animate-fadeInUp">
              {featured.subtitle}
            </div>
          )}
          
          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight animate-fadeInUp gradient-text">
            {featured.title}
          </h1>
          
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-white/90 font-medium animate-fadeInUp">
            {featured.year && (
              <span className="text-lg">{featured.year}</span>
            )}
            {featured.ageRating && (
              <span className="bg-white/20 px-3 py-1 rounded-md text-sm font-bold">
                {featured.ageRating}
              </span>
            )}
            {featured.duration && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{featured.duration}</span>
              </div>
            )}
            {featured.rating && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-amber-400 fill-current" />
                <span className="text-sm">{featured.rating}</span>
              </div>
            )}
          </div>
          
          {/* Genres */}
          {featured.genre && Array.isArray(featured.genre) && featured.genre.length > 0 && (
            <div className="flex flex-wrap gap-2 animate-fadeInUp">
              {featured.genre.slice(0, 3).map((g: string, index: number) => (
                <span 
                  key={g} 
                  className="bg-slate-800/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm border border-slate-600/50"
                >
                  {g}
                </span>
              ))}
            </div>
          )}
          
          {/* Description */}
          {featured.description && (
            <p className="text-gray-300 text-lg leading-relaxed max-w-xl line-clamp-3 animate-fadeInUp">
              {featured.description}
            </p>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4 animate-fadeInUp">
            <Link href={`/watch/${featured._id}`}>
              <button className="btn-premium flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-2xl shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                <Play className="w-6 h-6 fill-current" />
                <span>Play Now</span>
              </button>
            </Link>
            
            <button className="btn-premium flex items-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-2xl text-lg border border-white/30 transition-all duration-300 transform hover:scale-105">
              <Plus className="w-6 h-6" />
              <span>My List</span>
            </button>
            
            <button className="btn-premium flex items-center gap-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white font-semibold px-6 py-4 rounded-2xl text-lg border border-white/20 transition-all duration-300 transform hover:scale-105">
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </button>
          </div>
        </div>
        
        {/* Right Platform Logo */}
        {featured.platformLogoUrl && (
          <div className="hidden lg:block">
            <img
              src={featured.platformLogoUrl}
              alt={featured.platform || "Platform"}
              className="w-20 h-20 object-contain rounded-2xl bg-white/10 backdrop-blur-sm p-2 shadow-2xl border border-white/20"
            />
          </div>
        )}
      </div>
      
      {/* Navigation Arrows */}
      <button
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white rounded-full p-4 z-30 transition-all duration-300 transform hover:scale-110 shadow-2xl border border-white/20"
        onClick={() => goTo(current - 1)}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      
      <button
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white rounded-full p-4 z-30 transition-all duration-300 transform hover:scale-110 shadow-2xl border border-white/20"
        onClick={() => goTo(current + 1)}
        aria-label="Next slide"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
      
      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {items.map((_, idx) => (
          <button
            key={idx}
            className={`relative h-1 rounded-full transition-all duration-500 ${
              idx === current ? "w-12 bg-gradient-to-r from-purple-500 to-pink-500" : "w-6 bg-white/40"
            }`}
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          >
            {idx === current && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </div>
      
      {/* Auto-play Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
          style={{
            width: `${((current + 1) / items.length) * 100}%`
          }}
        ></div>
      </div>
      
      {/* Slide Counter */}
      <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
        {current + 1} / {items.length}
      </div>
    </div>
  )
} 