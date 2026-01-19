import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { updateStartingSector } from '../services/syncService'

const RangeQual = ({ onComplete, callSign }) => {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [consecutiveIncorrect, setConsecutiveIncorrect] = useState(0)
  const [currentProblem, setCurrentProblem] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [terminationLevel, setTerminationLevel] = useState(1)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)

  // Problem generators for each level
  const problemGenerators = {
    1: () => {
      const a = Math.floor(Math.random() * 20) + 1
      const b = Math.floor(Math.random() * 20) + 1
      return { question: `${a} + ${b}`, answer: a + b, type: 'addition' }
    },
    2: () => {
      const a = Math.floor(Math.random() * 50) + 10
      const b = Math.floor(Math.random() * 30) + 1
      return { question: `${a} - ${b}`, answer: a - b, type: 'subtraction' }
    },
    3: () => {
      const a = Math.floor(Math.random() * 10) + 1
      const b = Math.floor(Math.random() * 9) + 1
      const result = a * b
      return { question: `${result} ÷ ${a}`, answer: b, type: 'division' }
    },
    4: () => {
      const whole = Math.floor(Math.random() * 10) + 1
      const decimal = Math.floor(Math.random() * 9) + 1
      return { question: `${whole}.${decimal} × 10`, answer: whole * 10 + decimal, type: 'decimal_multiplication' }
    },
    5: () => {
      const numerator = Math.floor(Math.random() * 9) + 1
      const denominator = Math.floor(Math.random() * 8) + 2
      return { question: `${numerator}/${denominator} × ${denominator}`, answer: numerator, type: 'fraction_simplification' }
    },
    6: () => {
      const base = Math.floor(Math.random() * 20) + 10
      const percent = [10, 25, 50, 75][Math.floor(Math.random() * 4)]
      return { question: `${percent}% of ${base}`, answer: (base * percent) / 100, type: 'percentage' }
    },
    7: () => {
      const a = Math.floor(Math.random() * 10) + 1
      const b = Math.floor(Math.random() * 10) + 1
      return { question: `${a}:${b} ratio, if total is ${a * 3}`, answer: a * 3, type: 'ratio' }
    },
    8: () => {
      const original = Math.floor(Math.random() * 50) + 20
      const change = [10, 20, 25, 50][Math.floor(Math.random() * 4)]
      return { question: `${original} increased by ${change}%`, answer: original * (1 + change/100), type: 'percent_change' }
    },
    9: () => {
      const x = Math.floor(Math.random() * 10) + 1
      const result = x * 3 + 5
      return { question: `3x + 5 = ${result}`, answer: x, type: 'linear_equation' }
    },
    10: () => {
      const x = Math.floor(Math.random() * 10) + 1
      const result = x * 2 - 3
      return { question: `2x - 3 = ${result}`, answer: x, type: 'linear_equation' }
    }
  }

  useEffect(() => {
    generateNewProblem()
  }, [currentLevel])

  const generateNewProblem = () => {
    const generator = problemGenerators[currentLevel]
    if (generator) {
      setCurrentProblem(generator())
      setUserAnswer('')
      setFeedback('')
    }
  }

  const handleSubmit = () => {
    if (!currentProblem || !userAnswer.trim()) return

    const checkAnswer = () => {
    setTotalQuestions(prev => prev + 1)
    const isCorrect = parseInt(userAnswer) === currentProblem.answer
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1)
      setFeedback('✅ CORRECT - ADVANCING')
      setConsecutiveIncorrect(0)
      
      setTimeout(() => {
        if (currentLevel < 10) {
          setCurrentLevel(currentLevel + 1)
          setQuestionIndex(questionIndex + 1)
        } else {
          completeRangeQual()
        }
      }, 1500)
    } else {
      const newConsecutive = consecutiveIncorrect + 1
      setConsecutiveIncorrect(newConsecutive)
      
      // User MUST reach Level 10 - no early exits
      setFeedback('❌ INCORRECT - CONTINUE TRAINING')
      setTimeout(() => {
        generateNewProblem()
      }, 1500)
    }
  }

  const completeRangeQual = async () => {
    setIsComplete(true)
    setTerminationLevel(currentLevel)
    
    // Calculate accuracy at Level 10
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
    const aiSupportLevel = accuracy >= 80 ? 1 : 5 // 1 = Low Support, 5 = High Recovery
    
    // Store AI calibration data
    localStorage.setItem('gideon_ai_support_level', String(aiSupportLevel))
    
    // Set fallback nodeId for users who complete diagnostic
    localStorage.setItem('gideon_fallback_node', 'ged-001')
    
    console.log(`AI Calibration: Accuracy ${accuracy}%, Support Level ${aiSupportLevel}`)
    
    // Save to Supabase using new syncService
    if (callSign) {
      try {
        const result = await updateStartingSector(callSign, currentLevel)
        
        if (result.error) {
          console.error('Failed to update starting sector:', result.error)
        } else {
          console.log('RangeQual completed successfully:', result)
        }
      } catch (error) {
        console.error('RangeQual completion error:', error)
      }
    }
  }

  const getLevelDescription = (level) => {
    if (level <= 2) return 'WHOLE NUMBERS'
    if (level <= 5) return 'DECIMALS/FRACTIONS'
    if (level <= 8) return 'PERCENTS/RATIOS'
    return 'BASIC ALGEBRA'
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-lavender-500/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
          style={{
            boxShadow: '0 0 50px rgba(230, 230, 250, 0.3), inset 0 0 30px rgba(230, 230, 250, 0.1)'
          }}
        >
          <div className="text-center space-y-6">
            <div className="text-4xl">🎯</div>
            <h2 className="text-2xl font-bold text-lavender-400" style={{ fontFamily: 'Courier New, monospace' }}>
              RANGE QUAL COMPLETE
            </h2>
            <div className="space-y-2">
              <div className="text-white text-lg" style={{ fontFamily: 'Courier New, monospace' }}>
                TERMINATION LEVEL: {terminationLevel}
              </div>
              <div className="text-gray-400 text-sm" style={{ fontFamily: 'Courier New, monospace' }}>
                STARTING SECTOR ASSIGNED
              </div>
            </div>
            <button
              onClick={() => onComplete(terminationLevel)}
              className="w-full py-3 bg-gradient-to-r from-lavender-600 to-lavender-700 hover:from-lavender-700 hover:to-lavender-800 text-white rounded-lg font-bold transition-all transform hover:scale-105"
              style={{ fontFamily: 'Courier New, monospace' }}
            >
              PROCEED TO THE FORGE
            </button>
          </div>
        </motion.div>
      </div>
    )
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <style jsx>{`
        .warrior-text {
          font-family: 'Courier New', monospace;
          letter-spacing: 0.05em;
        }
        .glow-lavender {
          text-shadow: 0 0 20px rgba(230, 230, 250, 0.5);
        }
        .range-panel {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(230, 230, 250, 0.2);
        }
      `}</style>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="range-panel rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
        style={{
          boxShadow: '0 0 50px rgba(230, 230, 250, 0.3), inset 0 0 30px rgba(230, 230, 250, 0.1)'
        }}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-lavender-400 glow-lavender warrior-text mb-2">
              RANGE QUALIFICATION
            </h1>
            <div className="text-gray-400 text-sm warrior-text uppercase tracking-widest">
              ADAPTIVE DIAGNOSTIC SCAN
            </div>
          </div>

          {/* Progress */}
          <div className="flex justify-between items-center">
            <div className="text-white warrior-text">
              LEVEL: {currentLevel}/10
            </div>
            <div className="text-lavender-300 warrior-text">
              {getLevelDescription(currentLevel)}
            </div>
            <div className="text-orange-400 warrior-text">
              CONSECUTIVE INCORRECT: {consecutiveIncorrect}/2
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-lavender-500 to-gold-500"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentLevel / 10) * 100}%` }}
              transition={{ duration: 0.5 }}
            >
            </motion.div>
          </div>

          {/* Problem */}
          {currentProblem && (
            <div className="text-center space-y-4">
              <div className="bg-black/50 rounded-lg p-6 border border-lavender-500/20">
                <div className="text-4xl font-bold text-white warrior-text">
                  {currentProblem.question} = ?
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
                  className="flex-1 px-4 py-3 bg-gray-800 border border-lavender-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lavender-500 warrior-text"
                />
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-lavender-600 hover:bg-lavender-700 text-white rounded-lg font-bold transition-all transform hover:scale-105 warrior-text"
                >
                  SUBMIT
                </button>
              </div>

              {/* Feedback */}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-lg font-bold warrior-text ${
                    feedback.includes('CORRECT') ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {feedback}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default RangeQual;
