import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Eye } from "lucide-react"
import type { Content } from "@/lib/models"

interface ContentCardProps {
  content: Content
}

export function ContentCard({ content }: ContentCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={content.thumbnailUrl || "/placeholder.svg"}
          alt={content.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link href={`/watch/${content._id}`}>
            <div className="bg-primary rounded-full p-3 hover:bg-primary/80 transition-colors">
              <Play className="h-6 w-6 text-primary-foreground fill-current" />
            </div>
          </Link>
        </div>
        <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black/70 rounded px-2 py-1">
          <Eye className="h-3 w-3" />
          <span className="text-xs">{content.views}</span>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{content.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{content.description}</p>
        <div className="flex flex-wrap gap-1">
          {content.genre.map((g) => (
            <Badge key={g} variant="secondary" className="text-xs">
              {g}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
