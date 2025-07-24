"use client"

import { StreamplayNavbar } from "@/components/netflix-navbar"
import { StreamplayHero } from "@/components/netflix-hero"
import { StreamplayRow } from "@/components/netflix-row"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, Home, Film, Tv, Trophy, Baby, Newspaper, Star, ChevronLeft, ChevronRight, Play, TrendingUp, Award, CheckCircle, LogIn, Menu, X, User, Settings, LogOut, Crown, Sparkles } from "lucide-react"
import Fuse from "fuse.js"
import { HeroCarousel } from "@/components/hero-carousel"
import { PlatformRow } from "@/components/platform-row"
import Link from "next/link"
import { ContentCard } from "@/components/content-card"
import { TrendingBadge } from "@/components/trending-badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AIAvatar } from "@/components/ai-avatar"
import { cn } from "@/lib/utils"

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

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
            <Sparkles className="w-10 h-10 text-white animate-pulse" />
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
      const scrollAmount = window.innerWidth < 768 ? 250 : 400;
      container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black page-transition">
      {/* Fullscreen Login/Signup Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black/95 animate-fadeInUp px-4">
          <div className="w-full max-w-md mx-auto rounded-3xl p-8 md:p-10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl relative animate-fadeInUp">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition-colors p-2" 
              onClick={() => setShowLogin(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <LogIn className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex justify-center mb-6">
              <div className="bg-slate-800/50 rounded-xl p-1 flex">
                <button 
                  className={cn(
                    "px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300",
                    loginTab === 'login' 
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-white'
                  )}
                  onClick={() => setLoginTab('login')}
                >
                  Login
                </button>
                <button 
                  className={cn(
                    "px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300",
                    loginTab === 'signup' 
                      ? 'bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-white'
                  )}
                  onClick={() => setLoginTab('signup')}
                >
                  Sign Up
                </button>
              </div>
            </div>
            <form onSubmit={e => { e.preventDefault(); setShowLogin(false) }} className="space-y-4">
              <input 
                type="email" 
                required 
                placeholder="Email address" 
                className="w-full px-5 py-4 rounded-xl bg-slate-800/50 text-white border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base placeholder:text-gray-500 transition-all" 
              />
              <input 
                type="password" 
                required 
                placeholder="Password" 
                className="w-full px-5 py-4 rounded-xl bg-slate-800/50 text-white border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base placeholder:text-gray-500 transition-all" 
              />
              {loginTab === 'signup' && (
                <input 
                  type="text" 
                  required 
                  placeholder="Full Name" 
                  className="w-full px-5 py-4 rounded-xl bg-slate-800/50 text-white border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-base placeholder:text-gray-500 transition-all" 
                />
              )}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] duration-300"
              >
                {loginTab === 'login' ? 'Login' : 'Create Account'}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gradient-to-br from-slate-900/95 to-slate-800/95 text-gray-400">or</span>
                </div>
              </div>
              <Button 
                type="button" 
                className="w-full bg-slate-700/50 text-white font-semibold py-4 rounded-xl hover:bg-slate-600/50 transition-all text-base border border-slate-600/50 hover:border-slate-500/50" 
                onClick={() => setShowLogin(false)}
              >
                Continue as Guest
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Fullscreen Subscribe Modal */}
      {showSubscribe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black/95 animate-fadeInUp px-4 py-8 overflow-y-auto">
          <div className="w-full max-w-5xl mx-auto rounded-3xl p-6 md:p-10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl relative animate-fadeInUp">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition-colors p-2" 
              onClick={() => setShowSubscribe(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 text-center">Choose Your Plan</h2>
            <p className="text-gray-400 text-center mb-8">Unlimited entertainment, one low price</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  name: "Basic", 
                  price: "₹99", 
                  period: "/month",
                  features: ["SD Quality (480p)", "1 Device at a time", "Mobile & Tablet only", "Limited content library"], 
                  color: "from-slate-700 to-slate-900",
                  popular: false 
                },
                { 
                  name: "Standard", 
                  price: "₹199", 
                  period: "/month",
                  features: ["Full HD Quality (1080p)", "2 Devices at a time", "All devices supported", "Full content library", "Offline downloads"], 
                  color: "from-purple-600 to-pink-600",
                  popular: true 
                },
                { 
                  name: "Premium", 
                  price: "₹299", 
                  period: "/month",
                  features: ["4K + HDR Quality", "4 Devices at a time", "All devices supported", "Full content library", "Offline downloads", "Priority support"], 
                  color: "from-gradient-to-r from-amber-500 to-pink-600",
                  popular: false 
                },
              ].map((plan) => (
                <div 
                  key={plan.name} 
                  className={cn(
                    "relative rounded-2xl p-6 bg-gradient-to-br border-2 transition-all duration-300 cursor-pointer",
                    selectedPlan === plan.name 
                      ? "border-green-400 scale-105 shadow-2xl" 
                      : "border-transparent hover:scale-105 hover:border-purple-500/50",
                    plan.color
                  )}
                  onClick={() => setSelectedPlan(plan.name)}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                      <div className="flex items-baseline mt-2">
                        <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                        <span className="text-gray-300 ml-1">{plan.period}</span>
                      </div>
                    </div>
                    {selectedPlan === plan.name && (
                      <CheckCircle className="w-8 h-8 text-green-400 animate-bounce" />
                    )}
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-gray-200">
                        <CheckCircle className={cn(
                          "w-5 h-5 mt-0.5 flex-shrink-0",
                          selectedPlan === plan.name ? "text-green-400" : "text-gray-500"
                        )} />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={cn(
                      "w-full py-3 rounded-xl text-base font-semibold transition-all duration-300",
                      selectedPlan === plan.name 
                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg' 
                        : 'bg-black/20 hover:bg-black/30 text-white border border-white/20'
                    )}
                    onClick={(e) => { 
                      e.stopPropagation();
                      setSelectedPlan(plan.name);
                      setShowPayment(true);
                    }}
                  >
                    {selectedPlan === plan.name ? 'Continue' : 'Select Plan'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-md mx-auto rounded-3xl p-8 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white mb-2">Complete Payment</DialogTitle>
            <p className="text-gray-400 mb-4">Secure payment for <span className="text-purple-400 font-semibold">{selectedPlan}</span> plan</p>
          </DialogHeader>
          <form onSubmit={e => { 
            e.preventDefault(); 
            setShowPayment(false); 
            setShowSubscribe(false); 
            setSubscribed(true); 
            setShowSuccess(true); 
            setTimeout(() => setShowSuccess(false), 3000) 
          }} className="space-y-4">
            <input 
              type="text" 
              required 
              placeholder="Card Number" 
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 text-white border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500 transition-all" 
            />
            <div className="flex gap-3">
              <input 
                type="text" 
                required 
                placeholder="MM/YY" 
                className="w-1/2 px-4 py-3 rounded-xl bg-slate-800/50 text-white border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500 transition-all" 
              />
              <input 
                type="text" 
                required 
                placeholder="CVV" 
                className="w-1/2 px-4 py-3 rounded-xl bg-slate-800/50 text-white border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500 transition-all" 
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
            >
              Pay & Subscribe
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl text-base font-semibold animate-bounce flex items-center gap-3">
          <CheckCircle className="w-6 h-6" />
          Subscription Successful! Welcome to Premium
        </div>
      )}

      {/* Premium Header */}
      {!(showLogin || showSubscribe) && (
        <header className="fixed top-0 w-full z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between h-16 md:h-20">
              {/* Logo & Desktop Navigation */}
              <div className="flex items-center space-x-8">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">StreamPlay</h1>
                    <p className="text-xs text-purple-300 -mt-1 font-semibold">BINGE</p>
                  </div>
                </Link>
                
                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-1">
                  {[
                    { icon: Home, label: "Home", href: "/", active: true },
                    { icon: Film, label: "Movies", href: "/movies" },
                    { icon: Tv, label: "TV Shows", href: "/series" },
                    { icon: Trophy, label: "Sports", href: "#" },
                    { icon: Baby, label: "Kids", href: "#" },
                  ].map(({ icon: Icon, label, href, active }) => (
                    <Link
                      key={label}
                      href={href}
                      className={cn(
                        "flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300",
                        active 
                          ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/30' 
                          : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
                      )}
                    >
                      <Icon size={18} />
                      <span className="text-sm font-medium">{label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
              
              {/* Right Side Actions */}
              <div className="flex items-center space-x-3">
                {/* Desktop Search */}
                <div className="hidden md:block relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search movies, shows..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64 transition-all placeholder:text-gray-500 text-white"
                  />
                </div>
                
                {/* Mobile Search Button */}
                <button 
                  className="md:hidden p-2.5 rounded-xl bg-slate-800/50 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                  <Search className="w-5 h-5" />
                </button>
                
                {/* Subscribe/User Button */}
                {!subscribed ? (
                  <Button 
                    className="hidden sm:flex bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
                    onClick={() => setShowSubscribe(true)}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Subscribe
                  </Button>
                ) : (
                  <div className="relative">
                    <button 
                      className="flex items-center space-x-2 p-2 md:px-4 md:py-2 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 hover:border-purple-400/50 transition-all"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="hidden md:block text-white text-sm font-medium">Premium</span>
                    </button>
                    
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl py-2">
                        <Link href="/profile" className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-700/50 transition-colors">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-white text-sm">My Profile</span>
                        </Link>
                        <Link href="/settings" className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-700/50 transition-colors">
                          <Settings className="w-4 h-4 text-gray-400" />
                          <span className="text-white text-sm">Settings</span>
                        </Link>
                        <hr className="my-2 border-slate-700/50" />
                        <button className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-700/50 transition-colors w-full text-left">
                          <LogOut className="w-4 h-4 text-gray-400" />
                          <span className="text-white text-sm">Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Mobile Menu Button */}
                <button 
                  className="lg:hidden p-2.5 rounded-xl bg-slate-800/50 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {/* Mobile Search Bar */}
            {isSearchOpen && (
              <div className="md:hidden pb-4 animate-fadeIn">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search movies, shows..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-gray-500 text-white"
                  />
                </div>
              </div>
            )}
            
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="lg:hidden absolute top-full left-0 w-full bg-slate-900/98 backdrop-blur-xl border-b border-slate-800/50 animate-fadeIn z-50 shadow-2xl">
                <nav className="py-3 px-3 space-y-1 max-h-[80vh] overflow-y-auto">
                  {[
                    { icon: Home, label: "Home", href: "/", active: true },
                    { icon: Film, label: "Movies", href: "/movies" },
                    { icon: Tv, label: "TV Shows", href: "/series" },
                    { icon: Trophy, label: "Sports", href: "#" },
                    { icon: Baby, label: "Kids", href: "#" },
                  ].map(({ icon: Icon, label, href, active }) => (
                    <Link
                      key={label}
                      href={href}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all min-h-[48px] text-base",
                        active 
                          ? 'bg-gradient-to-r from-purple-600/25 to-pink-600/25 text-white border border-purple-500/30' 
                          : 'text-gray-300 hover:text-white hover:bg-slate-800/60 active:bg-slate-700/60'
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{label}</span>
                    </Link>
                  ))}
                  {!subscribed && (
                    <button 
                      className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-3.5 rounded-xl text-base shadow-lg flex items-center justify-center min-h-[48px] active:scale-95 transition-transform"
                      onClick={() => {
                        setShowSubscribe(true);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Crown className="w-5 h-5 mr-2" />
                      Subscribe Now
                    </button>
                  )}
                </nav>
              </div>
            )}
          </div>
        </header>
      )}

      {/* Hero Section */}
      <div className="pt-20 md:pt-24 pb-4 md:pb-6">
        {!searchTerm && featuredContentList.length > 0 && (
          <div className="relative mb-4 md:mb-6 section-fade">
            <HeroCarousel items={featuredContentList} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
          </div>
        )}
        {!searchTerm && featuredContentList.length === 0 && (
          <div className="text-center py-8 md:py-16 bg-gradient-to-r from-slate-800/40 to-slate-900/40 rounded-3xl mx-4 md:mx-6 mb-4 md:mb-6 border border-slate-700/30 section-fade">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-3">No Featured Content</h2>
            <p className="text-gray-400 text-base md:text-lg px-4">Check back soon for premium releases</p>
          </div>
        )}
      </div>

       {/* Content Sections */}
       {searchTerm ? (
        filteredContent.length > 0 ? (
          <div className="max-w-7xl mx-auto px-4 md:px-6 section-fade">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 md:gap-3 py-4 md:py-6">
              {filteredContent.map((item) => (
                <ContentCard key={item._id} content={item} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 md:py-24 text-gray-400 text-lg md:text-xl px-4">No results found for "{searchTerm}"</div>
        )
      ) : (
        <div className="relative z-10 space-y-4 md:space-y-6 pb-8">
                    {trendingNow.length > 0 && (
            <div className="space-y-4 md:space-y-6 section-fade">
              <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 max-w-7xl mx-auto">
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                  <div className="w-0.5 sm:w-1 h-5 sm:h-6 md:h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
                  <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wide leading-tight">Top 10 Trending Now</h2>
                    <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1">Most watched this week</p>
                  </div>
                </div>
              </div>
    <div className="relative max-w-7xl mx-auto">
      <button
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-2xl rounded-full p-2 md:p-4 transition-all duration-300 backdrop-blur-sm"
        onClick={() => scrollGrid('trending-grid', 'left')}
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
      </button>
                      <div id="trending-grid" className="overflow-x-auto flex gap-2 md:gap-3 px-8 md:px-10 pb-4 md:pb-6 scrollbar-hide">
                  {trendingNow.map((item, index) => (
                    <div key={item._id} className="min-w-[140px] sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px] max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] flex-shrink-0 relative group/trending">
                      <div className="relative z-0 transition-transform duration-300 group-hover/trending:scale-105">
                        <ContentCard content={item} />
                      </div>
                      <TrendingBadge number={index + 1} />
                    </div>
                  ))}
      </div>
      <button
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-2xl rounded-full p-2 md:p-4 transition-all duration-300 backdrop-blur-sm"
        onClick={() => scrollGrid('trending-grid', 'right')}
        aria-label="Scroll right"
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
      </button>
    </div>
  </div>
)}

          {popularMovies.length > 0 && (
            <div className="space-y-4 md:space-y-6 section-fade">
              <div className="flex items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-1 h-6 md:h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wide">Popular Movies</h2>
                </div>
                <button className="text-amber-400 hover:text-amber-300 font-semibold text-xs md:text-sm flex items-center transition-colors group">
                  View All
                  <ChevronRight className="ml-1 md:ml-2 w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="relative max-w-7xl mx-auto">
                <button
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-2xl rounded-full p-2 md:p-4 transition-all duration-300 backdrop-blur-sm"
                  onClick={() => scrollGrid('popular-grid', 'left')}
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                </button>
                <div id="popular-grid" className="overflow-x-auto flex gap-2 md:gap-3 lg:gap-4 px-8 md:px-10 pb-3 md:pb-4 scrollbar-hide">
                  {popularMovies.map((item) => (
                    <div className="min-w-[140px] sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px] max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] flex-shrink-0" key={item._id}>
                      <ContentCard content={item} />
                    </div>
                  ))}
                </div>
                <button
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-2xl rounded-full p-2 md:p-4 transition-all duration-300 backdrop-blur-sm"
                  onClick={() => scrollGrid('popular-grid', 'right')}
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
                </button>
              </div>
            </div>
          )}

          {topSeries.length > 0 && (
            <div className="space-y-4 md:space-y-6 section-fade">
              <div className="flex items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-1 h-6 md:h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wide">Top TV Shows</h2>
                </div>
                <button className="text-emerald-400 hover:text-emerald-300 font-semibold text-xs md:text-sm flex items-center transition-colors group">
                  View All
                  <ChevronRight className="ml-1 md:ml-2 w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="relative max-w-7xl mx-auto">
                <button
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-2xl rounded-full p-2 md:p-4 transition-all duration-300 backdrop-blur-sm"
                  onClick={() => scrollGrid('topseries-grid', 'left')}
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                </button>
                <div id="topseries-grid" className="overflow-x-auto flex gap-2 md:gap-3 lg:gap-4 px-8 md:px-10 pb-3 md:pb-4 scrollbar-hide">
                  {topSeries.map((item) => (
                    <div className="min-w-[140px] sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px] max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] flex-shrink-0" key={item._id}>
                      <ContentCard content={item} />
                    </div>
                  ))}
                </div>
                <button
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-2xl rounded-full p-2 md:p-4 transition-all duration-300 backdrop-blur-sm"
                  onClick={() => scrollGrid('topseries-grid', 'right')}
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
                </button>
              </div>
            </div>
          )}

          {/* Action Movies */}
          <div className="space-y-4 md:space-y-6 section-fade">
            <div className="flex items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-1 h-6 md:h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wide">Action Movies</h2>
              </div>
              <button className="text-red-400 hover:text-red-300 font-semibold text-xs md:text-sm flex items-center transition-colors group">
                View All
                <ChevronRight className="ml-1 md:ml-2 w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="relative max-w-7xl mx-auto">
              <button
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-2xl rounded-full p-2 md:p-4 transition-all duration-300 backdrop-blur-sm"
                onClick={() => scrollGrid('action-grid', 'left')}
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
              </button>
              <div id="action-grid" className="overflow-x-auto flex gap-2 md:gap-3 lg:gap-4 px-8 md:px-10 pb-3 md:pb-4 scrollbar-hide">
                {filteredContent.filter((c) => c.genre && Array.isArray(c.genre) && c.genre.includes("Action")).map((item) => (
                  <div className="min-w-[140px] sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px] max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] flex-shrink-0" key={item._id}>
                    <ContentCard content={item} />
                  </div>
                ))}
              </div>
              <button
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-2xl rounded-full p-2 md:p-4 transition-all duration-300 backdrop-blur-sm"
                onClick={() => scrollGrid('action-grid', 'right')}
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
              </button>
            </div>
          </div>

          {/* Drama Series */}
          <div className="space-y-4 md:space-y-6 section-fade">
            <div className="flex items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-1 h-6 md:h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wide">Drama Series</h2>
              </div>
              <button className="text-blue-400 hover:text-blue-300 font-semibold text-xs md:text-sm flex items-center transition-colors group">
                View All
                <ChevronRight className="ml-1 md:ml-2 w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="relative max-w-7xl mx-auto">
              <button
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-2xl rounded-full p-2 md:p-4 transition-all duration-300 backdrop-blur-sm"
                onClick={() => scrollGrid('drama-grid', 'left')}
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
              </button>
              <div id="drama-grid" className="overflow-x-auto flex gap-2 md:gap-3 lg:gap-4 px-8 md:px-10 pb-3 md:pb-4 scrollbar-hide">
                {filteredContent.filter((c) => c.genre && Array.isArray(c.genre) && c.genre.includes("Drama") && c.type === "series").map((item) => (
                  <div className="min-w-[140px] sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px] max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] flex-shrink-0" key={item._id}>
                    <ContentCard content={item} />
                  </div>
                ))}
              </div>
              <button
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-2xl rounded-full p-2 md:p-4 transition-all duration-300 backdrop-blur-sm"
                onClick={() => scrollGrid('drama-grid', 'right')}
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Footer */}
      <footer className="bg-gradient-to-b from-slate-900 to-black border-t border-slate-800/50 mt-16 md:mt-24">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">StreamPlay Binge</h1>
                  <p className="text-purple-300 text-sm font-medium">Premium streaming experience</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-lg">
                Experience the best of entertainment with premium content from Netflix, Prime Video, Disney+ Hotstar, and more - all unified in one seamless platform.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 md:mb-6 text-lg">Quick Links</h4>
              <div className="space-y-3 text-sm md:text-base text-gray-400">
                <Link href="/" className="block hover:text-purple-300 cursor-pointer transition-colors">Home</Link>
                <Link href="/movies" className="block hover:text-purple-300 cursor-pointer transition-colors">Movies</Link>
                <Link href="/series" className="block hover:text-purple-300 cursor-pointer transition-colors">TV Shows</Link>
                <Link href="/sports" className="block hover:text-purple-300 cursor-pointer transition-colors">Sports</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 md:mb-6 text-lg">Support</h4>
              <div className="space-y-3 text-sm md:text-base text-gray-400">
                <Link href="/support/help-center" className="block hover:text-purple-300 cursor-pointer transition-colors">Help Center</Link>
                <Link href="/support/contact-us" className="block hover:text-purple-300 cursor-pointer transition-colors">Contact Us</Link>
                <Link href="/support/privacy-policy" className="block hover:text-purple-300 cursor-pointer transition-colors">Privacy Policy</Link>
                <Link href="/support/terms-of-service" className="block hover:text-purple-300 cursor-pointer transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm">
              © 2025 StreamPlay Binge. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-6 md:mt-0">
              <div className="flex space-x-3 text-gray-400">
                {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                  <a 
                    key={social} 
                    href={`#${social}`}
                    className="w-10 h-10 bg-slate-800/50 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 cursor-pointer transition-all transform hover:scale-110 border border-slate-700/50 hover:border-purple-500/50"
                  >
                    <span className="text-xs font-bold uppercase">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Avatar Component */}
      <AIAvatar onSearchContent={(query: string) => setSearchTerm(query)} />
    </div>
  )
}