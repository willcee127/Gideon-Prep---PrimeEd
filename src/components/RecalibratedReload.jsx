import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const RecalibratedReload = ({ 
  originalProblem, 
  onPrerequisiteComplete, 
  onReturnToOriginal 
}) => {
  const [prerequisiteProblem, setPrerequisiteProblem] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isPrerequisiteComplete, setIsPrerequisiteComplete] = useState(false)

  // Prerequisite problem generators based on failed concept
  const prerequisiteGenerators = {
    'division': () => {
      const a = Math.floor(Math.random() * 10) + 1
      const b = Math.floor(Math.random() * 10) + 1
      return { 
        question: `${a} × ${b}`, 
        answer: a * b, 
        type: 'multiplication',
        explanation: 'Division is the inverse of multiplication. Master multiplication first.'
      }
    },
    'fraction_simplification': () => {
      const a = Math.floor(Math.random() * 10) + 1
      const b = Math.floor(Math.random() * 10) + 1
      return { 
        question: `${a} + ${b}`, 
        answer: a + b, 
        type: 'addition',
        explanation: 'Fraction operations require strong basic arithmetic skills.'
      }
    },
    'percentage': () => {
      const base = Math.floor(Math.random() * 20) + 10
      return { 
        question: `${base} × 10`, 
        answer: base * 10, 
        type: 'multiplication',
        explanation: 'Percentages are based on multiplication. Strengthen your foundation.'
      }
    },
    'linear_equation': () => {
      const x = Math.floor(Math.random() * 10) + 1
      return { 
        question: `x + ${x} = ${x * 2}`, 
        answer: x, 
        type: 'basic_algebra',
        explanation: 'Linear equations build on basic arithmetic understanding.'
      }
    },
    'decimal_operations': () => {
      const a = Math.floor(Math.random() * 10) + 1
      const b = Math.floor(Math.random() * 10) + 1
      return { 
        question: `${a} + ${b}`, 
        answer: a + b, 
        type: 'addition',
        explanation: 'Decimal operations require solid whole number skills.'
      }
    }
  }

  useEffect(() => {
    generatePrerequisiteProblem()
  }, [originalProblem])

  const generatePrerequisiteProblem = () => {
    const failedType = originalProblem?.type || 'addition'
    const generator = prerequisiteGenerators[failedType] || prerequisiteGenerators['addition']
    
    if (generator) {
      setPrerequisiteProblem(generator())
      setUserAnswer('')
      setFeedback('')
      setIsPrerequisiteComplete(false)
    }
  }

  const handleSubmit = () => {
    if (!prerequisiteProblem || !userAnswer.trim()) return

    const isCorrect = parseInt(userAnswer) === prerequisiteProblem.answer
    
    if (isCorrect) {
      setFeedback('✅ PREREQUISITE MASTERED - RETURNING TO ORIGINAL')
      setIsPrerequisiteComplete(true)
      
      setTimeout(() => {
        onPrerequisiteComplete()
      }, 2000)
    } else {
      setFeedback('❌ REVIEW THE CONCEPT AND TRY AGAIN')
      setTimeout(() => {
        setUserAnswer('')
        setFeedback('')
      }, 2000)
    }
  }

  if (isPrerequisiteComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-green-500/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
          style={{
            boxShadow: '0 0 50px rgba(0, 255, 0, 0.3), inset 0 0 30px rgba(0, 255, 0, 0.1)'
          }}
        >
          <div className="text-center space-y-6">
            <div className="text-4xl">🔧</div>
            <h2 className="text-2xl font-bold text-green-400" style={{ fontFamily: 'Courier New, monospace' }}>
              RECALIBRATION COMPLETE
            </h2>
            <div className="text-white text-sm" style={{ fontFamily: 'Courier New, monospace' }}>
              Foundation strengthened. Ready for original problem.
            </div>
            <button
              onClick={onReturnToOriginal}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-bold transition-all transform hover:scale-105"
              style={{ fontFamily: 'Courier New, monospace' }}
            >
              RETURN TO MISSION
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <style jsx>{`
        .warrior-text {
          font-family: 'Courier New', monospace;
          letter-spacing: 0.05em;
        }
        .glow-green {
          text-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
        }
        .recalibration-panel {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 255, 0, 0.2);
        }
      `}</style>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="recalibration-panel rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
        style={{
          boxShadow: '0 0 50px rgba(0, 255, 0, 0.3), inset 0 0 30px rgba(0, 255, 0, 0.1)'
        }}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-green-400 glow-green warrior-text mb-2">
              RECALIBRATED RELOAD
            </h1>
            <div className="text-gray-400 text-sm warrior-text uppercase tracking-widest">
              PREREQUISITE REINFORCEMENT
            </div>
          </div>

          {/* Original Problem Context */}
          <div className="bg-black/50 rounded-lg p-4 border border-red-500/20">
            <div className="text-red-400 text-xs warrior-text uppercase tracking-widest mb-2">
              Original Problem (Failed)
            </div>
            <div className="text-white text-lg warrior-text">
              {originalProblem?.question || 'Unknown'}
            </div>
          </div>

          {/* Prerequisite Problem */}
          {prerequisiteProblem && (
            <div className="space-y-4">
              <div className="bg-black/50 rounded-lg p-4 border border-green-500/20">
                <div className="text-green-400 text-xs warrior-text uppercase tracking-widest mb-2">
                  Prerequisite Problem
                </div>
                <div className="text-3xl font-bold text-white warrior-text mb-2">
                  {prerequisiteProblem.question} = ?
                </div>
                <div className="text-gray-400 text-sm warrior-text">
                  {prerequisiteProblem.explanation}
                </div>
              </div>

              {/* Answer Input */}
              <div className="flex gap-4">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Enter your answer"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 warrior-text"
                />
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-all transform hover:scale-105 warrior-text"
                >
                  SUBMIT
                </button>
              </div>

              {/* Feedback */}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-lg font-bold warrior-text text-center ${
                    feedback.includes('MASTERED') ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {feedback}
                </motion.div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/20">
            <div className="text-blue-400 text-sm warrior-text">
              <strong>STRATEGY:</strong> Master this prerequisite to strengthen your foundation. 
              Once complete, you'll return to the original problem with renewed understanding.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default RecalibratedReload
