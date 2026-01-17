import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../supabase'
import SocraticCoPilot from '../services/SocraticCoPilotService'
import CommissioningService from '../services/CommissioningService'

const WarriorModule = ({ onComplete, isVisible }) => {
  const [isClient, setIsClient] = useState(false)
  const [currentPanel, setCurrentPanel] = useState(0)
  const [spotlightPosition, setSpotlightPosition] = useState({ x: 0, y: 0 })
  const [commissioningService] = useState(new CommissioningService())
  const [socraticCoPilot] = useState(new SocraticCoPilot())

  // Hydration guard - only render on client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  const panels = [
    {
      title: "WELCOME, WARRIOR",
      subtitle: "Your Mission Begins Now",
      content: "You are no longer a student. You are a Warrior on a mission to master GED Math. Every problem you solve brings you closer to victory.",
      spotlight: null
    },
    {
      title: "STRIKE READINESS",
      subtitle: "Your Path to the GED",
      content: "This bar shows your mastery of the current sector. Fill it to 100% to unlock the next challenge. Your progress is tracked and celebrated.",
      spotlight: { element: 'strike-readiness', label: 'STRIKE READINESS' }
    },
    {
      title: "GRIT MULTIPLIER",
      subtitle: "Reward for Struggle",
      content: "The flame grows stronger every time you complete a Socratic hint sequence. This is your combat power - proof that you're getting stronger through challenge.",
      spotlight: { element: 'grit-multiplier', label: 'GRIT MULTIPLIER' }
    },
    {
      title: "SOCRATIC CO-PILOT",
      subtitle: "Your Safety Net",
      content: "When you face friction, the Co-Pilot breaks walls into steps. Use it wisely - it's designed to guide, not give answers. True mastery comes from the struggle.",
      spotlight: { element: 'socratic-copilot', label: 'CO-PILOT' }
    },
    {
      title: "TACTICAL COLOR CODES",
      subtitle: "Mission Classification System",
      content: "Forge Orange: Offensive Operations - Conquering new GED territory and learning fresh concepts. Neon Blue: Defensive Recon - Securing the perimeter by reviewing your 3 oldest mastered concepts to prevent memory decay.",
      spotlight: { element: 'tactical-colors', label: 'COLOR CODES' }
    }
  ]

  useEffect(() => {
    if (!isVisible) return

    // Initialize services
    const initializeServices = async () => {
      try {
        await commissioningService.initialize()
        await socraticCoPilot.initialize()
        console.log('Services initialized successfully')
      } catch (error) {
        console.error('Failed to initialize services:', error)
      }
    }

    initializeServices()

    // Set spotlight positions based on panel
    const positions = {
      'strike-readiness': { x: '50%', y: '10%' },
      'grit-multiplier': { x: '85%', y: '5%' },
      'socratic-copilot': { x: '50%', y: '50%' },
      'tactical-colors': { x: '50%', y: '85%' }
    }

    const currentSpotlight = panels[currentPanel]?.spotlight
    if (currentSpotlight && positions[currentSpotlight.element]) {
      setSpotlightPosition(positions[currentSpotlight.element])
    }
  }, [currentPanel, isVisible])

  const handleNext = () => {
    if (currentPanel < panels.length - 1) {
      setCurrentPanel(currentPanel + 1)
    } else {
      // Check for 100K milestone
      const stats = commissioningService.getCurrentStats()
      
      // Trigger commissioning if milestone reached
      if (stats.hasReached100k) {
        commissioningService.triggerCommissioning()
      }
      
      // Complete onboarding
      onComplete()
    }
  }

  const handleSocraticHint = async (problem, conceptId, failureCount) => {
    const hint = socraticCoPilot.generateSocraticHint(problem, conceptId, failureCount)
    
    // Show intervention alert if needed
    if (hint.requiresIntervention) {
      console.log('Intervention triggered for concept:', conceptId)
    }
    
    return hint
  }

  const handleInterventionReset = (conceptId) => {
    socraticCoPilot.resetIntervention(conceptId)
    console.log('Intervention reset for concept:', conceptId)
  }

  const handleComplete = async () => {
    try {
      // 1. Mark onboarding as complete
      localStorage.setItem('warrior_onboarding_complete', 'true');
      
      // 2. Route to diagnostic testing
      window.location.href = '/range-qual';
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const handleSkip = () => {
    handleComplete()
  }

  // Check if user has already completed onboarding
  useEffect(() => {
    const hasCompleted = localStorage.getItem('warrior_onboarding_complete')
    if (hasCompleted === 'true' && isVisible) {
      onComplete()
    }
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <>
      {/* CSS for onboarding styling */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes spotlight-glow {
          0%, 100% { 
            box-shadow: 0 0 0 4000px rgba(0, 0, 0, 0.85),
                        0 0 100px 20px rgba(230, 230, 250, 0.3);
          }
          50% { 
            box-shadow: 0 0 0 4000px rgba(0, 0, 0, 0.85),
                        0 0 120px 30px rgba(230, 230, 250, 0.5);
          }
        }

        .onboarding-overlay {
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(8px);
        }

        .spotlight {
          position: fixed;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          pointer-events: none;
          animation: spotlight-glow 2s infinite;
          z-index: 1000;
        }

        .warrior-text {
          font-family: 'Courier New', monospace;
          letter-spacing: 0.05em;
        }

        .glow-lavender {
          text-shadow: 0 0 20px rgba(230, 230, 250, 0.5);
        }

        .glow-gold {
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }
      `}</style>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 onboarding-overlay flex items-center justify-center"
          >
            {/* Spotlight Effect */}
            {panels[currentPanel].spotlight && (
              <motion.div
                key={`spotlight-${currentPanel}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 0.8,
                  left: spotlightPosition.x,
                  top: spotlightPosition.y,
                  transform: 'translate(-50%, -50%)'
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="spotlight"
              />
            )}

            {/* Tactical Color Codes Visual Elements */}
            {panels[currentPanel].title === "TACTICAL COLOR CODES" && (
              <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-8">
                {/* Forge Orange Node */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: 1,
                    boxShadow: [
                      '0 0 20px rgba(255, 140, 0, 0.5)',
                      '0 0 40px rgba(255, 140, 0, 0.8)',
                      '0 0 20px rgba(255, 140, 0, 0.5)'
                    ]
                  }}
                  transition={{ 
                    scale: { repeat: Infinity, duration: 2 },
                    boxShadow: { repeat: Infinity, duration: 2 }
                  }}
                  className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center"
                >
                  <div className="w-6 h-6 rounded-full bg-orange-300"></div>
                </motion.div>

                {/* Neon Blue Button */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: 1,
                    boxShadow: [
                      '0 0 20px rgba(0, 191, 255, 0.7)',
                      '0 0 40px rgba(0, 191, 255, 1)',
                      '0 0 20px rgba(0, 191, 255, 0.7)'
                    ]
                  }}
                  transition={{ 
                    scale: { repeat: Infinity, duration: 2, delay: 0.5 },
                    boxShadow: { repeat: Infinity, duration: 2, delay: 0.5 }
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-black font-bold text-sm flex items-center justify-center"
                  style={{ backgroundColor: '#00BFFF' }}
                >
                  🚀 RECON
                </motion.div>
              </div>
            )}

            {/* Onboarding Panel */}
            <motion.div
              key={`panel-${currentPanel}`}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-lavender-500/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
              style={{
                boxShadow: '0 0 50px rgba(230, 230, 250, 0.2), inset 0 0 30px rgba(230, 230, 250, 0.1)'
              }}
            >
              <div className="text-center space-y-6">
                {/* Panel Header */}
                <div>
                  <h2 className="text-3xl font-black text-lavender-400 mb-2 warrior-text glow-lavender">
                    {panels[currentPanel].title}
                  </h2>
                  <p className="text-lavender-300 text-sm warrior-text">
                    {panels[currentPanel].subtitle}
                  </p>
                </div>

                {/* Spotlight Label */}
                {panels[currentPanel].spotlight && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-lavender-500/20 border border-lavender-500/50 rounded-lg px-4 py-2"
                  >
                    <div className="text-lavender-400 text-xs font-bold warrior-text uppercase tracking-widest">
                      SPOTLIGHT: {panels[currentPanel].spotlight.label}
                    </div>
                  </motion.div>
                )}

                {/* Panel Content */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-300 text-sm leading-relaxed warrior-text"
                >
                  {panels[currentPanel].content}
                </motion.div>

                {/* Progress Indicator */}
                <div className="flex justify-center gap-2">
                  {panels.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentPanel 
                          ? 'bg-lavender-400 w-8' 
                          : index < currentPanel 
                            ? 'bg-lavender-600' 
                            : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {currentPanel === 0 && (
                    <button
                      onClick={handleSkip}
                      className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors warrior-text"
                    >
                      SKIP TOUR
                    </button>
                  )}
                  
                  {currentPanel < panels.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="flex-1 py-3 bg-lavender-600 hover:bg-lavender-700 text-white rounded-lg font-bold transition-all transform hover:scale-105 warrior-text"
                    >
                      NEXT →
                    </button>
                  ) : (
                    <button
                      onClick={handleComplete}
                      className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black rounded-lg font-bold transition-all transform hover:scale-105 warrior-text glow-gold"
                    >
                      🚀 INITIALIZE MISSION
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default WarriorModule
