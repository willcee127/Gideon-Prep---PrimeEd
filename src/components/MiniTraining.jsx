import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MiniTraining = ({ onComplete, terminationLevel }) => {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-amber-400 text-xl">🛡️ Initializing Training Module...</div>
      </div>
    )
  }

  const trainingPhases = [
    {
      title: "PHASE 1: VERVE",
      subtitle: "Healing & Foundation",
      color: "lavender",
      icon: "🌱",
      description: "Your first phase focuses on restoring mathematical confidence and creating a sanctuary for learning. VERVE represents the gentle healing needed to overcome math anxiety.",
      benefits: [
        "🧘‍♀️ Release calculation anxiety",
        "🏛️ Create learning sanctuary", 
        "✨ Awaken dormant potential",
        "💜 Build mathematical confidence"
      ]
    },
    {
      title: "PHASE 2: AURA", 
      subtitle: "Territory & Conquest",
      color: "cyan",
      icon: "⚡",
      description: "AURA phase is about systematic territory conquest. You'll master GED sectors with tactical precision and build operational confidence.",
      benefits: [
        "🎯 Master GED sectors systematically",
        "🗺️ Conquer mathematical territories",
        "🔥 Forge tactical precision",
        "💙 Build operational confidence"
      ]
    },
    {
      title: "PHASE 3: FORGE",
      subtitle: "Integration & Mastery", 
      color: "amber",
      icon: "🏆",
      description: "FORGE phase integrates all skills into combat-ready mastery. This is where you achieve GED sovereignty and join the elite warriors.",
      benefits: [
        "👁️ Develop mathematical intuition",
        "⚡ Integrate combat-ready skills",
        "🎖️ Join elite warriors",
        "🏆 Achieve GED sovereignty"
      ]
    }
  ]

  const handleNext = () => {
    if (currentPhase < trainingPhases.length - 1) {
      setCurrentPhase(currentPhase + 1)
    } else {
      onComplete()
    }
  }

  const getColorClasses = (color) => {
    const colorMap = {
      lavender: {
        bg: 'from-lavender-600 to-lavender-700',
        text: 'text-lavender-400',
        border: 'border-lavender-500/30',
        glow: 'shadow-lavender-500/20'
      },
      cyan: {
        bg: 'from-cyan-600 to-cyan-700', 
        text: 'text-cyan-400',
        border: 'border-cyan-500/30',
        glow: 'shadow-cyan-500/20'
      },
      amber: {
        bg: 'from-slate-800 to-slate-900',
        text: 'text-amber-400', 
        border: 'border-slate-700/30',
        glow: 'shadow-amber-400/10'
      }
    }
    return colorMap[color] || colorMap.lavender
  }

  const currentPhaseData = trainingPhases[currentPhase]
  const colors = getColorClasses(currentPhaseData.color)

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .warrior-text {
          font-family: 'Courier New', monospace;
          letter-spacing: 0.05em;
        }
        
        .glow-${currentPhaseData.color} {
          text-shadow: 0 0 20px ${currentPhaseData.color === 'lavender' ? 'rgba(230, 230, 250, 0.5)' : 
                           currentPhaseData.color === 'cyan' ? 'rgba(0, 191, 255, 0.5)' : 
                           'rgba(255, 191, 0, 0.5)'};
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl w-full"
        >
          {/* Phase Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                y: [0, -5, 0]
              }}
              transition={{ 
                scale: { duration: 3, repeat: Infinity },
                y: { duration: 3, repeat: Infinity }
              }}
              className="text-8xl mb-4"
            >
              {currentPhaseData.icon}
            </motion.div>
          </motion.div>

          {/* Phase Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={`bg-gradient-to-br ${colors.bg} border-2 ${colors.border} rounded-2xl p-8 shadow-2xl ${colors.glow}`}
            style={{
              boxShadow: `0 0 50px ${colors.glow}, inset 0 0 30px ${colors.glow.replace('0.2', '0.1')}`
            }}
          >
            <div className="text-center space-y-6">
              {/* Phase Title */}
              <div>
                <h1 className={`text-4xl font-black ${colors.text} mb-2 warrior-text glow-${currentPhaseData.color}`}>
                  {currentPhaseData.title}
                </h1>
                <p className={`${colors.text} text-lg warrior-text`}>
                  {currentPhaseData.subtitle}
                </p>
              </div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-gray-200 text-lg leading-relaxed warrior-text"
              >
                {currentPhaseData.description}
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="space-y-3"
              >
                {currentPhaseData.benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="text-white warrior-text flex items-center space-x-3"
                  >
                    <span className="text-xl">{benefit.split(' ')[0]}</span>
                    <span>{benefit.split(' ').slice(1).join(' ')}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Progress Indicator */}
              <div className="flex justify-center gap-2">
                {trainingPhases.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentPhase 
                        ? `${colors.text} w-8` 
                        : index < currentPhase 
                          ? 'bg-gray-500' 
                          : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>

              {/* Action Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className={`w-full py-4 bg-gradient-to-r ${colors.bg} hover:opacity-90 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 warrior-text`}
              >
                {currentPhase < trainingPhases.length - 1 ? 'NEXT PHASE →' : '🚀 BEGIN TRAINING'}
              </motion.button>
            </div>
          </motion.div>

          {/* Co-Pilot Introduction */}
          {currentPhase === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="mt-8 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-cyan-500/30 rounded-xl p-6"
            >
              <div className="text-center space-y-4">
                <div className="text-2xl">🤖</div>
                <h3 className="text-xl font-bold text-cyan-400 warrior-text">
                  SOCRATIC CO-PILOT
                </h3>
                <p className="text-gray-300 warrior-text">
                  Your AI companion that guides you through challenges without giving answers. 
                  It asks questions to help you discover solutions yourself, building true understanding and confidence.
                </p>
                <div className="flex justify-center gap-4 text-sm">
                  <div className="text-cyan-300 warrior-text">💬 Step-by-step guidance</div>
                  <div className="text-cyan-300 warrior-text">🧠 Builds understanding</div>
                  <div className="text-cyan-300 warrior-text">🛡️ Safety net</div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  )
}

export default MiniTraining
