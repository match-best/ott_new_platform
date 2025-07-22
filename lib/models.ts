export interface Content {
  _id?: string
  title: string
  description: string
  genre: string[]
  thumbnailUrl: string
  youtubeUrl: string
  type: "movie" | "series"
  createdAt: Date
  updatedAt: Date
  views: number
  watchTime: number
  published: boolean
}

export interface User {
  _id?: string
  email: string
  watchlist: string[]
  recentlyWatched: string[]
  createdAt: Date
}

export interface Analytics {
  _id?: string
  contentId: string
  userId?: string
  action: "view" | "play" | "pause" | "complete"
  timestamp: Date
  watchTime?: number
}

export interface SupportPage {
  slug: string;
  title: string;
  content: string;
  updatedAt: Date;
}
