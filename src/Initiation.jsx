import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNeuro } from './context/NeuroProvider'
import { supabase } from './supabase'

const Initiation = ({ onComplete }) => {
  const { triggerIdentityStrike, switchMode } = useNeuro()
  const [currentStep, setCurrentStep] = useState(0)
  const [userName, setUserName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [goldLinePosition, setGoldLinePosition] = useState(0)
  const [showScoutMission, setShowScoutMission] = useState(false)
  const [scoutAnswers, setScoutAnswers] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [scoutScore, setScoutScore] = useState(0)

  const screens = [
    {
      id: 'welcome',
      title: 'Welcome to your PrimeED Studio',
      subtitle: 'You are architect of your future.',
      type: 'intro'
    },
    {
      id: 'identity',
      title: 'How shall we address you?',
      subtitle: 'Enter your name to begin your journey.',
      type: 'input'
    },
    {
      id: 'commitment',
      title: 'The path to mastery is 50 nodes long.',
      subtitle: 'We will move at your pace.',
      type: 'commitment'
    }
  ]

  const scoutQuestions = [
    {
      id: 'frac',
      question: 'Simplify: 4/8',
      answer: '1/2',
      domain: 'Fractions'
    },
    {
      id: 'dec',
      question: 'Add: 2.5 + 1.3',
      answer: '3.8',
      domain: 'Decimals'
    },
    {
      id: 'eq',
      question: 'Solve: x + 3 = 8',
      answer: '5',
      domain: 'Equations'
    },
    {
      id: 'word',
      question: 'A pizza has 8 slices. You eat 3 slices. What fraction did you eat?',
      answer: '3/8',
      domain: 'Word Problems'
    },
    {
      id: 'mixed',
      question: 'Convert 0.25 to a fraction',
      answer: '1/4',
      domain: 'Mixed Skills'
    }
  ]

  // Gold line animation
  useEffect(() => {
    const interval = setInterval(() => {
      setGoldLinePosition(prev => (prev + 1) % 100)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const handleNameSubmit = async (e) => {
    e.preventDefault()
    if (userName.trim()) {
      setIsSubmitting(true)
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .upsert([
            {
              name: userName.trim(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
          .select()
        
        if (error) console.error('Error saving profile:', error)
      } catch (error) {
        console.error('Supabase error:', error)
      }
      
      setTimeout(() => {
        setCurrentStep(2)
        setIsSubmitting(false)
      }, 1500)
    }
  }

  const handleComplete = () => {
    triggerIdentityStrike()
    switchMode('VERVE')
    
    setTimeout(() => {
      onComplete({
        userName,
        isInitiated: true,
        step: 'completed'
      })
    }, 2000)
  }

  const handleScoutAnswer = (answer) => {
    const question = scoutQuestions[currentQuestion]
    const isCorrect = answer.toLowerCase().trim() === question.answer.toLowerCase().trim()
    
    const newAnswers = [...scoutAnswers, { question: question.id, answer, isCorrect }]
    setScoutAnswers(newAnswers)
    
    if (isCorrect) {
      setScoutScore(prev => prev + 1)
    }
    
    if (currentQuestion < scoutQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // Mission complete - calculate unlocked nodes
      const finalScore = scoutScore + (isCorrect ? 1 : 0)
      let unlockedNodes = []
      
      if (finalScore === 5) {
        // Perfect score - unlock first 10 nodes
        unlockedNodes = ['ged-001', 'ged-002', 'ged-003', 'ged-004', 'ged-005', 'ged-006', 'ged-007', 'ged-008', 'ged-009', 'ged-010']
      } else if (finalScore >= 3) {
        // Good score - unlock first 5 nodes
        unlockedNodes = ['ged-001', 'ged-002', 'ged-003', 'ged-006', 'ged-007']
      } else {
        // Basic - unlock first 3 nodes
        unlockedNodes = ['ged-001', 'ged-002', 'ged-003']
      }
      
      // Save to localStorage
      localStorage.setItem('unlockedNodes', JSON.stringify(unlockedNodes))
      
      // Show results briefly then complete
      setTimeout(() => {
        setShowScoutMission(false)
        handleComplete()
      }, 2000)
    }
  }

  const renderScreen = () => {
    const screen = screens[currentStep]
    
    return (
      <motion.div
        key={screen.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center text-center space-y-8 px-8"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-bold"
          style={{ color: '#1A1A1A' }}
        >
          {screen.title.includes('PrimeED') ? (
            <>Welcome to your <span className="font-serif">PrimeED</span> Studio</>
          ) : (
            screen.title
          )}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl font-sans"
          style={{ color: '#1A1A1A' }}
        >
          {screen.subtitle}
        </motion.p>
        
        {screen.type === 'input' && (
          <motion.form
            onSubmit={handleNameSubmit}
            className="w-full max-w-md space-y-6"
          >
            <motion.input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full px-6 py-4 text-lg font-sans rounded-lg border-2 transition-all duration-300 focus:outline-none"
              style={{ 
                borderColor: '#D4AF37',
                color: '#1A1A1A',
                backgroundColor: 'rgba(250, 249, 246, 0.8)'
              }}
              whileFocus={{ scale: 1.02 }}
            />
            <motion.button
              type="submit"
              disabled={!userName.trim() || isSubmitting}
              className="w-full px-8 py-4 rounded-lg font-sans font-semibold text-white transition-all duration-300 disabled:opacity-50"
              style={{ backgroundColor: '#D4AF37' }}
            >
              {isSubmitting ? '...' : 'Continue'}
            </motion.button>
          </motion.form>
        )}
        
        {screen.type === 'intro' && (
          <motion.button
            onClick={() => setCurrentStep(1)}
            className="px-8 py-4 rounded-lg font-sans font-semibold text-white"
            style={{ backgroundColor: '#D4AF37' }}
          >
            Begin Your Journey
          </motion.button>
        )}
        
        {screen.type === 'commitment' && (
          <div className="space-y-4">
            <motion.button
              onClick={() => setShowScoutMission(true)}
              className="px-8 py-4 rounded-lg font-sans font-semibold text-white w-full"
              style={{ backgroundColor: '#D4AF37' }}
            >
              🎯 Scout Mission (Optional)
            </motion.button>
            <motion.button
              onClick={handleComplete}
              className="px-8 py-4 rounded-lg font-sans font-semibold text-white w-full"
              style={{ backgroundColor: '#6B7280' }}
            >
              Skip to Mastery Map
            </motion.button>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#FAF9F6' }}>
      <div className="w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {renderScreen()}
        </AnimatePresence>
      </div>
      
      {/* Scout Mission Overlay */}
      <AnimatePresence>
        {showScoutMission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-yellow-500/95 to-yellow-600/95 border-2 border-yellow-400/50 rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl"
            >
              <div className="text-center space-y-6">
                {/* Mission Icon */}
                <div className="w-16 h-16 mx-auto bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🎯</span>
                </div>
                
                {/* Mission Title */}
                <h3 className="text-2xl font-bold text-black mb-2">
                  Scout Mission
                </h3>
                
                {/* Progress */}
                <div className="flex justify-center space-x-2 mb-4">
                  {scoutQuestions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index < currentQuestion ? 'bg-green-600' : 
                        index === currentQuestion ? 'bg-yellow-400' : 
                        'bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Question */}
                {currentQuestion < scoutQuestions.length ? (
                  <div className="space-y-4">
                    <div className="bg-black/20 rounded-xl p-4">
                      <p className="text-sm text-black/70 mb-2">
                        {scoutQuestions[currentQuestion].domain}
                      </p>
                      <p className="text-lg font-bold text-black">
                        {scoutQuestions[currentQuestion].question}
                      </p>
                    </div>
                    
                    {/* Answer Input */}
                    <input
                      type="text"
                      placeholder="Your answer..."
                      className="w-full px-4 py-3 rounded-lg border-2 border-yellow-400 bg-white/90 text-black placeholder-gray-500 focus:outline-none focus:border-yellow-600"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          handleScoutAnswer(e.target.value)
                          e.target.value = ''
                        }
                      }}
                    />
                    
                    {/* Submit Button */}
                    <button
                      onClick={(e) => {
                        const input = e.target.parentElement.querySelector('input')
                        if (input.value.trim()) {
                          handleScoutAnswer(input.value)
                          input.value = ''
                        }
                      }}
                      className="w-full py-3 bg-black/80 hover:bg-black text-white rounded-lg font-semibold transition"
                    >
                      Submit Answer
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-lg font-bold text-black mb-2">
                      Mission Complete!
                    </p>
                    <p className="text-black/70">
                      Score: {scoutScore}/{scoutQuestions.length}
                    </p>
                  </div>
                )}
                
                {/* Skip Button */}
                <button
                  onClick={() => {
                    setShowScoutMission(false)
                    handleComplete()
                  }}
                  className="text-black/60 hover:text-black text-sm underline"
                >
                  Skip Mission
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Initiation