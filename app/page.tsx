"use client"

import { StreamplayNavbar } from "@/components/netflix-navbar"
import { StreamplayHero } from "@/components/netflix-hero"
import { StreamplayRow } from "@/components/netflix-row"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, Home, Film, Tv, Trophy, Baby, Newspaper, Star, ChevronLeft, ChevronRight, Play, TrendingUp, Award, CheckCircle, LogIn } from "lucide-react"
import Fuse from "fuse.js"
import { HeroCarousel } from "@/components/hero-carousel"
import { PlatformRow } from "@/components/platform-row"
import Link from "next/link"
import { ContentCard } from "@/components/content-card"
import { TrendingBadge } from "@/components/trending-badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [content, setContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dbName, setDbName] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isContentLoaded, setIsContentLoaded] = useState(false)
  const [showLogin, setShowLogin] = useState(true)
  const [showSubscribe, setShowSubscribe] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [subscribed, setSubscribed] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [loginTab, setLoginTab] = useState<'login' | 'signup'>("login")

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/content")
        const data = await res.json()
        console.log("API DATA:", data)
        
        // Check if the response contains an error
        if (data.error) {
          console.error("API Error:", data.error)
          setContent([])
          setIsContentLoaded(true)
          setLoading(false)
          return
        }
        
        // Ensure data is an array
        const contentArray = Array.isArray(data) ? data : []
        
        // Simulate a small delay for smooth loading
        setTimeout(() => {
          setContent(contentArray)
          setIsContentLoaded(true)
          setLoading(false)
          const dbHeader = res.headers.get("x-db-used")
          if (dbHeader) setDbName(dbHeader)
        }, 500)
      } catch (error) {
        console.error("Error fetching content:", error)
        setContent([])
        setLoading(false)
      }
    }
    
    fetchContent()
  }, [])

  // Hide scroll and header when modal is open
  useEffect(() => {
    if (showLogin || showSubscribe) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showLogin, showSubscribe])

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

  // Ensure content is always an array
  const safeContent = Array.isArray(content) ? content : []
  
  // Fuzzy search setup
  const fuse = new Fuse(safeContent, {
    keys: ["title", "description", "scenes.name", "scenes.description"],
    threshold: 0.4, // typo-tolerant
  })
  const filteredContent = searchTerm
    ? fuse.search(searchTerm).map((result) => result.item)
    : safeContent
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
      {/* Fullscreen Login/Signup Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black/90 animate-fadeInUp">
          <div className="w-full max-w-md mx-auto rounded-2xl p-10 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-2xl relative animate-fadeInUp">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl" onClick={() => setShowLogin(false)}>&times;</button>
            <div className="flex justify-center mb-6">
              <LogIn className="w-10 h-10 text-purple-400" />
            </div>
            <div className="flex justify-center mb-6">
              <button className={`px-6 py-2 rounded-l-lg font-bold text-lg ${loginTab==='login' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-gray-400'}`} onClick={()=>setLoginTab('login')}>Login</button>
              <button className={`px-6 py-2 rounded-r-lg font-bold text-lg ${loginTab==='signup' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-gray-400'}`} onClick={()=>setLoginTab('signup')}>Sign Up</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); setShowLogin(false) }} className="space-y-5">
              <input type="email" required placeholder="Email" className="w-full px-5 py-4 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg" />
              <input type="password" required placeholder="Password" className="w-full px-5 py-4 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg" />
              {loginTab==='signup' && (
                <input type="text" required placeholder="Full Name" className="w-full px-5 py-4 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500 text-lg" />
              )}
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-lg shadow-lg">{loginTab==='login' ? 'Login' : 'Sign Up'}</Button>
              <div className="text-center text-gray-400 text-base">or</div>
              <Button type="button" className="w-full bg-slate-700 text-white font-bold py-4 rounded-lg hover:bg-slate-600 transition-all text-lg" onClick={() => setShowLogin(false)}>Continue as Guest</Button>
            </form>
          </div>
        </div>
      )}

      {/* Fullscreen Subscribe Modal */}
      {showSubscribe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black/90 animate-fadeInUp">
          <div className="w-full max-w-3xl mx-auto rounded-2xl p-10 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-2xl relative animate-fadeInUp">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl" onClick={() => setShowSubscribe(false)}>&times;</button>
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Choose Your Subscription</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Basic", price: "₹99/mo", features: ["SD Quality", "1 Device", "Watch on mobile only"], color: "from-gray-700 to-gray-900" },
                { name: "Standard", price: "₹199/mo", features: ["HD Quality", "2 Devices", "Watch on TV & Mobile"], color: "from-purple-600 to-pink-600" },
                { name: "Premium", price: "₹299/mo", features: ["Ultra HD", "4 Devices", "All device support", "Priority Support"], color: "from-yellow-400 to-pink-500" },
              ].map(plan => (
                <div key={plan.name} className={`relative rounded-2xl p-8 bg-gradient-to-br ${plan.color} border-4 transition-all cursor-pointer shadow-xl ${selectedPlan === plan.name ? "border-green-400 scale-105" : "border-transparent hover:scale-105"}`} onClick={() => setSelectedPlan(plan.name)}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold text-white">{plan.name}</div>
                    {selectedPlan === plan.name && <CheckCircle className="w-8 h-8 text-green-400 animate-bounce" />}
                  </div>
                  <div className="text-3xl font-extrabold text-white mb-4">{plan.price}</div>
                  <ul className="text-white/90 text-lg space-y-2 mb-4">
                    {plan.features.map(f => <li key={f} className="flex items-center gap-2">{selectedPlan === plan.name ? <CheckCircle className="w-5 h-5 text-green-400" /> : <span className="inline-block w-5" />} {f}</li>)}
                  </ul>
                  <Button className={`w-full mt-2 py-3 rounded-xl text-lg font-bold ${selectedPlan === plan.name ? 'bg-green-500' : 'bg-black/40 hover:bg-black/60 text-white'}`} onClick={() => { setShowPayment(true); setSelectedPlan(plan.name) }}>Subscribe</Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal (centered, not fullscreen) */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-md mx-auto rounded-2xl p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white mb-2">Payment</DialogTitle>
            <p className="text-gray-400 mb-4">Complete your payment for <span className="text-pink-400 font-semibold">{selectedPlan}</span> plan</p>
          </DialogHeader>
          <form onSubmit={e => { e.preventDefault(); setShowPayment(false); setShowSubscribe(false); setSubscribed(true); setShowSuccess(true); setTimeout(() => setShowSuccess(false), 2000) }} className="space-y-4">
            <input type="text" required placeholder="Card Number" className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <div className="flex gap-2">
              <input type="text" required placeholder="MM/YY" className="w-1/2 px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <input type="text" required placeholder="CVV" className="w-1/2 px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">Pay & Subscribe</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl text-lg font-bold animate-bounce">Subscription Successful!</div>
      )}

      {/* Premium Header */}
      {!(showLogin || showSubscribe) && (
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
              {/* Subscribe Button in Header */}
              {!subscribed && (
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-7 py-3 rounded-xl text-base shadow-xl shadow-purple-500/25 transition-all duration-300 transform hover:scale-105" onClick={() => setShowSubscribe(true)}>
                  Subscribe
                </Button>
              )}
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
      )}

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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 py-5">
              {filteredContent.map((item) => (
                <ContentCard key={item._id} content={item} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-24 text-gray-400 text-xl">No results found for "{searchTerm}"</div>
        )
      ) : (
        <div className="relative z-10 space-y-118 pb-16">
                    {trendingNow.length > 0 && (
            <div className="space-y-2 section-fade">
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
                      <div id="trending-grid" className="overflow-x-auto flex gap-3 px-10 pb-6 scrollbar-hide">
                  {trendingNow.map((item, index) => (
                    <div key={item._id} className="min-w-[200px] max-w-[220px] flex-shrink-0 relative group/trending">
                      <div className="relative z-0 transition-transform duration-300 group-hover/trending:scale-105">
                        <ContentCard content={item} />
                      </div>
                      <TrendingBadge number={index + 1} />
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
            <div className="space-y-2 section-fade">
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
                <div id="popular-grid" className="overflow-x-auto flex gap-4 px-10 pb-3 scrollbar-hide">
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
            <div className="space-y-2 section-fade">
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
                <div id="topseries-grid" className="overflow-x-auto flex gap-4 px-10 pb-3 scrollbar-hide">
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
          <div className="space-y-4 section-fade">
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
              <div id="action-grid" className="overflow-x-auto flex gap-4 px-10 pb-3 scrollbar-hide">
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
          <div className="space-y-4 section-fade">
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
              <div id="drama-grid" className="overflow-x-auto flex gap-4 px-10 pb-3 scrollbar-hide">
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
          </div> </div>
      </footer>
    </div>
  )
}