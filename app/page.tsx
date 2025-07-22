"use client"

import { StreamplayNavbar } from "@/components/netflix-navbar"
import { StreamplayHero } from "@/components/netflix-hero"
import { StreamplayRow } from "@/components/netflix-row"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, Home, Film, Tv, Trophy, Baby, Newspaper, Star, ChevronLeft, ChevronRight, Play, TrendingUp, Award } from "lucide-react"
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
  const [isContentLoaded, setIsContentLoaded] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/content")
        const data = await res.json()
        console.log("API DATA:", data)
        
        // Simulate a small delay for smooth loading
        setTimeout(() => {
          setContent(data)
          setIsContentLoaded(true)
          setLoading(false)
          const dbHeader = res.headers.get("x-db-used")
          if (dbHeader) setDbName(dbHeader)
        }, 500)
      } catch (error) {
        console.error("Error fetching content:", error)
        setLoading(false)
      }
    }
    
    fetchContent()
  }, [])

  if (loading || !isContentLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl animate-pulse mx-auto mb-8 flex items-center justify-center shadow-2xl">
            <div className="w-10 h-10 bg-white rounded-xl opacity-90"></div>
          </div>
          <div className="text-white text-3xl font-bold mb-3 tracking-wide">StreamPlay Binge</div>
          <div className="text-purple-300 text-lg mb-6">Loading premium content...</div>
          <div className="flex justify-center mt-6 space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
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
  const trendingNow = filteredContent.filter((c) => c.trending).slice(0, 10) // Limit to top 10
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black page-transition">
      {/* Premium Header */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/98 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between flex-nowrap py-4 min-w-0 overflow-hidden">
            {/* Logo Section */}
            <div className="flex items-center space-x-8 flex-shrink-0 min-w-0">
              <div className="flex items-center space-x-4 flex-shrink-0 min-w-0">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <div className="w-7 h-7 bg-white rounded-lg opacity-95"></div>
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold text-white tracking-tight whitespace-nowrap overflow-hidden text-ellipsis bg-gradient-to-r from-white to-purple-100 bg-clip-text">StreamPlay</h1>
                  <p className="text-sm text-purple-300 -mt-1 font-semibold whitespace-nowrap overflow-hidden text-ellipsis">Binge</p>
                </div>
              </div>
              
              {/* Premium Navigation */}
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
                    className={`flex items-center space-x-2 px-5 py-3 rounded-xl transition-all duration-300 ${
                      active 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/25' 
                        : 'text-gray-300 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-semibold">{label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center space-x-5 flex-shrink-0 min-w-0">
              <div className="relative hidden md:block">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search movies, shows & more..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-3.5 bg-slate-800/90 border border-slate-600/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64 transition-all placeholder-gray-400 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="pt-28 pb-8">
        {!searchTerm && featuredContentList.length > 0 && (
          <div className="relative mb-12 section-fade">
            <HeroCarousel items={featuredContentList} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
          </div>
        )}
        {!searchTerm && featuredContentList.length === 0 && (
          <div className="text-center py-20 bg-gradient-to-r from-slate-800/40 to-slate-900/40 rounded-3xl mx-6 mb-12 border border-slate-700/30 section-fade">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-white text-3xl font-bold mb-3">No Featured Content</h2>
            <p className="text-gray-400 text-lg">Check back soon for premium releases across all platforms</p>
          </div>
        )}
      </div>

      {/* Content Sections */}
      {searchTerm ? (
        filteredContent.length > 0 ? (
          <div className="max-w-7xl mx-auto px-6 section-fade">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 py-8">
              {filteredContent.map((item) => (
                <ContentCard key={item._id} content={item} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-24 text-gray-400 text-xl">No results found for "{searchTerm}"</div>
        )
      ) : (
        <div className="relative z-10 space-y-16 pb-20">
                    {trendingNow.length > 0 && (
            <div className="space-y-8 section-fade">
              <div className="flex items-center justify-between px-6 max-w-7xl mx-auto">
                <div className="flex items-center space-x-4">
                  <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
                  <div>
                    <h2 className="text-3xl font-bold text-white tracking-wide">Top 10 Trending Now</h2>
                    <p className="text-gray-400 text-sm mt-1">Most watched this week</p>
                  </div>
                </div>
              </div>
    <div className="relative max-w-7xl mx-auto">
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-2xl rounded-full p-4 transition-all duration-300 backdrop-blur-sm"
        onClick={() => scrollGrid('trending-grid', 'left')}
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
                      <div id="trending-grid" className="overflow-x-auto flex gap-6 px-16 pb-4 scrollbar-hide">
                  {trendingNow.map((item, index) => (
                    <div className="min-w-[240px] max-w-[260px] flex-shrink-0 relative" key={item._id}>
                      <ContentCard content={item} />
                      {/* Netflix-style ranking number */}
                      <div className="absolute -top-2 -left-2 z-20">
                        <div className="relative">
                          {/* Large number with stroke effect */}
                          <div className="text-8xl font-black text-red-600 leading-none select-none ranking-number">
                            {index + 1}
                          </div>
                          {/* TOP badge for top 3 */}
                          {index < 3 && (
                            <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                              TOP
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
      </div>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-2xl rounded-full p-4 transition-all duration-300 backdrop-blur-sm"
        onClick={() => scrollGrid('trending-grid', 'right')}
        aria-label="Scroll right"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  </div>
)}

          {popularMovies.length > 0 && (
            <div className="space-y-8 section-fade">
              <div className="flex items-center justify-between px-6 max-w-7xl mx-auto">
                <div className="flex items-center space-x-4">
                  <div className="w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
                  <h2 className="text-3xl font-bold text-white tracking-wide">Popular Movies</h2>
                </div>
                <button className="text-amber-400 hover:text-amber-300 font-semibold text-sm flex items-center transition-colors group">
                  View All
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="relative max-w-7xl mx-auto">
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-2xl rounded-full p-4 transition-all duration-300 backdrop-blur-sm"
                  onClick={() => scrollGrid('popular-grid', 'left')}
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div id="popular-grid" className="overflow-x-auto flex gap-6 px-16 pb-4 scrollbar-hide">
                  {popularMovies.map((item) => (
                    <div className="min-w-[240px] max-w-[260px] flex-shrink-0" key={item._id}>
                      <ContentCard content={item} />
                    </div>
                  ))}
                </div>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-2xl rounded-full p-4 transition-all duration-300 backdrop-blur-sm"
                  onClick={() => scrollGrid('popular-grid', 'right')}
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {topSeries.length > 0 && (
            <div className="space-y-8 section-fade">
              <div className="flex items-center justify-between px-6 max-w-7xl mx-auto">
                <div className="flex items-center space-x-4">
                  <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                  <h2 className="text-3xl font-bold text-white tracking-wide">Top TV Shows</h2>
                </div>
                <button className="text-emerald-400 hover:text-emerald-300 font-semibold text-sm flex items-center transition-colors group">
                  View All
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="relative max-w-7xl mx-auto">
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-2xl rounded-full p-4 transition-all duration-300 backdrop-blur-sm"
                  onClick={() => scrollGrid('topseries-grid', 'left')}
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div id="topseries-grid" className="overflow-x-auto flex gap-6 px-16 pb-4 scrollbar-hide">
                  {topSeries.map((item) => (
                    <div className="min-w-[240px] max-w-[260px] flex-shrink-0" key={item._id}>
                      <ContentCard content={item} />
                    </div>
                  ))}
                </div>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-2xl rounded-full p-4 transition-all duration-300 backdrop-blur-sm"
                  onClick={() => scrollGrid('topseries-grid', 'right')}
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {/* Action Movies */}
          <div className="space-y-8 section-fade">
            <div className="flex items-center justify-between px-6 max-w-7xl mx-auto">
              <div className="flex items-center space-x-4">
                <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
                <h2 className="text-3xl font-bold text-white tracking-wide">Action Movies</h2>
              </div>
              <button className="text-red-400 hover:text-red-300 font-semibold text-sm flex items-center transition-colors group">
                View All
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="relative max-w-7xl mx-auto">
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-2xl rounded-full p-4 transition-all duration-300 backdrop-blur-sm"
                onClick={() => scrollGrid('action-grid', 'left')}
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div id="action-grid" className="overflow-x-auto flex gap-6 px-16 pb-4 scrollbar-hide">
                {filteredContent.filter((c) => c.genre && Array.isArray(c.genre) && c.genre.includes("Action")).map((item) => (
                  <div className="min-w-[240px] max-w-[260px] flex-shrink-0" key={item._id}>
                    <ContentCard content={item} />
                  </div>
                ))}
              </div>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-2xl rounded-full p-4 transition-all duration-300 backdrop-blur-sm"
                onClick={() => scrollGrid('action-grid', 'right')}
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Drama Series */}
          <div className="space-y-8 section-fade">
            <div className="flex items-center justify-between px-6 max-w-7xl mx-auto">
              <div className="flex items-center space-x-4">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                <h2 className="text-3xl font-bold text-white tracking-wide">Drama Series</h2>
              </div>
              <button className="text-blue-400 hover:text-blue-300 font-semibold text-sm flex items-center transition-colors group">
                View All
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="relative max-w-7xl mx-auto">
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-2xl rounded-full p-4 transition-all duration-300 backdrop-blur-sm"
                onClick={() => scrollGrid('drama-grid', 'left')}
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div id="drama-grid" className="overflow-x-auto flex gap-6 px-16 pb-4 scrollbar-hide">
                {filteredContent.filter((c) => c.genre && Array.isArray(c.genre) && c.genre.includes("Drama") && c.type === "series").map((item) => (
                  <div className="min-w-[240px] max-w-[260px] flex-shrink-0" key={item._id}>
                    <ContentCard content={item} />
                  </div>
                ))}
              </div>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-2xl rounded-full p-4 transition-all duration-300 backdrop-blur-sm"
                onClick={() => scrollGrid('drama-grid', 'right')}
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Footer */}
      <footer className="bg-gradient-to-b from-slate-900 to-black border-t border-slate-800/50 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <div className="w-7 h-7 bg-white rounded-lg opacity-95"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">StreamPlay Binge</h1>
                  <p className="text-purple-300 text-sm font-medium">Premium streaming experience</p>
                </div>
              </div>
              <p className="text-gray-400 text-base leading-relaxed max-w-lg">
                Experience the best of entertainment with premium content from Netflix, Prime Video, Disney+ Hotstar, and more - all unified in one seamless platform.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Quick Links</h4>
              <div className="space-y-4 text-base text-gray-400">
                <p className="hover:text-purple-300 cursor-pointer transition-colors">Home</p>
                <p className="hover:text-purple-300 cursor-pointer transition-colors">Movies</p>
                <p className="hover:text-purple-300 cursor-pointer transition-colors">TV Shows</p>
                <p className="hover:text-purple-300 cursor-pointer transition-colors">Sports</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Support</h4>
              <div className="space-y-4 text-base text-gray-400">
                <p className="hover:text-purple-300 cursor-pointer transition-colors">Help Center</p>
                <p className="hover:text-purple-300 cursor-pointer transition-colors">Contact Us</p>
                <p className="hover:text-purple-300 cursor-pointer transition-colors">Privacy Policy</p>
                <p className="hover:text-purple-300 cursor-pointer transition-colors">Terms of Service</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-16 pt-10 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm">
              © 2025 StreamPlay Binge. All rights reserved.
            </p>
            <div className="flex items-center space-x-8 mt-6 md:mt-0">
              <div className="flex space-x-4 text-gray-400">
                {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                  <div key={social} className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-purple-600 cursor-pointer transition-all transform hover:scale-110">
                    <span className="text-sm font-bold">{social[0].toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}