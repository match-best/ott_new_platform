import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Plus } from "lucide-react"
import type { Content } from "@/lib/models"

interface ContentCardProps {
  content: Content
}

export function ContentCard({ content }: ContentCardProps) {
  return (
    <div className="relative group w-full transition-transform duration-300 will-change-transform">
      <Card className="relative w-full bg-transparent border-0 shadow-none">
        {/* Thumbnail */}
        <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden card-hover transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:z-20">
          <Image
            src={content.thumbnailUrl || "/placeholder.svg"}
            alt={content.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Play Button - Visible on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity duration-300">
            <a 
              href={`/watch/${content._id}`}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-2 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-110 shadow-lg"
            >
              <Play className="h-5 w-5 fill-current" />
            </a>
          </div>
          {/* HD Badge */}
          <div className="absolute top-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-md">HD</div>
          {/* Bottom Gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/80 to-transparent"></div>
          {/* Duration */}
          <div className="absolute bottom-1 left-1 text-white text-[11px] font-medium">2h 15m</div>
        </div>
        
        {/* Card Content */}
        <div className="mt-2 px-0.5 w-full">
          {/* Title */}
          <h3 className="text-white text-[13px] font-semibold line-clamp-1">{content.title}</h3>
          
          {/* Description - Only show on hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <p className="text-[11px] text-gray-300 mt-0.5 line-clamp-2">
              {content.description}
            </p>
          </div>
          
          {/* Genres and Action Buttons - Only show on hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-[10px] text-gray-400">{content.genre && content.genre[0]}</span>
                {content.genre && content.genre.length > 1 && (
                  <>
                    <span className="mx-1 text-gray-600">•</span>
                    <span className="text-[10px] text-gray-400">{content.genre[1]}</span>
                  </>
                )}
              </div>
              <div className="flex space-x-1">
                <button className="text-white hover:text-purple-400 transition-colors">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <style jsx>{"\n        .animate-fadeInFast {\n          animation: fadeInFast 0.18s cubic-bezier(.4,2,.3,1) both;\n        }\n        @keyframes fadeInFast {\n          from { opacity: 0; transform: translateY(20px) scale(0.98); }\n          to { opacity: 1; transform: translateY(0) scale(1); }\n        }\n        \n        /* Responsive adjustments */\n        @media (min-width: 768px) {\n          .group:hover .card-content {\n            transform: translateY(-10px);\n          }\n        }\n      "}</style>
    </div>
  )
}
