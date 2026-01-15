import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ExamResults = ({ results, userName, onClose }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [animatedScores, setAnimatedScores] = useState({
    accuracy: 0,
    stability: 0,
    efficiency: 0,
    readiness: 0
  })

  useEffect(() => {
    // Animate scores on mount
    const animateScore = (key, targetValue, delay) => {
      setTimeout(() => {
        const duration = 2000
        const startTime = Date.now()
        
        const animate = () => {
          const now = Date.now()
          const progress = Math.min((now - startTime) / duration, 1)
          const current = Math.floor(progress * targetValue)
          
          setAnimatedScores(prev => ({ ...prev, [key]: current }))
          
          if (progress < 1) {
            requestAnimationFrame(animate)
          }
        }
        
        requestAnimationFrame(animate)
      }, delay)
    }

    animateScore('accuracy', results.accuracy, 200)
    animateScore('stability', results.stability, 600)
    animateScore('efficiency', results.efficiency, 1000)
    animateScore('readiness', results.readinessScore, 1400)
  }, [results])

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 80) return 'text-blue-400'
    if (score >= 70) return 'text-yellow-400'
    if (score >= 60) return 'text-orange-400'
    return 'text-red-400'
  }

  const getScoreLabel = (score) => {
    if (score >= 90) return 'EXCELLENT'
    if (score >= 80) return 'PASS READY'
    if (score >= 70) return 'GOOD'
    if (score >= 60) return 'NEEDS WORK'
    return 'RETAKE REQUIRED'
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}m ${secs}s`
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 border-2 border-gray-600/50 rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
      >
        <div className="text-center space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">
              Exam Results
            </h2>
            <button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition"
            >
              ✕
            </button>
          </div>

          {/* Main Score Display */}
          <div className="bg-black/30 rounded-xl p-6 border border-gray-600/30">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-400 mb-2">
                GIDEON READINESS SCORE
              </h3>
              <div className={`text-5xl font-black ${getScoreColor(results.readinessScore)}`}>
                {animatedScores.readiness}%
              </div>
              <div className={`text-lg font-semibold ${getScoreColor(results.readinessScore)}`}>
                {getScoreLabel(results.readinessScore)}
              </div>
            </div>

            {/* Achievement Badge */}
            {results.passed && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.5 }}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-3 mt-4"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl">🏆</span>
                  <span className="text-black font-bold">PRIME CERTIFIED</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-3 gap-4">
            {/* Accuracy */}
            <div className="bg-black/30 rounded-lg p-4 border border-green-500/30">
              <div className="text-green-400 text-xs font-semibold mb-1">ACCURACY</div>
              <div className={`text-2xl font-bold ${getScoreColor(results.accuracy)}`}>
                {animatedScores.accuracy}%
              </div>
              <div className="text-gray-400 text-xs">
                {results.correctAnswers}/{results.correctAnswers + (10 - results.correctAnswers)} correct
              </div>
            </div>

            {/* Stability */}
            <div className="bg-black/30 rounded-lg p-4 border border-blue-500/30">
              <div className="text-blue-400 text-xs font-semibold mb-1">STABILITY</div>
              <div className={`text-2xl font-bold ${getScoreColor(results.stability)}`}>
                {animatedScores.stability}%
              </div>
              <div className="text-gray-400 text-xs">
                Calm under pressure
              </div>
            </div>

            {/* Efficiency */}
            <div className="bg-black/30 rounded-lg p-4 border border-purple-500/30">
              <div className="text-purple-400 text-xs font-semibold mb-1">EFFICIENCY</div>
              <div className={`text-2xl font-bold ${getScoreColor(results.efficiency)}`}>
                {animatedScores.efficiency}%
              </div>
              <div className="text-gray-400 text-xs">
                {formatTime(results.totalTime)}
              </div>
            </div>
          </div>

          {/* Encouraging Message */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg p-4 border border-gray-600/30">
            <p className="text-gray-300 text-sm leading-relaxed">
              {results.passed 
                ? `${userName || 'Warrior'}, you've demonstrated exceptional readiness! Your accuracy, stability, and efficiency show you're prepared for the GED challenge.`
                : `${userName || 'Warrior'}, you're on the right path. Focus on the areas that need improvement and retake the exam when you feel ready.`
              }
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
            >
              {showDetails ? 'Hide' : 'Show'} Details
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition transform hover:scale-105"
            >
              Continue
            </button>
          </div>

          {/* Detailed Breakdown */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-black/20 rounded-lg p-4 border border-gray-600/30"
              >
                <h4 className="text-white font-semibold mb-3">Performance Breakdown</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Questions Answered:</span>
                    <span className="text-white">{results.correctAnswers + (10 - results.correctAnswers)}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Correct Answers:</span>
                    <span className="text-green-400">{results.correctAnswers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time Taken:</span>
                    <span className="text-white">{formatTime(results.totalTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Average Time per Question:</span>
                    <span className="text-white">{formatTime(results.totalTime / 10)}</span>
                  </div>
                </div>

                {/* Score Formula */}
                <div className="mt-4 pt-4 border-t border-gray-600/30">
                  <h5 className="text-gray-400 text-xs font-semibold mb-2">READINESS SCORE FORMULA</h5>
                  <div className="text-gray-500 text-xs">
                    (Accuracy × 50%) + (Stability × 30%) + (Efficiency × 20%)
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ExamResults
