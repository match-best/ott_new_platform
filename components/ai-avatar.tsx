"use client"

import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, X, Sparkles, Loader2, Search, Zap, Brain } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface AIAvatarProps {
  onSearchContent: (query: string) => void
}

export function AIAvatar({ onSearchContent }: AIAvatarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultText, setResultText] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isWakeWordActive, setIsWakeWordActive] = useState(false)
  const [movieNames, setMovieNames] = useState<string[]>([])
  
  const recognitionRef = useRef<any>(null)
  const wakeWordRecognitionRef = useRef<any>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'
      
      recognition.onstart = () => {
        console.log('Main recognition started')
        setIsListening(true)
        setResultText('')
        setShowResult(false)
        setMovieNames([])
      }
      
      recognition.onresult = (event: any) => {
        console.log('Recognition result:', event.results)
        const transcript = event.results[0][0].transcript
        console.log('Transcript:', transcript)
        handleVoiceInput(transcript)
      }
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        if (event.error === 'no-speech') {
          setResultText("I didn't hear anything. Please try again.")
          setShowResult(true)
        } else {
          setResultText(`Error: ${event.error}. Please try again.`)
          setShowResult(true)
        }
      }
      
      recognition.onend = () => {
        console.log('Main recognition ended')
        setIsListening(false)
      }
      
      recognitionRef.current = recognition
      console.log('Speech recognition initialized')
    } else {
      console.log('Speech recognition not supported')
    }
  }, [])

  // Enhanced wake word detection
  useEffect(() => {
    if (!isOpen && typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      let isActive = true
      let retryCount = 0
      const maxRetries = 3
      
      const startWakeWordListening = () => {
        if (!isActive || isOpen) return
        
        try {
          const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
          const wakeRecognition = new SpeechRecognition()
          wakeRecognition.continuous = true
          wakeRecognition.interimResults = true
          wakeRecognition.lang = 'en-US'
          wakeRecognition.maxAlternatives = 3
          
          wakeRecognition.onstart = () => {
            console.log('🎙️ Wake word listening started')
            setIsWakeWordActive(true)
            retryCount = 0
          }
          
          wakeRecognition.onresult = (event: any) => {
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const result = event.results[i]
              if (result.isFinal || result[0].confidence > 0.5) {
                const transcript = result[0].transcript.toLowerCase().trim()
                console.log('🔍 Wake word check:', transcript, 'Confidence:', result[0].confidence)
                
                // More flexible wake word detection
                const wakeWords = [
                  'hi ava', 'hey ava', 'hello ava', 
                  'ava', 'hi eva', 'hey eva',
                  'ok ava', 'ava help'
                ]
                
                const isWakeWordDetected = wakeWords.some(word => 
                  transcript.includes(word) || 
                  transcript.replace(/[^a-z\s]/g, '').includes(word)
                )
                
                if (isWakeWordDetected) {
                  console.log('🚀 Wake word detected!', transcript)
                  wakeRecognition.stop()
                  setIsWakeWordActive(false)
                  setIsOpen(true)
                  
                  // Add a small delay for smoother transition
                  setTimeout(() => {
                    startListening()
                  }, 800)
                  return
                }
              }
            }
          }
          
          wakeRecognition.onerror = (event: any) => {
            console.log('❌ Wake word error:', event.error)
            setIsWakeWordActive(false)
            
            if (isActive && !isOpen && retryCount < maxRetries) {
              retryCount++
              console.log(`🔄 Retrying wake word detection (${retryCount}/${maxRetries})`)
              setTimeout(startWakeWordListening, 2000 * retryCount)
            }
          }
          
          wakeRecognition.onend = () => {
            console.log('⏹️ Wake word listening ended')
            setIsWakeWordActive(false)
            
            if (isActive && !isOpen && retryCount < maxRetries) {
              console.log('🔄 Restarting wake word detection')
              setTimeout(startWakeWordListening, 1000)
            }
          }
          
          wakeRecognition.start()
          wakeWordRecognitionRef.current = wakeRecognition
          
        } catch (err) {
          console.log('💥 Wake word listening error:', err)
          setIsWakeWordActive(false)
          if (isActive && !isOpen && retryCount < maxRetries) {
            retryCount++
            setTimeout(startWakeWordListening, 3000 * retryCount)
          }
        }
      }
      
      // Start after initialization
      const timer = setTimeout(startWakeWordListening, 1500)
      
      return () => {
        isActive = false
        clearTimeout(timer)
        setIsWakeWordActive(false)
        try {
          wakeWordRecognitionRef.current?.stop()
        } catch (err) {}
      }
    }
  }, [isOpen])

  const handleVoiceInput = async (voiceText: string) => {
    console.log('🎯 Processing voice input:', voiceText)
    setIsProcessing(true)
    
    try {
      // Check if Gemini API key is available
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      
      if (!apiKey) {
        console.warn('⚠️ Gemini API key not found, using fallback')
        const fallbackQuery = extractSearchTerms(voiceText)
        if (fallbackQuery) {
          setResultText(`Searching for: ${fallbackQuery}`)
          setShowResult(true)
          onSearchContent(fallbackQuery)
          setTimeout(() => {
            setIsOpen(false)
            setShowResult(false)
            setResultText('')
          }, 2000)
        } else {
          setResultText("Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file")
          setShowResult(true)
        }
        return
      }

      // Initialize Gemini 1.5 AI
      console.log('🤖 Sending to Gemini 1.5...')
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      
      // Updated prompt to return actual movie names
      const prompt = `You are Ava, an AI movie recommendation assistant. User said: "${voiceText}"

Your task: Based on what the user wants, provide ONLY a list of actual movie names that match their request.

Instructions:
1. Return ONLY movie/show names, nothing else
2. Maximum 5-8 movie names
3. Each name on a new line
4. No descriptions, no explanations, no extra text
5. Focus on popular and well-known titles
6. Match the user's language/genre preferences

Examples:
User: "Show me action movies" 
Response:
John Wick
Mad Max: Fury Road
The Dark Knight
Mission Impossible
Fast & Furious

User: "Comedy movies"
Response:
The Hangover
Superbad
Deadpool
Dumb and Dumber
Anchorman

User: "Shah Rukh Khan movies"
Response:
Dilwale Dulhania Le Jayenge
My Name is Khan
Chennai Express
Happy New Year
Don

User: "Horror films"
Response:
The Conjuring
It
A Quiet Place
Hereditary
Annabelle

Now respond to: "${voiceText}"`
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      const aiResponse = response.text().trim()
      
      console.log('🎬 Gemini response:', aiResponse)
      
      if (aiResponse && aiResponse.length > 0) {
        // Parse movie names from response
        const movieList = aiResponse
          .split('\n')
          .map(name => name.trim())
          .filter(name => name.length > 0 && !name.includes(':'))
          .slice(0, 6)
        
        console.log('📽️ Parsed movies:', movieList)
        
        if (movieList.length > 0) {
          setMovieNames(movieList)
          setResultText(`Found ${movieList.length} recommendations`)
          setShowResult(true)
          
          // Search for each movie
          const searchQuery = movieList[0] // Start with first movie
          console.log('🔍 Searching for:', searchQuery)
          onSearchContent(searchQuery)
          
          // Auto close after showing results
          timeoutRef.current = setTimeout(() => {
            setIsOpen(false)
            setShowResult(false)
            setResultText('')
            setMovieNames([])
          }, 4000)
        } else {
          setResultText("I couldn't find relevant movies. Try being more specific.")
          setShowResult(true)
          setTimeout(() => {
            setShowResult(false)
            setResultText('')
          }, 3000)
        }
      } else {
        setResultText("I couldn't understand. Try saying something like 'action movies' or 'comedy shows'")
        setShowResult(true)
        setTimeout(() => {
          setShowResult(false)
          setResultText('')
        }, 3000)
      }
      
    } catch (error) {
      console.error('💥 Gemini API error:', error)
      
      // Fallback to local extraction
      console.log('🔄 Using fallback search...')
      const fallbackQuery = extractSearchTerms(voiceText)
      
      if (fallbackQuery) {
        setResultText(`Searching for: ${fallbackQuery}`)
        setShowResult(true)
        onSearchContent(fallbackQuery)
        setTimeout(() => {
          setIsOpen(false)
          setShowResult(false)
          setResultText('')
        }, 2000)
      } else {
        setResultText("Something went wrong. Please try again.")
        setShowResult(true)
        setTimeout(() => {
          setShowResult(false)
          setResultText('')
        }, 3000)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const extractSearchTerms = (text: string): string => {
    const lowerText = text.toLowerCase()
    
    // Direct genre mentions
    const genres = ['action', 'comedy', 'drama', 'horror', 'romance', 'thriller', 'sci-fi', 'fantasy', 'documentary', 'animation']
    const foundGenres = genres.filter(genre => lowerText.includes(genre))
    
    // Actor names (common ones)
    const actors = ['shah rukh khan', 'salman khan', 'aamir khan', 'akshay kumar', 'hrithik roshan', 'ranveer singh', 'ranbir kapoor']
    const foundActors = actors.filter(actor => lowerText.includes(actor))
    
    // Movie/show keywords
    const movieKeywords = ['movie', 'film', 'cinema']
    const showKeywords = ['show', 'series', 'tv show', 'web series']
    
    // Language keywords
    const languageKeywords = ['bollywood', 'hollywood', 'hindi', 'english', 'tamil', 'telugu']
    const foundLanguages = languageKeywords.filter(lang => lowerText.includes(lang))
    
    // Mood-based keywords
    if (lowerText.includes('funny') || lowerText.includes('laugh') || lowerText.includes('humor')) {
      return 'comedy'
    }
    if (lowerText.includes('scary') || lowerText.includes('fear') || lowerText.includes('ghost')) {
      return 'horror'
    }
    if (lowerText.includes('love') || lowerText.includes('romantic')) {
      return 'romance'
    }
    if (lowerText.includes('fight') || lowerText.includes('war') || lowerText.includes('battle')) {
      return 'action'
    }
    
    // Build search query
    let searchTerms = []
    
    if (foundGenres.length > 0) {
      searchTerms.push(foundGenres[0])
    }
    
    if (foundActors.length > 0) {
      return foundActors[0] // Return actor name directly
    }
    
    if (foundLanguages.length > 0) {
      searchTerms.push(foundLanguages[0])
    }
    
    // Add movie/show type
    if (movieKeywords.some(keyword => lowerText.includes(keyword))) {
      searchTerms.push('movie')
    } else if (showKeywords.some(keyword => lowerText.includes(keyword))) {
      searchTerms.push('series')
    }
    
    // If no specific terms found, try to extract key words
    if (searchTerms.length === 0) {
      const words = lowerText.split(' ').filter(word => 
        word.length > 3 && 
        !['show', 'find', 'want', 'watch', 'movie', 'something', 'anything'].includes(word)
      )
      if (words.length > 0) {
        searchTerms.push(words[0])
      }
    }
    
    return searchTerms.join(' ') || 'popular'
  }

  const startListening = () => {
    if (!recognitionRef.current) {
      setResultText("Voice recognition not available. Please use Chrome or Edge.")
      setShowResult(true)
      return
    }
    
    try {
      console.log('🎙️ Starting recognition...')
      recognitionRef.current.start()
    } catch (err) {
      console.error('💥 Failed to start recognition:', err)
      setResultText("Failed to start voice recognition. Please try again.")
      setShowResult(true)
    }
  }

  const closeModal = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsOpen(false)
    setIsListening(false)
    setIsProcessing(false)
    setShowResult(false)
    setResultText('')
    setMovieNames([])
    
    try {
      recognitionRef.current?.stop()
    } catch (err) {}
  }

  const searchMovie = (movieName: string) => {
    console.log('🎬 Searching for movie:', movieName)
    onSearchContent(movieName)
    closeModal()
  }

  return (
    <>
      {/* Futuristic Floating Avatar Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          {/* Outer glow ring */}
          <div className={cn(
            "absolute inset-0 rounded-full transition-all duration-1000",
            isWakeWordActive 
              ? "bg-gradient-to-r from-cyan-500/30 to-purple-500/30 animate-pulse scale-150" 
              : "bg-gradient-to-r from-blue-500/20 to-purple-500/20 scale-125"
          )}></div>
          
          {/* Middle ring */}
          <div className={cn(
            "absolute inset-2 rounded-full transition-all duration-700",
            isWakeWordActive 
              ? "bg-gradient-to-r from-cyan-400/40 to-purple-400/40 animate-ping" 
              : "bg-gradient-to-r from-blue-400/30 to-purple-400/30"
          )}></div>
          
          <button
            className="relative w-16 h-16 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center group animate-fadeIn hover:scale-110 active:scale-95 transition-all duration-300 overflow-hidden"
            onClick={() => {
              console.log('🚀 Avatar button clicked')
              setIsOpen(true)
              setTimeout(() => {
                startListening()
              }, 500)
            }}
          >
            {/* Inner animated gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <Brain className="w-8 h-8 text-white drop-shadow-lg" />
              <div className={cn(
                "absolute -top-1 -right-1 w-3 h-3 rounded-full transition-all duration-300",
                isWakeWordActive 
                  ? "bg-green-400 animate-pulse shadow-lg shadow-green-400/50" 
                  : "bg-gray-400"
              )}></div>
            </div>
            
            {/* Tooltip */}
            <div className="absolute -top-20 right-0 bg-black/90 backdrop-blur-sm text-white text-sm px-4 py-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-cyan-500/30">
              <div className="font-semibold text-cyan-300">Hi, I'm Ava! 🤖</div>
              <div className="text-xs text-gray-300 mt-1">
                {isWakeWordActive ? '🎙️ Listening for "Hi Ava"' : '🎯 Click or say "Hi Ava"'}
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Futuristic Voice Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn">
          {/* Background grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          <div className="relative bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-purple-900/95 rounded-3xl p-8 shadow-2xl border border-cyan-500/30 animate-slideInUp max-w-md w-full mx-4 backdrop-blur-sm">
            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-[1px]">
              <div className="h-full w-full rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-cyan-300 transition-colors p-2 rounded-full hover:bg-cyan-500/10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center">
                {/* Futuristic Avatar */}
                <div className="mx-auto mb-6 relative">
                  {/* Outer ring animations */}
                  {(isListening || isProcessing) && (
                    <>
                      <div className="absolute inset-0 w-32 h-32 border-2 border-cyan-400/30 rounded-full animate-ping"></div>
                      <div className="absolute inset-2 w-28 h-28 border-2 border-blue-400/20 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute inset-4 w-24 h-24 border-2 border-purple-400/10 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                    </>
                  )}
                  
                  <div className={cn(
                    "relative w-24 h-24 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg",
                    isListening && "animate-pulse scale-110 shadow-cyan-500/50",
                    isProcessing && "animate-spin shadow-purple-500/50"
                  )}>
                    {isProcessing ? (
                      <Brain className="w-12 h-12 text-white animate-pulse" />
                    ) : isListening ? (
                      <Mic className="w-12 h-12 text-white animate-pulse" />
                    ) : (
                      <Sparkles className="w-12 h-12 text-white" />
                    )}
                    
                    {/* Inner glow */}
                    <div className="absolute inset-2 bg-white/10 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-2">
                  Ava AI Assistant
                </h2>
                <p className="text-sm text-cyan-400 mb-4 flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  Powered by Gemini 1.5 Flash
                </p>
                
                {/* Status Text */}
                <div className="min-h-[80px] flex flex-col items-center justify-center">
                  {showResult ? (
                    <div className="space-y-3">
                      <p className="text-green-400 text-lg font-semibold animate-fadeIn">
                        {resultText}
                      </p>
                      {movieNames.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-cyan-300 text-sm">🎬 AI Recommendations:</p>
                          <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                            {movieNames.slice(0, 4).map((movie, index) => (
                              <button
                                key={index}
                                onClick={() => searchMovie(movie)}
                                className="text-left px-3 py-2 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-lg text-white text-sm hover:from-cyan-500/30 hover:to-purple-500/30 transition-all border border-cyan-500/20 hover:border-cyan-400/40"
                              >
                                {movie}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : isProcessing ? (
                    <div className="space-y-2">
                      <p className="text-purple-300 text-lg animate-fadeIn flex items-center gap-2">
                        <Brain className="w-5 h-5 animate-pulse" />
                        AI is thinking...
                      </p>
                      <div className="flex justify-center">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  ) : isListening ? (
                    <div className="space-y-2">
                      <p className="text-blue-300 text-lg animate-pulse flex items-center gap-2">
                        <Mic className="w-5 h-5" />
                        Listening... Speak now
                      </p>
                      <div className="flex justify-center">
                        <div className="flex space-x-1">
                          <div className="w-3 h-8 bg-cyan-400 rounded animate-pulse"></div>
                          <div className="w-3 h-6 bg-blue-400 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-3 h-10 bg-purple-400 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-3 h-4 bg-cyan-400 rounded animate-pulse" style={{animationDelay: '0.3s'}}></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-base">
                      🎙️ Click the mic and tell me what you want to watch
                    </p>
                  )}
                </div>

                {/* Action Button */}
                {!isListening && !isProcessing && !showResult && (
                  <button
                    onClick={startListening}
                    className="mt-4 bg-gradient-to-r from-cyan-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-cyan-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto shadow-lg shadow-cyan-500/25"
                  >
                    <Mic className="w-5 h-5" />
                    Start Speaking
                  </button>
                )}

                {/* Example queries */}
                {!isListening && !isProcessing && !showResult && (
                  <div className="mt-6 text-xs text-gray-500 bg-slate-800/30 rounded-lg p-3 border border-cyan-500/10">
                    <p className="mb-2 text-cyan-400">💡 Try saying:</p>
                    <div className="space-y-1 text-left">
                      <p>"Show me action movies"</p>
                      <p>"I want something funny"</p>
                      <p>"Find Shah Rukh Khan movies"</p>
                      <p>"Latest horror films"</p>
                    </div>
                  </div>
                )}

                {/* API Status */}
                <div className="mt-4 text-xs">
                  {process.env.NEXT_PUBLIC_GEMINI_API_KEY ? (
                    <p className="text-green-400 flex items-center justify-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Gemini AI Connected
                    </p>
                  ) : (
                    <p className="text-red-400 flex items-center justify-center gap-1">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      Add NEXT_PUBLIC_GEMINI_API_KEY to .env.local
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(100px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </>
  )
} 