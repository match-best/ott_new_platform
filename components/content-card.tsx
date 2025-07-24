import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Plus, Star } from "lucide-react"
import type { Content } from "@/lib/models"
import { cn } from "@/lib/utils"

interface ContentCardProps {
  content: Content
}

export function ContentCard({ content }: ContentCardProps) {
  return (
    <div className="relative group w-full transition-all duration-300 will-change-transform">
      <Card className="relative w-full bg-transparent border-0 shadow-none overflow-visible">
        {/* Thumbnail Container */}
        <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden bg-slate-800">
          <Image
            src={content.thumbnailUrl || "/placeholder.svg"}
            alt={content.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            loading="lazy"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play Button - Visible on hover/touch */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <a 
              href={`/watch/${content._id}`}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-3 md:p-4 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-110 shadow-2xl backdrop-blur-sm"
              aria-label={`Play ${content.title}`}
            >
              <Play className="h-5 w-5 md:h-6 md:w-6 fill-current" />
            </a>
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 right-2 flex items-start justify-between pointer-events-none">
            {/* Quality Badge */}
            <div className="bg-black/80 backdrop-blur-sm text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded shadow-md">
              {content.quality || "HD"}
            </div>
            
            {/* Rating */}
            {content.rating && (
              <div className="flex items-center gap-1 bg-black/80 backdrop-blur-sm px-1.5 md:px-2 py-0.5 md:py-1 rounded shadow-md">
                <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                <span className="text-white text-[10px] md:text-xs font-semibold">{content.rating}</span>
              </div>
            )}
          </div>
          
          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
            {/* Duration/Episodes */}
            <div className="text-white/90 text-[10px] md:text-xs font-medium">
              {content.type === 'movie' 
                ? (content.duration || '2h 15m')
                : `${content.episodes || 10} Episodes`}
            </div>
          </div>
          
          {/* Add to List Button - Mobile Friendly */}
          <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 md:hidden transition-opacity duration-300 bg-black/60 backdrop-blur-sm rounded-full p-1.5">
            <Plus className="h-4 w-4 text-white" />
          </button>
        </div>
        
        {/* Card Content */}
        <div className="mt-2 md:mt-3 px-0.5 w-full space-y-1">
          {/* Title */}
          <h3 className="text-white text-xs md:text-sm font-semibold line-clamp-1 group-hover:text-purple-300 transition-colors">
            {content.title}
          </h3>
          
          {/* Year and Genre - Always visible on mobile */}
          <div className="flex items-center gap-2 text-[10px] md:text-xs">
            {content.year && (
              <span className="text-gray-400">{content.year}</span>
            )}
            {content.genre && Array.isArray(content.genre) && content.genre[0] && (
              <>
                {content.year && <span className="text-gray-600">•</span>}
                <span className="text-gray-400">{content.genre[0]}</span>
              </>
            )}
          </div>
          
          {/* Description - Desktop only on hover */}
          <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-[11px] text-gray-300 line-clamp-2">
              {content.description}
            </p>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                {content.genre && Array.isArray(content.genre) && content.genre.slice(0, 2).map((g, i) => (
                  <span key={i} className="text-[10px] text-gray-400 bg-slate-800/50 px-2 py-0.5 rounded">
                    {g}
                  </span>
                ))}
              </div>
              <button className="text-white hover:text-purple-400 transition-colors p-1">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Mobile Touch Feedback */}
      <style jsx global>{`
        @media (hover: none) {
          .group:active .group-hover\\:opacity-100 {
            opacity: 1 !important;
          }
          .group:active .group-hover\\:scale-110 {
            transform: scale(1.1) !important;
          }
        }
      `}</style>
    </div>
  )
}
