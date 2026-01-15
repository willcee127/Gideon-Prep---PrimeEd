import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { trackIntelUnlock } from '../services/syncService'

const TacticalExtraction = ({ conceptId, onReady, isVisible }) => {
  const [timeRemaining, setTimeRemaining] = useState(25)
  const [isReady, setIsReady] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [player, setPlayer] = useState(null)
  const [videoEnded, setVideoEnded] = useState(false)
  const [showFallback, setShowFallback] = useState(false)
  const playerRef = useRef(null)

  // Default concept if undefined
  const safeConceptId = conceptId || 'addition'
  console.log('TacticalExtraction - conceptId:', conceptId, 'safeConceptId:', safeConceptId)

  // Tactical Intel Text fallback content
  const tacticalIntelContent = {
    'addition': {
      title: 'ADDITION FUNDAMENTALS',
      content: 'Addition combines quantities. When adding whole numbers, line up digits by place value. Start from the rightmost digit (ones place) and move left, carrying over when sums exceed 9.',
      examples: ['23 + 15 = 38', '147 + 89 = 236', '456 + 789 = 1245']
    },
    'subtraction': {
      title: 'SUBTRACTION OPERATIONS',
      content: 'Subtraction finds the difference between quantities. Line up digits by place value, start from the right, and borrow from the next place when needed.',
      examples: ['45 - 23 = 22', '156 - 89 = 67', '500 - 234 = 266']
    },
    'multiplication': {
      title: 'MULTIPLICATION STRATEGY',
      content: 'Multiplication is repeated addition. Break down complex problems using the distributive property: a × (b + c) = a×b + a×c.',
      examples: ['7 × 8 = 56', '23 × 4 = 92', '15 × 12 = 180']
    },
    'division': {
      title: 'DIVISION FUNDAMENTALS',
      content: 'Division is the inverse of multiplication. Find how many times the divisor fits into the dividend. Use long division for complex problems.',
      examples: ['48 ÷ 6 = 8', '156 ÷ 12 = 13', '891 ÷ 9 = 99']
    },
    'fraction_simplification': {
      title: 'FRACTION SIMPLIFICATION',
      content: 'Simplify fractions by dividing numerator and denominator by their greatest common divisor. This reduces the fraction to its lowest terms.',
      examples: ['8/12 = 2/3', '15/25 = 3/5', '24/36 = 2/3']
    },
    'percentage': {
      title: 'PERCENTAGE CALCULATIONS',
      content: 'Percentage means "per hundred". Convert percentages to decimals by dividing by 100, then multiply by the base number.',
      examples: ['25% of 80 = 20', '15% of 200 = 30', '75% of 120 = 90']
    },
    'linear_equations': {
      title: 'LINEAR EQUATION SOLVING',
      content: 'Solve linear equations by isolating the variable. Perform the same operation on both sides to maintain equality.',
      examples: ['2x + 3 = 11 → x = 4', '3x - 5 = 10 → x = 5', 'x/2 + 4 = 9 → x = 10']
    }
  }
  const videoMappings = {
    // Whole Numbers
    'addition': '7StpF-2dOwI',
    'subtraction': '8A_tW7c1g-w',
    'multiplication': '3lgLz-LPqyU',
    'division': 'SLne_3-v2sI',
    
    // Decimals/Fractions
    'decimal_addition': '7StpF-2dOwI',
    'decimal_subtraction': '8A_tW7c1g-w',
    'fraction_simplification': '5x62e0qLh5M',
    'fraction_operations': 'kDfQkxv-1zY',
    
    // Percents/Ratios
    'percentage_basics': 'Ux_W3fxxM_k',
    'percentage_calculations': 'rR95d3932JY',
    'ratio_basics': '8t_1a2tJg4M',
    'ratio_problems': 'RQllnSvGr_A',
    
    // Basic Algebra
    'linear_equations': 'NycLTFcjS4U',
    'algebra_basics': 'A5aDdlV-Mqo',
    'solving_equations': 'NycLTFcjS4U',
    'variable_isolation': 'NycLTFcjS4U'
  }

  // Load YouTube IFrame Player API
  useEffect(() => {
    if (!isVisible) return

    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
      }
    }

    const initPlayer = () => {
      const videoId = videoMappings[safeConceptId] || videoMappings['addition']
      
      try {
        const newPlayer = new window.YT.Player('youtube-player', {
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            fs: 0,
            cc_load_policy: 1,
            start: 0
          },
          events: {
            onReady: (event) => {
              setPlayer(event.target)
              console.log('YouTube player ready for concept:', safeConceptId)
            },
            onStateChange: (event) => {
              console.log('YouTube player state:', event.data)
              if (event.data === window.YT.PlayerState.ENDED) {
                setVideoEnded(true)
                checkReadyState()
              } else if (event.data === window.YT.PlayerState.PLAYING) {
                // Video started playing
                console.log('Video started playing')
              } else if (event.data === window.YT.PlayerState.ERROR) {
                // Video error - show fallback
                console.log('YouTube player error')
                setShowFallback(true)
              }
            },
            onError: (error) => {
              console.log('YouTube player error:', error)
              setShowFallback(true)
            }
          }
        })
      } catch (error) {
        console.error('Failed to initialize YouTube player:', error)
        setShowFallback(true)
      }
    }

    // Set up YouTube API ready callback
    window.onYouTubeIframeAPIReady = initPlayer

    // If API is already loaded, initialize immediately
    if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      loadYouTubeAPI()
    }

    // Fallback timeout - if video doesn't load in 10 seconds
    const fallbackTimer = setTimeout(() => {
      if (!player) {
        console.log('YouTube player failed to load, showing fallback')
        setShowFallback(true)
      }
    }, 10000)

    return () => {
      clearTimeout(fallbackTimer)
      if (player) {
        try {
          player.destroy()
        } catch (error) {
          console.error('Error destroying YouTube player:', error)
        }
      }
    }
  }, [safeConceptId, isVisible])

  // Countdown timer
  useEffect(() => {
    if (!isVisible) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          checkReadyState()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isVisible])

  // Check if ready button should be enabled
  const checkReadyState = () => {
    // Only enable if video has ended OR timer has expired (25 seconds)
    if (videoEnded || timeRemaining <= 5) {
      setIsReady(true)
    }
  }

  const handleReady = async () => {
    if (isReady) {
      // Track intel unlock when extraction is completed
      if (safeConceptId) {
        try {
          await trackIntelUnlock(localStorage.getItem('gideon_call_sign'), safeConceptId)
          console.log('Intel unlocked:', safeConceptId)
        } catch (error) {
          console.error('Failed to track intel unlock:', error)
        }
      }
      
      onReady()
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isVisible) return null

  return (
    <>
      <style jsx>{`
        .warrior-text {
          font-family: 'Courier New', monospace;
          letter-spacing: 0.05em;
        }
        .glow-lavender {
          text-shadow: 0 0 20px rgba(230, 230, 250, 0.5);
        }
        .extraction-overlay {
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(230, 230, 250, 0.3);
        }
        .video-container {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
        }
        .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        .countdown-active {
          animation: countdown-pulse 1s infinite;
        }
        @keyframes countdown-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="extraction-overlay rounded-2xl max-w-4xl w-full h-full max-h-[90vh] overflow-hidden">
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-lavender-500/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-lavender-400 glow-lavender warrior-text">
                        TACTICAL EXTRACTION
                      </h2>
                      <div className="text-gray-400 text-sm warrior-text uppercase tracking-widest">
                        SELF-HEALING PROTOCOL ACTIVATED
                      </div>
                    </div>
                    
                    {/* Timer */}
                    <div className={`text-center ${
                      !isReady ? 'countdown-active' : ''
                    }`}>
                      <div className={`text-3xl font-bold warrior-text ${
                        isReady ? 'text-green-400' : 'text-orange-400'
                      }`}>
                        {formatTime(timeRemaining)}
                      </div>
                      <div className="text-xs text-gray-400 warrior-text">
                        {isReady ? 'READY FOR DEPLOYMENT' : 'EXTRACTION IN PROGRESS'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Content */}
                <div className="flex-1 p-6">
                  <div className="h-full">
                    {showFallback ? (
                      <div className="h-full bg-black/50 rounded-lg p-6 border border-lavender-500/20">
                        <div className="text-center space-y-6">
                          <div className="text-lavender-400 text-xl font-bold warrior-text">
                            TACTICAL INTEL TEXT
                          </div>
                          
                          {tacticalIntelContent[safeConceptId] && (
                            <div className="space-y-4">
                              <div className="text-yellow-400 text-lg font-bold warrior-text">
                                {tacticalIntelContent[safeConceptId].title}
                              </div>
                              <div className="text-white text-sm warrior-text leading-relaxed">
                                {tacticalIntelContent[safeConceptId].content}
                              </div>
                              <div className="space-y-2">
                                <div className="text-lavender-300 text-sm warrior-text">
                                  EXAMPLES:
                                </div>
                                {tacticalIntelContent[safeConceptId].examples.map((example, index) => (
                                  <div key={index} className="text-green-400 text-sm warrior-text font-mono">
                                    {example}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="text-orange-400 text-sm warrior-text">
                            Video unavailable - Using tactical intel fallback
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="video-container">
                        <div id="youtube-player" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-lavender-500/20">
                  <div className="flex justify-between items-center">
                    <div className="text-gray-400 text-sm warrior-text">
                      Concept: {safeConceptId?.replace('_', ' ').toUpperCase() || 'TRAINING MODULE'}
                      {videoEnded && (
                        <span className="ml-2 text-green-400">• VIDEO COMPLETED</span>
                      )}
                    </div>
                    
                    <button
                      onClick={handleReady}
                      disabled={!isReady}
                      className={`px-8 py-3 rounded-lg font-bold transition-all transform warrior-text ${
                        isReady
                          ? 'bg-green-600 hover:bg-green-700 text-white scale-105 hover:scale-110'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isReady ? '🚀 READY FOR RECOVERY' : `WAIT ${formatTime(timeRemaining)}`}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default TacticalExtraction
