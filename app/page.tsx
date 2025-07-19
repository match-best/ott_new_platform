"use client"

import { StreamplayNavbar } from "@/components/netflix-navbar"
import { StreamplayHero } from "@/components/netflix-hero"
import { StreamplayRow } from "@/components/netflix-row"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, Home, Film, Tv, Trophy, Baby, Newspaper, Star, ChevronLeft, ChevronRight } from "lucide-react"
import Fuse from "fuse.js"
import { HeroCarousel } from "@/components/hero-carousel"
import { PlatformRow } from "@/components/platform-row"
import Link from "next/link"
import { ContentCard } from "@/components/content-card"

export default function HomePage() {
  const [content, setContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dbName, setDbName] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetch("/api/content").then(async (res) => {
      const data = await res.json()
      console.log("API DATA:", data)
      setContent(data)
      setLoading(false)
      const dbHeader = res.headers.get("x-db-used")
      if (dbHeader) setDbName(dbHeader)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl animate-pulse mx-auto mb-6 flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-lg opacity-80"></div>
          </div>
          <div className="text-white text-2xl font-bold mb-2">StreamPlay Binge</div>
          <div className="text-purple-300 text-sm">Loading content from all platforms...</div>
          <div className="flex justify-center mt-4 space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    )
  }

  // Fuzzy search setup
  const fuse = new Fuse(content, {
    keys: ["title", "description", "scenes.name", "scenes.description"],
    threshold: 0.4, // typo-tolerant
  })
  const filteredContent = searchTerm
    ? fuse.search(searchTerm).map((result) => result.item)
    : content
  const featuredContentList = filteredContent.filter((c) => c.featured)
  const trendingNow = filteredContent.filter((c) => c.trending)
  const popularMovies = filteredContent.filter((c) => c.popular && c.type === "movie")
  const topSeries = filteredContent.filter((c) => c.topSeries && c.type === "series")

  // Helper function for scrolling
  function scrollGrid(containerId: string, direction: 'left' | 'right') {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = 400;
      container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black">
      {/* TataPlay Binge Style Header */}
      <header className="fixed top-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between flex-nowrap py-3 min-w-0 overflow-hidden">
            {/* Logo Section */}
            <div className="flex items-center space-x-8 flex-shrink-0 min-w-0">
              <div className="flex items-center space-x-3 flex-shrink-0 min-w-0">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-xl flex items-center justify-center shadow-xl">
                  <div className="w-6 h-6 bg-white rounded-md opacity-90"></div>
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold text-white tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">StreamPlay</h1>
                  <p className="text-sm text-purple-300 -mt-1 font-medium whitespace-nowrap overflow-hidden text-ellipsis">Binge</p>
                </div>
              </div>
              
              {/* TataPlay style navigation tabs */}
              <nav className="hidden lg:flex items-center space-x-1 flex-shrink-0 min-w-0">
                {[
                  { icon: Home, label: "Home", href: "/", active: true },
                  { icon: Film, label: "Movies", href: "/movies" },
                  { icon: Tv, label: "TV Shows", href: "/series" },
                  { icon: Trophy, label: "Sports", href: "#" },
                  { icon: Baby, label: "Kids", href: "#" },
                  { icon: Newspaper, label: "News", href: "#" }
                ].map(({ icon: Icon, label, href, active }) => (
                  <Link
                    key={label}
                    href={href}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                      active 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                        : 'text-gray-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-semibold">{label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Search & Profile */}
            <div className="flex items-center space-x-4 flex-shrink-0 min-w-0">
              <div className="relative hidden md:block">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search across all platforms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-3 bg-slate-800/80 border border-slate-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-56 transition-all placeholder-gray-400"
                />
              </div>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full font-semibold text-sm transition-all transform hover:scale-105 shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Platform Filter Bar */}
      <div className="pt-24 pb-6">
        <div className="max-w-7xl mx-auto px-6">
          {/* <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2">
            {["All Platforms", "Netflix", "Prime Video", "Disney+ Hotstar", "SonyLIV", "ZEE5", "Voot", "MX Player"].map((platform, index) => (
              <button
                key={platform}
                className={`px-6 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  index === 0 
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105" 
                    : "bg-slate-800/80 text-gray-300 hover:bg-slate-700 hover:text-white border border-slate-600 hover:border-slate-500"
                }`}
              >
                {platform}
              </button>
            ))}
          </div> */}
        </div>
      </div>

      {/* Hero Section */}
      {!searchTerm && featuredContentList.length > 0 && (
        <div className="relative">
          <HeroCarousel items={featuredContentList} />
          {/* Enhanced hero overlay for TataPlay style */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
        </div>
      )}
      {!searchTerm && featuredContentList.length === 0 && (
        <div className="text-center py-16 bg-slate-800/30 rounded-2xl mx-6 mb-8">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-white text-2xl font-bold mb-2">No featured content available</h2>
          <p className="text-gray-400">Check back soon for new releases across platforms</p>
        </div>
      )}

      {/* Content Rows or Search Results */}
      {searchTerm ? (
        filteredContent.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 py-10">
            {filteredContent.map((item) => (
              <ContentCard key={item._id} content={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400 text-xl">No results found.</div>
        )
      ) : (
        <div className="relative z-10 space-y-12 pb-16">
          {trendingNow.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 px-6">
                <div className="text-3xl">🔥</div>
                <h2 className="text-3xl font-bold text-white">Trending Now</h2>
              </div>
              <div className="relative">
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white border-2 border-white/20 shadow-lg rounded-full p-3 transition-all duration-200 flex items-center justify-center"
                  onClick={() => scrollGrid('trending-grid', 'left')}
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <div id="trending-grid" className="overflow-x-auto flex gap-4 px-12 pb-2 scrollbar-hide">
                  {trendingNow.map((item) => (
                    <div className="min-w-[220px] max-w-[240px] flex-shrink-0" key={item._id}>
                      <ContentCard content={item} />
                    </div>
                  ))}
                </div>
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white border-2 border-white/20 shadow-lg rounded-full p-3 transition-all duration-200 flex items-center justify-center"
                  onClick={() => scrollGrid('trending-grid', 'right')}
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </div>
            </div>
          )}

          {popularMovies.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between px-6">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">🎬</div>
                  <h2 className="text-3xl font-bold text-white">Popular Movies</h2>
                </div>
                <button className="text-purple-400 hover:text-purple-300 font-semibold text-sm flex items-center transition-colors">
                  View All
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="relative">
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white border-2 border-white/20 shadow-lg rounded-full p-3 transition-all duration-200 flex items-center justify-center"
                  onClick={() => scrollGrid('popular-grid', 'left')}
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <div id="popular-grid" className="overflow-x-auto flex gap-4 px-12 pb-2 scrollbar-hide">
                  {popularMovies.map((item) => (
                    <div className="min-w-[220px] max-w-[240px] flex-shrink-0" key={item._id}>
                      <ContentCard content={item} />
                    </div>
                  ))}
                </div>
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white border-2 border-white/20 shadow-lg rounded-full p-3 transition-all duration-200 flex items-center justify-center"
                  onClick={() => scrollGrid('popular-grid', 'right')}
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </div>
            </div>
          )}

          {topSeries.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 px-6">
                <div className="text-3xl">📺</div>
                <h2 className="text-3xl font-bold text-white">Top TV Shows</h2>
              </div>
              <div className="relative">
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white border-2 border-white/20 shadow-lg rounded-full p-3 transition-all duration-200 flex items-center justify-center"
                  onClick={() => scrollGrid('topseries-grid', 'left')}
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <div id="topseries-grid" className="overflow-x-auto flex gap-4 px-12 pb-2 scrollbar-hide">
                  {topSeries.map((item) => (
                    <div className="min-w-[220px] max-w-[240px] flex-shrink-0" key={item._id}>
                      <ContentCard content={item} />
                    </div>
                  ))}
                </div>
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white border-2 border-white/20 shadow-lg rounded-full p-3 transition-all duration-200 flex items-center justify-center"
                  onClick={() => scrollGrid('topseries-grid', 'right')}
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </div>
            </div>
          )}

          {/* Action Movies */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 px-6">
              <div className="text-3xl">⚡</div>
              <h2 className="text-3xl font-bold text-white">Action Movies</h2>
            </div>
            <div className="relative">
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white border-2 border-white/20 shadow-lg rounded-full p-3 transition-all duration-200 flex items-center justify-center"
                onClick={() => scrollGrid('action-grid', 'left')}
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <div id="action-grid" className="overflow-x-auto flex gap-4 px-12 pb-2 scrollbar-hide">
                {filteredContent.filter((c) => c.genre.includes("Action")).map((item) => (
                  <div className="min-w-[220px] max-w-[240px] flex-shrink-0" key={item._id}>
                    <ContentCard content={item} />
                  </div>
                ))}
              </div>
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white border-2 border-white/20 shadow-lg rounded-full p-3 transition-all duration-200 flex items-center justify-center"
                onClick={() => scrollGrid('action-grid', 'right')}
                aria-label="Scroll right"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </div>
          </div>

          {/* Drama Series */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 px-6">
              <div className="text-3xl">🎭</div>
              <h2 className="text-3xl font-bold text-white">Drama Series</h2>
            </div>
            <div className="relative">
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white border-2 border-white/20 shadow-lg rounded-full p-3 transition-all duration-200 flex items-center justify-center"
                onClick={() => scrollGrid('drama-grid', 'left')}
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <div id="drama-grid" className="overflow-x-auto flex gap-4 px-12 pb-2 scrollbar-hide">
                {filteredContent.filter((c) => c.genre.includes("Drama") && c.type === "series").map((item) => (
                  <div className="min-w-[220px] max-w-[240px] flex-shrink-0" key={item._id}>
                    <ContentCard content={item} />
                  </div>
                ))}
              </div>
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white border-2 border-white/20 shadow-lg rounded-full p-3 transition-all duration-200 flex items-center justify-center"
                onClick={() => scrollGrid('drama-grid', 'right')}
                aria-label="Scroll right"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced DB Debug Info */}
      {dbName && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-slate-900/95 backdrop-blur-sm border border-purple-500/30 text-purple-300 px-4 py-3 rounded-xl shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-20"></div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Connected to</div>
                <div className="font-semibold">{dbName}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer - TataPlay Style */}
      <footer className="bg-gradient-to-b from-slate-900 to-black border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-md opacity-90"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">StreamPlay Binge</h1>
                  <p className="text-purple-300 text-sm">All your favorite platforms, one app</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                Access content from Netflix, Prime Video, Disney+ Hotstar, and more - all in one unified experience.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <div className="space-y-3 text-sm text-gray-400">
                <p className="hover:text-purple-300 cursor-pointer transition-colors">Home</p>
                <p className="hover:text-purple-300 cursor-pointer transition-colors">Movies</p>
                <p className="hover:text-purple-300 cursor-pointer transition-colors">TV Shows</p>
                <p className="hover:text-purple-300 cursor-pointer transition-colors">Sports</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <div className="space-y-3 text-sm text-gray-400">
                <p className="hover:text-purple-300 cursor-pointer transition-colors">Help Center</p>
                <p className="hover:text-purple-300 cursor-pointer transition-colors">Contact Us</p>
                <p className="hover:text-purple-300 cursor-pointer transition-colors">Privacy Policy</p>
                <p className="hover:text-purple-300 cursor-pointer transition-colors">Terms of Service</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm">
              © 2025 StreamPlay Binge. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex space-x-4 text-gray-400">
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-purple-600 cursor-pointer transition-all">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-purple-600 cursor-pointer transition-all">
                  <span className="text-xs">t</span>
                </div>
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-purple-600 cursor-pointer transition-all">
                  <span className="text-xs">in</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
