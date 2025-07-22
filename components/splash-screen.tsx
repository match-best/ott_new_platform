"use client"

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-slate-900 to-black">
      <div className="text-center">
        {/* Logo Container */}
        <div className="mb-8 flex items-center justify-center space-x-4">
          <div className="h-16 w-16 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
            <div className="w-8 h-8 bg-white rounded-lg opacity-90"></div>
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-bold text-white tracking-tight">StreamPlay</h1>
            <p className="text-lg text-purple-300 -mt-1 font-medium">Binge</p>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center mt-4 space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>

        {/* Loading Text */}
        <div className="mt-6 text-purple-300 text-sm font-medium">
          Loading amazing content for you...
        </div>
      </div>
    </div>
  )
} 