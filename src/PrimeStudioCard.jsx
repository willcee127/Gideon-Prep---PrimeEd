import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNeuro } from './context/NeuroProvider' 
import IdentityStrike from './components/IdentityStrike'
import ProblemEngine from './components/ProblemEngine'
import ExamEngine from './components/ExamEngine'
import ExamResults from './components/ExamResults'
import WarriorJournal from './components/WarriorJournal'
import StrategicCommandConsole from './components/StrategicCommandConsole'
import MasteryMap from './components/MasteryMap'
import ProgressLedger from './components/ProgressLedger'
import SuccessBadge from './components/SuccessBadge'
import { getNodeById, getUnlockedNodes } from './data/mathContent'
import { supabase } from './supabase'

const PrimeStudioCard = ({ userName }) => {
  const { 
    identityStrikeTrigger, 
    isInVerveMode,
    isInAuraMode,
    isInForgeMode, 
    getModeStyles,
    switchMode,
    selectedNode,
    practiceMode,
    stressLevel,
    isStressed
  } = useNeuro()
  
  const [showProblemEngine, setShowProblemEngine] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [beliefMetric, setBeliefMetric] = useState('Warming up...')
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [energyLevel, setEnergyLevel] = useState(0)
  const [completedNodes, setCompletedNodes] = useState([])
  const [highStressStart, setHighStressStart] = useState(null)
  const [showBreatherSuggestion, setShowBreatherSuggestion] = useState(false)
  const [isBreathing, setIsBreathing] = useState(false)
  const [showMissionBriefing, setShowMissionBriefing] = useState(false)
  const [showProgressLedger, setShowProgressLedger] = useState(false)
  const [showExamEngine, setShowExamEngine] = useState(false)
  const [examResults, setExamResults] = useState(null)
  const [showSuccessBadge, setShowSuccessBadge] = useState(false)

  // Load completed nodes from localStorage and database
  useEffect(() => {
    const loadCompletedNodes = async () => {
      try {
        const userId = localStorage.getItem('gideon_user_name') || 'anonymous'
        
        // First, try to fetch from Supabase mastery_ledger
        const { data, error } = await supabase
          .from('mastery_ledger')
          .select('node_id')
          .eq('user_id', userId)
          .eq('status', 'mastered')
        
        if (data && data.length > 0) {
          const completedNodeIds = data.map(record => record.node_id)
          setCompletedNodes(completedNodeIds)
          // Also update localStorage for offline persistence
          localStorage.setItem('completedNodes', JSON.stringify(completedNodeIds))
        } else {
          // Fallback to localStorage if database fetch fails
          const saved = localStorage.getItem('completedNodes')
          if (saved) {
            setCompletedNodes(JSON.parse(saved))
          }
        }
      } catch (error) {
        console.error('Failed to load completed nodes:', error)
        // Fallback to localStorage
        const saved = localStorage.getItem('completedNodes')
        if (saved) {
          setCompletedNodes(JSON.parse(saved))
        }
      }
    }
    loadCompletedNodes()
  }, [])

  // Safety check for node access
  const canAccessNode = (nodeId) => {
    const node = getNodeById(nodeId)
    if (!node) return false
    
    // Check if prerequisites are met
    return node.prerequisites.every(prereq => completedNodes.includes(prereq))
  }

  const handleNodeSelect = (nodeId) => {
    const node = getNodeById(nodeId)
    if (!node) return
    
    if (!canAccessNode(nodeId)) {
      // Find the next unlocked node
      const unlockedNodes = getUnlockedNodes(completedNodes)
      const nextNode = unlockedNodes.find(n => !completedNodes.includes(n.id))
      
      if (nextNode) {
        console.log(`Node ${nodeId} is locked. Try ${nextNode.title} first!`)
        // In a real app, you'd show a gentle message or redirect
      } else {
        console.log('No unlocked nodes available')
      }
      return
    }
    
    // Show Mission Briefing for unlocked nodes
    setShowMissionBriefing(true)
  }

  const getMissionBriefingData = () => {
    if (!selectedNode) return null
    
    const node = getNodeById(selectedNode.id || selectedNode)
    if (!node) return null
    
    // Handle Stronghold exam differently
    if (node.isStronghold) {
      return {
        objective: 'Complete the 15-minute timed exam',
        intelligence: "This is your final test. Stay calm, trust your training, and remember: no review options until the end. Your breathing techniques are your secret weapon.",
        node
      }
    }
    
    // Generate intelligence tip based on node type
    const getIntelTip = (node) => {
      if (node.title.includes('Algebra')) {
        return "Think of equations as balance scales - what you do to one side, you must do to the other."
      } else if (node.title.includes('Linear')) {
        return "Visualize slopes as hills - steeper means faster change, gentler means slower change."
      } else if (node.title.includes('Systems')) {
        return "Like solving two mysteries at once - find one clue to unlock the next."
      } else if (node.title.includes('Quadratic')) {
        return "Break down complex problems into their building blocks, like factoring numbers."
      } else if (node.title.includes('Functions')) {
        return "Functions are machines - put something in, get something predictable out."
      }
      return "Every problem has a pattern. Find it, and you've found the solution."
    }
    
    return {
      objective: `Master 5 ${node.title.includes('Algebra') ? 'Equations' : node.title.includes('Linear') ? 'Problems' : 'Challenges'}`,
      intelligence: getIntelTip(node),
      node
    }
  }

  // Update belief metric based on session time
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => {
        const newTime = prev + 1
        // Progress belief metric based on time spent
        if (newTime < 10) {
          setBeliefMetric('Warming up...')
        } else if (newTime < 30) {
          setBeliefMetric('Finding your rhythm')
        } else if (newTime < 60) {
          setBeliefMetric('Growing stronger')
        } else {
          setBeliefMetric('In the zone!')
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Update energy level based on correct answers
  useEffect(() => {
    const newEnergyLevel = Math.min(100, Math.floor((correctAnswers || 0) / 3) * 10)
    setEnergyLevel(newEnergyLevel)
  }, [correctAnswers])

  // Monitor stress levels for Aura breathing suggestion
  useEffect(() => {
    if (stressLevel > 75) {
      if (!highStressStart) {
        setHighStressStart(Date.now())
      } else if (Date.now() - highStressStart > 5000 && !showBreatherSuggestion) {
        setShowBreatherSuggestion(true)
      }
    } else {
      setHighStressStart(null)
      setShowBreatherSuggestion(false)
    }
  }, [stressLevel, highStressStart, showBreatherSuggestion])

  const handleBreathingSession = async () => {
    setShowBreatherSuggestion(false)
    setIsBreathing(true)
    switchMode('AURA')
    
    // Log self-regulation win to trauma_logs
    try {
      const userId = localStorage.getItem('gideon_user_name') || 'anonymous'
      await supabase
        .from('trauma_logs')
        .insert([
          {
            user_id: userId,
            event_type: 'self_regulation_win',
            stress_level_before: stressLevel,
            trigger: 'high_stress_breather',
            created_at: new Date().toISOString()
          }
        ])
      console.log('Self-regulation win logged to trauma_logs')
    } catch (error) {
      console.error('Failed to log self-regulation win:', error)
    }
  }

  const handleBreathingComplete = () => {
    setIsBreathing(false)
    // User can return to their previous activity
  }

  const handleProblemSuccess = () => {
    const newCorrectAnswers = correctAnswers + 1
    setCorrectAnswers(newCorrectAnswers)
    console.log('Problem solved successfully!')
    
    // Show Success Badge on first completion
    if (newCorrectAnswers === 1) {
      setShowSuccessBadge(true)
    }
  }

  const handleProblemComplete = (nodeId) => {
    console.log('Problem set completed for node:', nodeId)
    setShowProblemEngine(false)
    // Could trigger celebration or unlock next node
  }

  const handleExamComplete = (results) => {
    setExamResults(results)
    setShowExamEngine(false)
    
    // If passed, add to completed nodes
    if (results.passed) {
      const newCompletedNodes = [...completedNodes, 'stronghold-001']
      setCompletedNodes(newCompletedNodes)
      localStorage.setItem('completedNodes', JSON.stringify(newCompletedNodes))
      
      // Log to database
      try {
        const userId = localStorage.getItem('gideon_user_name') || 'anonymous'
        supabase
          .from('mastery_ledger')
          .insert([
            {
              user_id: userId,
              node_id: 'stronghold-001',
              status: 'mastered',
              created_at: new Date().toISOString()
            }
          ])
      } catch (error) {
        console.error('Failed to log stronghold completion:', error)
      }
    }
  }

  const getGrowthCompass = () => {
    if (isInVerveMode) return 'You\'re doing great. Stay steady and keep moving forward.'
    if (isInAuraMode) return 'Take a deep breath. You\'re turning challenges into wisdom right now.'
    if (isInForgeMode) return 'Look how far you\'ve come. What\'s the next win we\'re heading for?'
    return 'You\'re right where you need to be. Ready to grow?'
  }

  const modeStyles = getModeStyles ? getModeStyles() : {
    borderColor: '#D4AF37',
    glowColor: 'rgba(212, 175, 55, 0.5)',
    blur: '20px'
  }

  const getHighIntensityBg = () => {
    if (isInVerveMode) return 'radial-gradient(circle at center, #E6E6FA 0%, #D8BFD8 40%, #7B68EE 100%)'
    if (isInAuraMode) return 'radial-gradient(circle at center, #1E90FF 0%, #00008B 50%, #000033 100%)'
    if (isInForgeMode) return 'radial-gradient(circle at center, #FFD700 0%, #D4AF37 50%, #8B4513 100%)'
    return '#FAF9F6'
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <motion.div
        key={isInVerveMode ? 'verve' : isInAuraMode ? 'aura' : 'forge'} 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }} 
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
        style={{ background: getHighIntensityBg() }}
      />

      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(circle at center, transparent 30%, ${modeStyles.borderColor}44 100%)` }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div 
          className="backdrop-blur-2xl bg-white/20 border-2 rounded-3xl p-10 shadow-2xl"
          style={{
            borderColor: modeStyles.borderColor,
            boxShadow: `0 0 50px ${modeStyles.glowColor}, inset 0 0 30px ${modeStyles.glowColor}`
          }}
        >
          <div className="relative z-10 text-center">
            {practiceMode && selectedNode ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-md uppercase tracking-widest">
                  Practice: <span style={{ color: modeStyles.borderColor }}>{selectedNode.title}</span>
                </h2>
                <button 
                  onClick={() => setShowProblemEngine(true)}
                  className="w-full py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
                  style={{ backgroundColor: modeStyles.borderColor, color: 'white' }}
                >
                  Start Practice Session
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-5xl font-black text-white mb-4 tracking-tighter italic drop-shadow-lg">
                  GIDEON <span style={{ color: modeStyles.borderColor }}>PREP</span>
                </h1>
                <p className="text-xl text-white mb-2 font-medium drop-shadow">
                  <span className="font-serif italic font-bold">PrimeED</span> Studio Fully Powered
                </p>
                <button 
                  onClick={() => setShowMap(true)}
                  className="flex items-center justify-center space-x-3 mt-8 bg-black/40 w-fit mx-auto px-6 py-3 rounded-full border border-white/20 shadow-inner hover:bg-black/60 transition-all cursor-pointer group"
                >
                  <motion.div 
                    className="w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <span className="text-white text-xs font-bold tracking-widest font-mono uppercase group-hover:text-green-300 transition-colors">
                    Neural Link Online - ACCESS MASTERY MAP
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Growth Compass Box */}
      <div className={`fixed bottom-6 left-6 z-40 bg-black/80 backdrop-blur-xl p-4 rounded-xl border border-white/20 max-w-xs ${stressLevel > 75 ? 'animate-pulse' : ''}`}>
        <h3 className={`text-xs font-bold uppercase tracking-widest mb-2 ${stressLevel > 75 ? 'text-red-400' : 'text-purple-400'}`}>
          YOUR GROWTH COMPASS
        </h3>
        <p className="text-xs text-gray-300 font-mono leading-relaxed">
          {getGrowthCompass()}
        </p>
        
        {/* Biometric Metrics */}
        <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Energy Level:</span>
            <span className={`text-xs font-bold ${energyLevel >= 70 ? 'text-green-400' : energyLevel >= 40 ? 'text-yellow-400' : 'text-orange-400'}`}>
              {energyLevel}% {energyLevel >= 70 ? '(HIGH)' : energyLevel >= 40 ? '(MEDIUM)' : '(LOW)'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Growth Metric:</span>
            <span className="text-xs font-bold text-yellow-400">
              {beliefMetric}
            </span>
          </div>
        </div>
        
        {/* Progress Ledger Button - Mobile Friendly */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <button
            onClick={() => setShowProgressLedger(true)}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition transform hover:scale-105 active:scale-95 min-h-[44px] touch-manipulation"
          >
            📊 Warrior Progress
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          Learner: <span className="text-green-400 font-bold">{userName || 'FRIEND'}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-6 right-6 z-40 text-right">
        <p className="text-xs text-gray-500 font-mono tracking-widest">
          GROWTH MODE ACTIVATED
        </p>
        <p className="text-xs text-purple-400 font-bold tracking-widest mt-1">
          YOU ARE CAPABLE OF AMAZING THINGS
        </p>
      </div>

      {/* Unified Command Bar */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-6">
        {/* Mode Selector */}
        <div className="flex items-center bg-black/40 backdrop-blur-xl p-3 rounded-full border border-white/10 gap-4">
          <button 
            onClick={() => switchMode('VERVE')} 
            className={`w-4 h-4 rounded-full transition-all duration-500 hover:scale-125 ${isInVerveMode ? 'bg-purple-400 shadow-[0_0_25px_#A855F7]' : 'bg-gray-600 hover:bg-purple-300'}`} 
            title="VERVE"
          />
          <button 
            onClick={() => switchMode('AURA')} 
            className={`w-4 h-4 rounded-full transition-all duration-500 hover:scale-125 ${isInAuraMode ? 'bg-blue-500 shadow-[0_0_25px_#3B82F6]' : 'bg-gray-600 hover:bg-blue-300'}`} 
            title="AURA"
          />
          <button 
            onClick={() => switchMode('FORGE')} 
            className={`w-4 h-4 rounded-full transition-all duration-500 hover:scale-125 ${isInForgeMode ? 'bg-yellow-400 shadow-[0_0_25px_#EAB308]' : 'bg-gray-600 hover:bg-yellow-300'}`} 
            title="FORGE"
          />
        </div>
        
        {/* Warrior Tools */}
        <WarriorJournal />
      </div>

      <IdentityStrike trigger={identityStrikeTrigger} />

      <AnimatePresence>
        {showBreatherSuggestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-blue-900/90 border-2 border-blue-400/50 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl"
            >
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-blue-400 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-2xl">🌊</span>
                </div>
                
                <h3 className="text-xl font-bold text-blue-300 mb-2">
                  Soft Landing
                </h3>
                
                <p className="text-blue-200 text-sm mb-6">
                  {userName || 'Wil'}, the energy is high. Want to take a 60-second Aura breather?
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowBreatherSuggestion(false)}
                    className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
                  >
                    Maybe Later
                  </button>
                  <button
                    onClick={handleBreathingSession}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                  >
                    Yes, Breathe
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isBreathing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-blue-900/95 border-2 border-blue-400/50 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
            >
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold text-blue-300 mb-2">
                  Box Breathing
                </h3>
                
                <p className="text-blue-200 text-sm mb-4">
                  Follow the circle. Inhale for 4, Hold for 4, Exhale for 4.
                </p>
                
                {/* Breathing Circle */}
                <div className="relative w-44 h-44 mx-auto min-h-[176px]">
                  <motion.div
                    className="absolute inset-0 bg-blue-400/20 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute inset-2 bg-blue-500/50 rounded-full"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute inset-4 bg-blue-600/70 rounded-full"
                    animate={{
                      scale: [1, 1.6, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute inset-6 bg-blue-700/90 rounded-full flex items-center justify-center"
                    animate={{
                      scale: [1, 1.8, 1],
                      opacity: [0.9, 1, 0.9]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-blue-300 text-xs font-mono">4-4-4</span>
                  </div>
                </div>
                
                {/* Breathing Phase Indicator */}
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 mb-4">
                    <div className={`w-2 h-2 rounded-full ${isInAuraMode ? 'bg-blue-400' : 'bg-gray-600'}`}></div>
                    <span className="text-blue-300 text-sm font-mono">Inhale</span>
                    <div className={`w-2 h-2 rounded-full ${isInAuraMode ? 'bg-blue-400' : 'bg-gray-600'}`}></div>
                    <span className="text-blue-300 text-sm font-mono">Hold</span>
                    <div className={`w-2 h-2 rounded-full ${isInAuraMode ? 'bg-blue-400' : 'bg-gray-600'}`}></div>
                    <span className="text-blue-300 text-sm font-mono">Exhale</span>
                  </div>
                </div>
                
                <button
                  onClick={handleBreathingComplete}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                >
                  Complete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMissionBriefing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
          >
            {(() => {
              const briefingData = getMissionBriefingData()
              if (!briefingData) return null
              
              return (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 border-2 border-purple-400/50 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
                >
                  <div className="text-center space-y-6">
                    {/* Mission Icon */}
                    <div className="w-16 h-16 mx-auto bg-purple-400 rounded-full flex items-center justify-center">
                      <span className="text-2xl">{briefingData.node.icon}</span>
                    </div>
                    
                    {/* Mission Title */}
                    <h3 className="text-2xl font-bold text-purple-300 mb-2">
                      Mission Briefing
                    </h3>
                    
                    {/* Mission Objective */}
                    <div className="bg-black/30 rounded-xl p-4 border border-purple-400/30">
                      <h4 className="text-purple-400 font-semibold text-sm mb-2">OBJECTIVE:</h4>
                      <p className="text-purple-200 font-bold">{briefingData.objective}</p>
                    </div>
                    
                    {/* Intelligence */}
                    <div className="bg-black/30 rounded-xl p-4 border border-blue-400/30">
                      <h4 className="text-blue-400 font-semibold text-sm mb-2">INTELLIGENCE:</h4>
                      <p className="text-blue-200 text-sm">{briefingData.intelligence}</p>
                    </div>
                    
                    {/* Mission Stats */}
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Difficulty: {briefingData.node.difficulty}</span>
                      <span>Est. Time: {briefingData.node.estimatedTime}</span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowMissionBriefing(false)}
                        className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setShowMissionBriefing(false)
                          if (briefingData.node.isStronghold) {
                            setShowExamEngine(true)
                          } else {
                            setShowProblemEngine(true)
                          }
                        }}
                        className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition transform hover:scale-105"
                      >
                        {briefingData.node.isStronghold ? 'BEGIN EXAM' : 'ENGAGE MISSION'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMap && (
          <motion.div
            key="mastery-map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            <div className="w-full h-full flex items-center justify-center">
              <MasteryMap 
                onNodeSelect={handleNodeSelect}
                selectedNode={null}
                completedNodes={completedNodes}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProblemEngine && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg"
          >
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl border-t-[12px]" style={{ borderColor: modeStyles.borderColor }}>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black uppercase tracking-tighter">Neural Practice Engine</h2>
                <button onClick={() => setShowProblemEngine(false)} className="bg-gray-100 p-3 rounded-full hover:bg-red-500 hover:text-white transition-all">✕</button>
              </div>
              <ProblemEngine 
                nodeId={selectedNode?.id || 'ged-001'} 
                onSuccess={handleProblemSuccess}
                onProblemComplete={handleProblemComplete}
                userName={userName}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProgressLedger && (
          <ProgressLedger 
            userName={userName}
            isOpen={showProgressLedger}
            onClose={() => setShowProgressLedger(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExamEngine && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg"
          >
            <div className="bg-gray-900 rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl border-t-[12px]" style={{ borderColor: modeStyles.borderColor }}>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black uppercase tracking-tighter">GED Stronghold Exam</h2>
                <button onClick={() => setShowExamEngine(false)} className="bg-gray-700 p-3 rounded-full hover:bg-red-500 hover:text-white transition-all">✕</button>
              </div>
              <ExamEngine 
                nodeId={selectedNode?.id || 'stronghold-001'} 
                onComplete={handleExamComplete}
                userName={userName}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {examResults && (
          <ExamResults 
            results={examResults}
            userName={userName}
            onClose={() => setExamResults(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccessBadge && (
          <SuccessBadge 
            userName={userName}
            isVisible={showSuccessBadge}
            onClose={() => setShowSuccessBadge(false)}
            isFirstNode={completedNodes.length === 1}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// THIS IS THE LINE THAT WAS MISSING:
export default PrimeStudioCard