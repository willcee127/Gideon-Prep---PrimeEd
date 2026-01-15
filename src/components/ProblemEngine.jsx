import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNeuro } from '../context/NeuroProvider'
import { supabase, memoryAPI } from '../supabase'
import { getNodeById } from '../data/mathContent'
import { problemForge } from '../services/ProblemForge'
// import { missionCoach } from '../services/MissionCoach'

const ProblemEngine = ({ nodeId, onProblemComplete, onSuccess, userName }) => {
  const { 
    triggerIdentityStrike, 
    triggerCorrectAnswerStrike,
    switchMode, 
    isInVerveMode, 
    isInAuraMode, 
    isInForgeMode,
    stressLevel,
    isStressed,
    isStalled,
    isJittery,
    isRaging,
    resetStress
  } = useNeuro()
  
  const [currentMode, setCurrentMode] = useState('concrete')
  const [currentProblem, setCurrentProblem] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [consecutiveMisses, setConsecutiveMisses] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [mentalModel, setMentalModel] = useState('')
  const [auraUsageCount, setAuraUsageCount] = useState(0)
  const [showMissionSummary, setShowMissionSummary] = useState(false)
  const [autoAuraTrigger, setAutoAuraTrigger] = useState(false)
  const [failureCount, setFailureCount] = useState(0)
  const [showGhostCalcWarning, setShowGhostCalcWarning] = useState(false)
  const [doubleReps, setDoubleReps] = useState(false)
  const [isForgeProblem, setIsForgeProblem] = useState(false)
  const [showTeachingHUD, setShowTeachingHUD] = useState(false)
  const [teachingStep, setTeachingStep] = useState(0)
  const [missionCoachMessage, setMissionCoachMessage] = useState('')
  const [combatCommendation, setCombatCommendation] = useState('')
  const [showCombatCommendation, setShowCombatCommendation] = useState(false)

  // Get node content from the library
  const nodeContent = getNodeById(nodeId)
  const problems = nodeContent?.problems || []

  // Mission Coach Integration
  const getMissionCoachCoaching = useCallback(async (problem) => {
    try {
      const studentProgress = {
        consecutiveMisses: consecutiveMisses,
        streak: streak,
        totalCorrect: correctAnswers
      }
      
      const coaching = await missionCoach.generateAuraCoaching(problem, studentProgress)
      setMissionCoachMessage(coaching.message)
      return coaching.message
    } catch (error) {
      console.error('Mission Coach error:', error)
      return 'Warrior, let the Command Calc be your tactical advantage in this operation.'
    }
  }, [consecutiveMisses, streak, correctAnswers])

  // Combat Commendation System
  const checkForCombatCommendation = useCallback(() => {
    if (correctAnswers > 0 && correctAnswers % 5 === 0) {
      const studentStats = {
        totalCorrect: correctAnswers,
        streak: streak,
        commandCalcUsage: auraUsageCount,
        problemsSolved: correctAnswers,
        accuracyRate: Math.round((correctAnswers / (correctAnswers + failureCount)) * 100),
        recentSkills: currentProblem?.tacticalTip ? [currentProblem.tacticalTip] : []
      }
      
      missionCoach.generateCombatCommendation(studentStats).then(commendation => {
        setCombatCommendation(commendation.message)
        setShowCombatCommendation(true)
        
        // Hide commendation after 5 seconds
        setTimeout(() => {
          setShowCombatCommendation(false)
        }, 5000)
      })
    }
  }, [correctAnswers, streak, auraUsageCount, failureCount, currentProblem])

  // Check for commendations on correct answers
  useEffect(() => {
    if (correctAnswers > 0) {
      checkForCombatCommendation()
    }
  }, [correctAnswers, checkForCombatCommendation])

  // AI Problem Forge Function
  const fetchForgeProblem = async (zone, difficulty) => {
    try {
      // Use the AI Problem Forge Service
      const forgedProblem = await problemForge.forgeProblem(zone, difficulty)
      
      if (forgedProblem) {
        setIsForgeProblem(true)
        return forgedProblem
      }
      
      return null
    } catch (error) {
      console.error('Failed to forge problem:', error)
      return null
    }
  }

  const generateMentalModel = (problem) => {
    if (!problem) return ''
    
    // Generate mental models based on problem type
    if (problem.equation) {
      if (problem.equation.includes('x') && problem.equation.includes('=')) {
        return `Think of this like a balance scale. To keep it even, whatever we do to one side, we must do to the other. If we divide the left side by 2, we do the same to the right!`
      } else if (problem.equation.includes('y') && problem.equation.includes('=')) {
        return `Imagine this as a recipe. The equation tells us exactly how to combine ingredients to get our result. Follow the steps precisely!`
      }
    }
    
    if (problem.method === 'elimination') {
      return `Think of this like solving a puzzle with two pieces. Sometimes we can combine the pieces to eliminate one variable, making it easier to see the solution!`
    }
    
    // Add tactical tip if in AURA mode and node has tactical tip
    if (isInAuraMode && nodeContent?.tacticalTip) {
      if (currentProblem?.difficulty >= 4) {
        setFeedback('🧠 This stronghold requires your machinery. Don\'t carry the weight yourself—use Command Calc.')
      }
      return `Command Center Intelligence: ${nodeContent.tacticalTip}`
    }
    
    if (problem.method === 'substitution') {
      return `This is like a detective story. We find one clue, then use it to uncover the next piece of the mystery!`
    }
    
    if (problem.method === 'factoring') {
      return `Think of this like breaking down a big number into its building blocks. We're finding the pieces that multiply together to give us our original number!`
    }
    
    if (problem.concept === 'slope') {
      return `Imagine walking up a hill. The slope tells us how steep the hill is - how much we go up for every step we take forward!`
    }
    
    if (problem.concept === 'y-intercept') {
      return `Think of this as where our journey begins on the y-axis. It's our starting point before we start climbing the hill!`
    }
    
    // Default mental model
    return `Every problem has a story. Let's break it down step by step, like following a recipe. Each step builds on the last!`
  }

  const getProblemForMode = useCallback(() => {
    return problems[currentMode] || problems.concrete
  }, [currentMode])

  const selectRandomProblem = useCallback(async () => {
    if (problems.length === 0) {
      // Use AI Problem Forge when no problems available
      const zone = nodeContent?.sector || 'Alpha'
      const difficulty = Math.min(5, Math.max(3, Math.floor(score / 5) + 1))
      const forgedProblem = await fetchForgeProblem(zone, difficulty)
      if (forgedProblem) {
        setCurrentProblem(forgedProblem)
        setUserAnswer('')
        setFeedback('')
        setFailureCount(0)
        return
      }
    }
    
    const randomProblem = problems[Math.floor(Math.random() * problems.length)]
    setCurrentProblem(randomProblem)
    setUserAnswer('')
    setFeedback('')
    setFailureCount(0) // Reset failure count for new problem
    setIsForgeProblem(false) // Reset forge problem flag
  }, [problems, nodeContent, score, fetchForgeProblem])

  useEffect(() => {
    selectRandomProblem()
  }, [nodeId, selectRandomProblem])

  // Check for Command Calculator requirement
  useEffect(() => {
    if (currentProblem?.requiresGhostCalc && !showGhostCalcWarning) {
      setShowGhostCalcWarning(true)
      setFeedback('⚠️ Warning: Tactical Tool Required - Don\'t carry the weight yourself—use Command Calc.')
    }
  }, [currentProblem, showGhostCalcWarning])

  // Command Calculator pulse effect
  useEffect(() => {
    if (currentProblem?.requiresGhostCalc) {
      // Add pulse animation class to Command Calc icon
      const commandCalcIcon = document.querySelector('.command-calc-icon')
      if (commandCalcIcon) {
        commandCalcIcon.classList.add('animate-pulse', 'shadow-[0_0_15px_rgba(255,215,0,0.6)]')
      }
    } else {
      // Remove pulse animation
      const commandCalcIcon = document.querySelector('.command-calc-icon')
      if (commandCalcIcon) {
        commandCalcIcon.classList.remove('animate-pulse', 'shadow-[0_0_15px_rgba(255,215,0,0.6)]')
      }
    }
  }, [currentProblem?.requiresGhostCalc])

  // Auto-switch to Concrete mode if user is stressed
  useEffect(() => {
    if ((isRaging || isJittery || isStalled) && currentMode !== 'concrete') {
      setCurrentMode('concrete')
      switchMode('VERVE') // Force VERVE mode
      setFeedback('🧠 Switching to Concrete mode for better understanding')
      resetStress() // Reset stress after mode switch
    }
  }, [isRaging, isJittery, isStalled, currentMode, switchMode, setCurrentMode, setFeedback, resetStress])

  // Mentor Dialogue System
  const getMentorMessage = (state, problem, userName) => {
    switch (state) {
      case 'linen':
        return `🧠 The terrain is shifting. Steady your mind, ${userName}. Let's look at the blocks (Concrete Mode) to find the path.`
      case 'gold':
        return `✨ Precision achieved! Your logic is sharp, ${userName}. The Linen State transforms into Gold.`
      case 'stressed':
        return `🧘 A warrior knows when to breathe. The Linen State is active, ${userName}. Let the pressure fade.`
      default:
        return `💡 Strategic insight: Focus on the position of the digit. Every place holds power.`
    }
  }

  // Neuro-Feedback Loop
  const checkAnswer = useCallback(async () => {
    if (!currentProblem || !userAnswer.trim() || isProcessing) return
    
    setIsProcessing(true)
    
    // Handle both old format (answer) and new format (correct)
    const correctAnswer = currentProblem.correct || currentProblem.answer
    const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()
    
    if (isCorrect) {
      // Calculate rep value based on Command Calculator requirement
      const repValue = currentProblem?.requiresGhostCalc ? 2 : 1;
      
      // Update scores with proper rep value
      setScore(prev => prev + repValue)
      setStreak(prev => prev + 1)
      setCorrectAnswers(prev => prev + 1)
      setConsecutiveMisses(0) // Reset consecutive misses
      setFailureCount(0) // Reset failure count
      
      // Set feedback based on rep value
      if (repValue === 2) {
        setDoubleReps(true)
        setFeedback('⚡ TACTICAL MASTERY! +2 Reps for using Command Calculator!')
      } else {
        setDoubleReps(false)
        setFeedback('Excellent! You\'re building momentum!')
      }
      
      // Visual pulse effect
      setTimeout(() => {
        setFeedback('🌟 Great job! Keep going!')
      }, 500)
      
      // Update mastery in database
      try {
        const userId = localStorage.getItem('gideon_user_name') || 'anonymous'
        await supabase
          .from('mastery_ledger')
          .insert([
            {
              user_id: userId,
              node_id: nodeId,
              status: 'mastered',
              created_at: new Date().toISOString()
            }
          ])
        
        console.log('Mastery recorded for node:', nodeId)
      } catch (error) {
        console.error('Failed to record mastery:', error)
      }
      
      // Call success callback
      if (onSuccess) {
        onSuccess()
      }
      
      // Check for problem set completion
      if (score >= 4) { // Complete after 5 correct answers
        setShowMissionSummary(true)
        if (onProblemComplete) {
          onProblemComplete(nodeId, {
            correctAnswers: correctAnswers + 1,
            auraUsage: auraUsageCount,
            nodeIcon: nodeContent?.icon || '🧮'
          })
        }
      }
      
      setTimeout(() => {
        setIsProcessing(false)
        setUserAnswer('')
        setFeedback('')
        selectRandomProblem()
      }, 2000)
      
    } else {
      // Incorrect answer - check for consecutive misses
      const newConsecutiveMisses = consecutiveMisses + 1
      const newFailureCount = failureCount + 1
      setConsecutiveMisses(newConsecutiveMisses)
      setFailureCount(newFailureCount)
      setStreak(0)
      
      // Show Teaching HUD after 1 miss (more forgiving)
      if (newConsecutiveMisses >= 1 && !showTeachingHUD) {
        setShowTeachingHUD(true)
        setTeachingStep(0)
      }
      
      // Aura Coach trigger after 2 failures
      if (newFailureCount === 2 && !showAuraCoach) {
        setShowAuraCoach(true)
        switchMode('AURA')
        
        // Get Mission Coach coaching
        getMissionCoachCoaching(currentProblem).then(coachingMessage => {
          setFeedback(`🧠 MISSION COACH: ${coachingMessage}`)
        })
        
        resetStress()
        
        // Generate mental model
        if (currentProblem) {
          const model = generateMentalModel(currentProblem)
          setMentalModel(model)
          setAuraUsageCount(prev => prev + 1)
        }
        
        setTimeout(() => {
          setShowAuraCoach(false)
          setShowReview(true)
        }, 4000)
      }
      // Auto-trigger Aura after 2 consecutive misses
      else if (newConsecutiveMisses >= 2 && !autoAuraTrigger) {
        setAutoAuraTrigger(true)
        switchMode('AURA')
        setFeedback('💨 Feeling frustrated? Let\'s take a moment to breathe and reset your mind.')
        resetStress()
        
        // Log auto-triggered Aura session
        try {
          const userId = localStorage.getItem('gideon_user_name') || 'anonymous'
          supabase
            .from('trauma_logs')
            .insert([
              {
                user_id: userId,
                event_type: 'auto_aura_trigger',
                trigger: 'consecutive_misses',
                stress_level_before: stressLevel,
                created_at: new Date().toISOString()
              }
            ])
        } catch (error) {
          console.error('Failed to log auto Aura trigger:', error)
        }
        
        setTimeout(() => {
          setAutoAuraTrigger(false)
          setFeedback('Now, let\'s look at the solution together.')
          setShowReview(true)
        }, 3000)
      } else {
        setFeedback('Not quite right. Would you like to review the solution?')
        setShowReview(true)
      }
      
      setTimeout(() => {
        setIsProcessing(false)
      }, 1000)
    }
  }, [currentProblem, userAnswer, consecutiveMisses, streak, score, nodeId, onSuccess, onProblemComplete, selectRandomProblem, showTeachingHUD, showAuraCoach, autoAuraTrigger, failureCount, isProcessing, switchMode, resetStress, stressLevel, auraUsageCount, correctAnswers, nodeContent, generateMentalModel])

  const handleReview = () => {
    if (currentProblem) {
      const model = generateMentalModel(currentProblem)
      setMentalModel(model)
      setAuraUsageCount(prev => prev + 1) // Track AURA usage
    }
    switchMode('AURA') // Switch to AURA (Blue) mode
    setShowReview(false)
    setFeedback('🌊 Switching to review mode. Let\'s break this down together.')
  }

  const renderPictorialMode = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Pictorial Mode</h3>
          <p className="text-white/70">Use visual models to understand the problem</p>
        </div>
        
        {currentProblem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="text-white text-lg font-semibold mb-4 text-center">
              {currentProblem.question}
            </div>
            
            {/* Visual Diagram */}
            <div className="flex justify-center mb-6">
              {currentProblem.diagram === 'pizza' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative"
                >
                  {/* Pizza slices */}
                  <div className="w-32 h-32 relative">
                    <div className="absolute inset-0 rounded-full bg-yellow-500 border-4 border-yellow-600">
                      <div className="absolute top-0 left-1/2 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-transparent transform rotate-45 origin-top-left"></div>
                      <div className="absolute top-8 right-1/2 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-transparent transform -rotate-45 origin-top-right"></div>
                      <div className="absolute top-1/2 left-1/2 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-transparent transform rotate-45 origin-top-left"></div>
                      <div className="absolute top-1/2 right-1/2 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-transparent transform -rotate-45 origin-top-right"></div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-transparent transform rotate-45 origin-top-left"></div>
                    <div className="absolute bottom-0 left-1/2 w-0 h-0 border-l-8 border-l-transparent border-b-8 border-b-transparent transform -rotate-45 origin-bottom-left"></div>
                    <div className="absolute bottom-0 right-1/2 w-0 h-0 border-l-8 border-l-transparent border-b-8 border-b-transparent transform rotate-45 origin-bottom-right"></div>
                  </div>
                  {/* Missing slice indicator */}
                  <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    1/4
                  </div>
                </motion.div>
              )}
              
              {currentProblem.diagram === 'bars' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex space-x-4"
                >
                  {currentProblem.bars?.map((bar, index) => (
                    <motion.div
                      key={index}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: index * 0.2 }}
                      className="relative"
                    >
                      <div className="w-12 h-24 bg-blue-500 rounded relative">
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-blue-600 rounded-b"
                          style={{ height: `${(bar / 3) * 24}px` }}
                        />
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-white text-xs font-semibold">
                          {bar}/3
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              
              {currentProblem.diagram === 'percentage' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative"
                >
                  <div className="w-32 h-32 relative">
                    <div className="absolute inset-2 bg-green-500 rounded-full"></div>
                    <div 
                      className="absolute inset-2 bg-green-600 rounded-full"
                      style={{
                        clipPath: `polygon(50% 0%, ${100 - currentProblem.value}% 0%, ${100 - currentProblem.value}% 100%, 50% 100%)`
                      }}
                    ></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm font-bold">
                      {currentProblem.value}%
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  const renderAbstractMode = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Abstract Mode</h3>
          <p className="text-white/70">Solve using algebraic thinking</p>
        </div>
        
        {currentProblem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="text-white text-lg font-semibold mb-6 text-center font-mono">
              {currentProblem.equation}
            </div>
            
            <div className="text-center text-sm text-white/60 mb-4">
              Solve for: <span className="text-yellow-400 font-bold">{currentProblem.variable}</span>
            </div>
            
            {consecutiveMisses >= 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-orange-400 text-sm"
              >
                💡 Strategic insight: Focus on the position of the digit. Every place holds power.
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-gray-800 rounded-lg p-6">
      {/* Mode Selector */}
      <div className="flex justify-center mb-6 space-x-2">
        {['concrete', 'pictorial', 'abstract'].map((mode) => (
          <button
            key={mode}
            onClick={() => setCurrentMode(mode)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              currentMode === mode
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* Score Display */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-white">
          <span className="text-sm">Score: </span>
          <span className="text-xl font-bold text-yellow-400 ml-2">{score}</span>
        </div>
        <div className="text-white">
          <span className="text-sm">Streak: </span>
          <span className="text-xl font-bold text-green-400 ml-2">{streak}</span>
        </div>
      </div>

      {/* Problem Display */}
      <div className="min-h-[400px]">
        {/* Forge Problem Indicator */}
        {isForgeProblem && (
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-2 bg-purple-600/20 border border-purple-400/30 rounded-lg px-3 py-2">
              <span className="text-lg">⚒️</span>
              <span className="text-purple-300 text-sm font-semibold">AI FORGED PROBLEM</span>
              <span className="text-purple-400 text-xs">Adapted to your progress</span>
            </div>
          </div>
        )}
        
        {currentMode === 'concrete' && renderConcreteMode()}
        {currentMode === 'pictorial' && renderPictorialMode()}
        {currentMode === 'abstract' && renderAbstractMode()}
      </div>

      {/* Command Calculator Warning */}
      {showGhostCalcWarning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-blue-600 border-2 border-blue-400 rounded-xl p-6 max-w-md mx-4 shadow-2xl"
          >
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-blue-400 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Tactical Tool Required</h3>
              <p className="text-white/90">Don't carry the weight yourself—use Command Calculator!</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-white/20 rounded-full"></div>
                  <span className="text-white/80">High-level problems require your machinery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-white/20 rounded-full"></div>
                  <span className="text-white/80">Level 4-5 problems need tactical tools</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowGhostCalcWarning(false)}
              className="w-full py-3 bg-white text-blue-600 rounded-lg font-semibold transition hover:bg-gray-100"
            >
              I Understand - Continue
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Double Reps Indicator */}
      {doubleReps && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
            <span className="text-xl font-bold">⚡ DOUBLE REPS!</span>
            <span className="text-sm">+2 for Ghost Calc mastery</span>
          </div>
        </motion.div>
      )}

      {/* Combat Commendation */}
      {showCombatCommendation && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 border-2 border-yellow-400 rounded-lg px-6 py-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-black font-bold">⭐</span>
              </div>
              <div>
                <h4 className="text-yellow-900 font-bold text-sm">COMBAT COMMENDATION</h4>
                <p className="text-yellow-800 text-xs font-medium">{combatCommendation}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Teaching HUD */}
      {showTeachingHUD && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-green-900/95 to-green-800/95 border-2 border-green-400/50 rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
          >
            <div className="text-center space-y-6">
              {/* Teaching Icon */}
              <div className="w-16 h-16 mx-auto bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-3xl">🎯</span>
              </div>
              
              {/* Teaching Title */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-green-300">
                  HOW TO WIN
                </h3>
                <p className="text-green-200/80 text-sm">
                  Let me show you the exact sequence to solve this problem
                </p>
              </div>
              
              {/* Problem Display */}
              <div className="bg-black/30 rounded-xl p-4 border border-green-400/30">
                <h4 className="text-green-400 font-semibold text-sm mb-2">PROBLEM:</h4>
                <p className="text-green-200 text-lg">
                  {currentProblem?.problem || currentProblem?.question}
                </p>
              </div>
              
              {/* Tactical Tip */}
              <div className="bg-black/30 rounded-xl p-4 border border-green-400/30">
                <h4 className="text-green-400 font-semibold text-sm mb-2">TACTICAL TIP:</h4>
                <p className="text-green-200 text-sm">
                  {currentProblem?.tacticalTip || nodeContent?.tacticalTip}
                </p>
              </div>
              
              {/* Step-by-Step Explanation */}
              <div className="bg-black/30 rounded-xl p-4 border border-green-400/30">
                <h4 className="text-green-400 font-semibold text-sm mb-2">STEP-BY-STEP:</h4>
                <div className="space-y-2">
                  {currentProblem?.explanation ? (
                    <p className="text-green-200 text-sm leading-relaxed">
                      {currentProblem.explanation}
                    </p>
                  ) : currentProblem?.solution ? (
                    currentProblem.solution.map((step, index) => (
                      <p key={index} className="text-green-200 text-sm">
                        {step}
                      </p>
                    ))
                  ) : (
                    <p className="text-green-200 text-sm">
                      Follow the tactical tip above to solve this problem.
                    </p>
                  )}
                </div>
              </div>
              
              {/* Command Calculator Pulse */}
              {currentProblem?.requiresGhostCalc && (
                <div className="bg-black/30 rounded-xl p-4 border border-yellow-400/30">
                  <h4 className="text-yellow-400 font-semibold text-sm mb-2">COMMAND CALCULATOR SEQUENCE:</h4>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(255,215,0,0.6)]">
                      <span className="text-black font-bold">👻</span>
                    </div>
                    <p className="text-yellow-200 text-sm">
                      Use the Command Calculator with the tactical sequence above
                    </p>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowTeachingHUD(false)
                    setTeachingStep(0)
                    setUserAnswer('')
                    setFeedback('Now try it with the tactical guidance!')
                  }}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                >
                  I'VE GOT IT
                </button>
                <button
                  onClick={() => {
                    setShowTeachingHUD(false)
                    setTeachingStep(0)
                    setUserAnswer('')
                    setFeedback('Skipping this problem...')
                    selectRandomProblem()
                  }}
                  className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition"
                >
                  Skip
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Answer Input */}
      <div className="space-y-4">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
          placeholder="Type your answer here..."
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
          disabled={isProcessing}
        />
        
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center p-3 rounded-lg ${
              feedback.includes('right') || feedback.includes('Great') ? 'bg-green-600' : 'bg-orange-600'
            }`}
          >
            {feedback}
          </motion.div>
        )}
        
        {/* Mental Model Display */}
        {mentalModel && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <h4 className="text-blue-300 font-semibold text-sm">Mental Model</h4>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              {mentalModel}
            </p>
            
            {/* Step-by-step solution if available */}
            {currentProblem?.solution && (
              <div className="mt-3 pt-3 border-t border-blue-500/30">
                <p className="text-blue-300 font-semibold text-xs mb-2">Step-by-Step:</p>
                <div className="space-y-1">
                  {currentProblem.solution.map((step, index) => (
                    <p key={index} className="text-blue-200 text-xs">
                      {step}
                    </p>
                  ))}
                </div>
              </div>
            )}
            
            {/* Warm Reinforcement */}
            <div className="mt-3 pt-3 border-t border-blue-500/30">
              <p className="text-blue-300 text-xs italic">
                💙 This isn't a mistake; it's a recalibration. You're getting stronger.
              </p>
            </div>
            
            {/* Re-engage Button */}
            <button
              onClick={() => {
                setMentalModel('')
                setUserAnswer('')
                setFeedback('')
                selectRandomProblem()
                switchMode('VERVE') // Switch back to VERVE mode
              }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition"
            >
              RE-ENGAGE VERVE
            </button>
          </motion.div>
        )}
        
        {/* Review button for incorrect answers */}
        {showReview && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleReview}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            📖 Review Solution
          </motion.button>
        )}
        
        <div className="flex space-x-3">
          <button
            onClick={checkAnswer}
            disabled={isProcessing || !userAnswer.trim()}
            className="flex-1 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] touch-manipulation"
          >
            {isProcessing ? 'Checking...' : 'Check Answer'}
          </button>
          
          {showReview && (
            <button
              onClick={() => {
                setShowReview(false)
                setUserAnswer('')
                setFeedback('')
                selectRandomProblem()
              }}
              className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  )

  const getZoneName = (sector) => {
    const zoneMap = {
      'Foundations': 'Alpha',
      'Foundation': 'Alpha',
      'Advanced': 'Bravo',
      'Algebra': 'Bravo',
      'Expert': 'Charlie',
      'Geometry': 'Charlie',
      'Data': 'Delta',
      'Graphs': 'Delta'
    }
    return zoneMap[sector] || 'Unknown'
  }

  const MissionSummary = ({ missionData }) => {
    const handleReturnToMap = () => {
      setShowMissionSummary(false)
      // In a real app, this would trigger navigation back to the map
      console.log('Returning to map with completed node:', nodeId)
      window.location.reload() // Temporary solution
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 border-2 border-yellow-400/50 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl relative overflow-hidden"
        >
          {/* Shimmer effect background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent animate-pulse"></div>
          
          {/* Victory glow effect */}
          <motion.div
            className="absolute -inset-4 bg-yellow-400/20 rounded-3xl blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          <div className="relative z-10 text-center space-y-6">
            {/* Victory Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.2 }}
              className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <span className="text-3xl">🌟</span>
            </motion.div>
            
            {/* Headline */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-3xl font-black text-yellow-400 mb-2 tracking-tighter">
                STRONGHOLD RECLAIMED
              </h1>
              <p className="text-yellow-200/80 text-sm">
                Zone {getZoneName(nodeContent?.sector)} is becoming more secure. Your Overcomer Readiness has increased to {Math.round(((missionData?.correctAnswers || 0) / 50) * 100)}%.
              </p>
            </motion.div>
            
            {/* Victory Stats */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <div className="bg-black/30 rounded-xl p-4 border border-yellow-400/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-yellow-300 font-semibold">Strongholds Reclaimed:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{missionData?.nodeIcon || '🧮'}</span>
                    <span className="text-yellow-400 font-bold text-xl">+1</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-yellow-300 font-semibold">Wisdom Gained:</span>
                  <span className="text-yellow-400 font-bold text-xl">{missionData?.correctAnswers || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-yellow-300 font-semibold">Resilience Bonus:</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-blue-400">🌊</span>
                    <span className="text-yellow-400 font-bold text-xl">+{missionData?.auraUsage || 0}</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Return Button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={handleReturnToMap}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              RETURN TO MAP
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="w-full h-full bg-gray-800 rounded-lg p-6 relative">
      {/* Mode Selector */}
      <div className="flex justify-center mb-6 space-x-2">
        {['concrete', 'pictorial', 'abstract'].map((mode) => (
          <button
            key={mode}
            onClick={() => setCurrentMode(mode)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              currentMode === mode
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* Score Display */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-white">
          <span className="text-sm">Score: </span>
          <span className="text-xl font-bold text-yellow-400 ml-2">{score}</span>
        </div>
        <div className="text-white">
          <span className="text-sm">Streak: </span>
          <span className="text-xl font-bold text-green-400 ml-2">{streak}</span>
        </div>
      </div>

      {/* Problem Display */}
      <div className="min-h-[400px]">
        {/* Forge Problem Indicator */}
        {isForgeProblem && (
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-2 bg-purple-600/20 border border-purple-400/30 rounded-lg px-3 py-2">
              <span className="text-lg">⚒️</span>
              <span className="text-purple-300 text-sm font-semibold">AI FORGED PROBLEM</span>
              <span className="text-purple-400 text-xs">Adapted to your progress</span>
            </div>
          </div>
        )}
        
        {currentMode === 'concrete' && renderConcreteMode()}
        {currentMode === 'pictorial' && renderPictorialMode()}
        {currentMode === 'abstract' && renderAbstractMode()}
      </div>

      {/* Command Calculator Warning */}
      {showGhostCalcWarning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
            <span className="text-xl font-bold">⚡ DOUBLE REPS!</span>
            <span className="text-sm">+2 for Ghost Calc mastery</span>
          </div>
        </motion.div>
      )}

      {/* Combat Commendation */}
      {showCombatCommendation && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 border-2 border-yellow-400 rounded-lg px-6 py-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-black font-bold">⭐</span>
              </div>
              <div>
                <h4 className="text-yellow-900 font-bold text-sm">COMBAT COMMENDATION</h4>
                <p className="text-yellow-800 text-xs font-medium">{combatCommendation}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Teaching HUD */}
      {showTeachingHUD && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-green-900/95 to-green-800/95 border-2 border-green-400/50 rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
          >
            <div className="text-center space-y-6">
              {/* Teaching Icon */}
              <div className="w-16 h-16 mx-auto bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-3xl">🎯</span>
              </div>
              
              {/* Teaching Title */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-green-300">
                  HOW TO WIN
                </h3>
                <p className="text-green-200/80 text-sm">
                  Let me show you the exact sequence to solve this problem
                </p>
              </div>
              
              {/* Problem Display */}
              <div className="bg-black/30 rounded-xl p-4 border border-green-400/30">
                <h4 className="text-green-400 font-semibold text-sm mb-2">PROBLEM:</h4>
                <p className="text-green-200 text-lg">
                  {currentProblem?.problem || currentProblem?.question}
                </p>
              </div>
              
              {/* Tactical Tip */}
              <div className="bg-black/30 rounded-xl p-4 border border-green-400/30">
                <h4 className="text-green-400 font-semibold text-sm mb-2">TACTICAL TIP:</h4>
                <p className="text-green-200 text-sm">
                  {currentProblem?.tacticalTip || nodeContent?.tacticalTip}
                </p>
              </div>
              
              {/* Step-by-Step Explanation */}
              <div className="bg-black/30 rounded-xl p-4 border border-green-400/30">
                <h4 className="text-green-400 font-semibold text-sm mb-2">STEP-BY-STEP:</h4>
                <div className="space-y-2">
                  {currentProblem?.explanation ? (
                    <p className="text-green-200 text-sm leading-relaxed">
                      {currentProblem.explanation}
                    </p>
                  ) : currentProblem?.solution ? (
                    currentProblem.solution.map((step, index) => (
                      <p key={index} className="text-green-200 text-sm">
                        {step}
                      </p>
                    ))
                  ) : (
                    <p className="text-green-200 text-sm">
                      Follow the tactical tip above to solve this problem.
                    </p>
                  )}
                </div>
              </div>
              
              {/* Command Calculator Pulse */}
              {currentProblem?.requiresGhostCalc && (
                <div className="bg-black/30 rounded-xl p-4 border border-yellow-400/30">
                  <h4 className="text-yellow-400 font-semibold text-sm mb-2">COMMAND CALCULATOR SEQUENCE:</h4>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(255,215,0,0.6)]">
                      <span className="text-black font-bold">👻</span>
                    </div>
                    <p className="text-yellow-200 text-sm">
                      Use the Command Calculator with the tactical sequence above
                    </p>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowTeachingHUD(false)
                    setTeachingStep(0)
                    setUserAnswer('')
                    setFeedback('Now try it with the tactical guidance!')
                  }}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                >
                  I'VE GOT IT
                </button>
                <button
                  onClick={() => {
                    setShowTeachingHUD(false)
                    setTeachingStep(0)
                    setUserAnswer('')
                    setFeedback('Skipping this problem...')
                    selectRandomProblem()
                  }}
                  className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition"
                >
                  Skip
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Answer Input */}
      <div className="space-y-4">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
          placeholder="Type your answer here..."
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
          disabled={isProcessing}
        />
        
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center p-3 rounded-lg ${
              feedback.includes('right') || feedback.includes('Great') ? 'bg-green-600' : 'bg-orange-600'
            }`}
          >
            {feedback}
          </motion.div>
        )}
        
        {/* Mental Model Display */}
        {mentalModel && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <h4 className="text-blue-300 font-semibold text-sm">Mental Model</h4>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              {mentalModel}
            </p>
            
            {/* Step-by-step solution if available */}
            {currentProblem?.solution && (
              <div className="mt-3 pt-3 border-t border-blue-500/30">
                <p className="text-blue-300 font-semibold text-xs mb-2">Step-by-Step:</p>
                <div className="space-y-1">
                  {currentProblem.solution.map((step, index) => (
                    <p key={index} className="text-blue-200 text-xs">
                      {step}
                    </p>
                  ))}
                </div>
              </div>
            )}
            
            {/* Warm Reinforcement */}
            <div className="mt-3 pt-3 border-t border-blue-500/30">
              <p className="text-blue-300 text-xs italic">
                💙 This isn't a mistake; it's a recalibration. You're getting stronger.
              </p>
            </div>
            
            {/* Re-engage Button */}
            <button
              onClick={() => {
                setMentalModel('')
                setUserAnswer('')
                setFeedback('')
                selectRandomProblem()
                switchMode('VERVE') // Switch back to VERVE mode
              }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition"
            >
              RE-ENGAGE VERVE
            </button>
          </motion.div>
        )}
        
        {/* Review button for incorrect answers */}
        {showReview && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleReview}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            📖 Review Solution
          </motion.button>
        )}
        
        <div className="flex space-x-3">
          <button
            onClick={checkAnswer}
            disabled={isProcessing || !userAnswer.trim()}
            className="flex-1 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] touch-manipulation"
          >
            {isProcessing ? 'Checking...' : 'Check Answer'}
          </button>
          
          {showReview && (
            <button
              onClick={() => {
                setShowReview(false)
                setUserAnswer('')
                setFeedback('')
                selectRandomProblem()
              }}
              className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition"
            >
              Skip
            </button>
          )}
        </div>
      </div>
      
      {/* Mission Summary Overlay */}
      <AnimatePresence>
        {showMissionSummary && (
          <MissionSummary 
            missionData={{
              nodeIcon: nodeContent?.icon || '🧮',
              correctAnswers: correctAnswers,
              auraUsage: auraUsageCount
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Aura Coach Overlay */}
      <AnimatePresence>
        {showAuraCoach && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-blue-900/95 to-blue-800/95 border-2 border-blue-400/50 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
            >
              <div className="text-center space-y-6">
                {/* Mission Coach Icon */}
                <div className="w-16 h-16 mx-auto bg-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🎖️</span>
                </div>
                
                {/* Mission Coach Title */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-blue-300">
                    MISSION COACH
                  </h3>
                  <p className="text-blue-200 text-sm">
                    Tactical guidance for your operation
                  </p>
                </div>
                
                {/* Mission Coach Message */}
                <div className="bg-black/30 rounded-xl p-4 border border-blue-400/30">
                  <h4 className="text-blue-400 font-semibold text-sm mb-2">TACTICAL ADVISORY:</h4>
                  <p className="text-blue-200 text-sm leading-relaxed">
                    {missionCoachMessage || 'Warrior, let the Command Calc be your tactical advantage in this operation.'}
                  </p>
                </div>
                
                {/* Mental Model */}
                {mentalModel && (
                  <div className="bg-black/30 rounded-xl p-4 border border-blue-400/30">
                    <h4 className="text-blue-400 font-semibold text-sm mb-2">STRATEGY SESSION:</h4>
                    <p className="text-blue-200 text-xs leading-relaxed">
                      {mentalModel}
                    </p>
                  </div>
                )}
                
                {/* Continue Button */}
                <button
                  onClick={() => {
                    setShowAuraCoach(false)
                    setShowReview(true)
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                >
                  Continue Tactical Briefing
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProblemEngine
