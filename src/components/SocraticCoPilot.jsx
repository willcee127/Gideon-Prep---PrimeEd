import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SocraticSafetyValve from './SocraticSafetyValve'
import './styles/bridgeGapAnimations.css'

const SocraticCoPilot = ({ 
  isOpen, 
  problemData, 
  studentMistake, 
  onBreakthrough, 
  onClose,
  isMissionActive = false,
  missionTimeLimit = 180,
  onMissionComplete = null
}) => {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [currentEquation, setCurrentEquation] = useState('')
  const [inputSuccess, setInputSuccess] = useState(false)
  const inputRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Safety Valve state management
  const [consecutiveIncorrectResponses, setConsecutiveIncorrectResponses] = useState(0)
  const [stallDetected, setStallDetected] = useState(false)
  const [fallbackMode, setFallbackMode] = useState(false)
  const [currentDifficulty, setCurrentDifficulty] = useState(1)

  // Mission state management
  const [missionTimer, setMissionTimer] = useState(missionTimeLimit)
  const [missionStartTime, setMissionStartTime] = useState(null)
  const [successProbability, setSuccessProbability] = useState(100)
  const [missionComplete, setMissionComplete] = useState(false)

  // Initialize with problem data
  useEffect(() => {
    if (problemData) {
      setCurrentEquation(problemData.equation || 'x² + 5x + 6 = 0')
      
      // Reset mission state when new problem data arrives
      if (isMissionActive) {
        setMissionTimer(missionTimeLimit)
        setMissionStartTime(Date.now())
        setMissionComplete(false)
        setSuccessProbability(100)
      }
      
      // Initial Co-Pilot greeting
      const greeting = isMissionActive 
        ? 'MISSION CONTROL: Final Simulation Active. System integrity at risk.'
        : `CO-PILOT: Tactical Guidance Active. I see friction in: ${problemData.concept || 'Quadratic Equations'}.`
      
      setMessages([{
        id: 1,
        sender: 'copilot',
        text: greeting,
        timestamp: new Date()
      }])
      
      // First Socratic question or mission briefing
      setTimeout(() => {
        setIsThinking(true)
        setTimeout(() => {
          const firstMessage = isMissionActive
            ? 'Mission Briefing: You have 3 minutes to complete this high-stakes simulation. Maintain focus and accuracy under pressure.'
            : 'What happens to the sign when we move -5 to the other side of the equation?'
          
          setMessages(prev => [...prev, {
            id: 2,
            sender: 'copilot',
            text: firstMessage,
            timestamp: new Date()
          }])
          setIsThinking(false)
        }, 1500)
      }, 500)
    }
  }, [problemData, isMissionActive])

  // Mission timer effect
  useEffect(() => {
    if (isMissionActive && missionStartTime) {
      const interval = setInterval(() => {
        const elapsed = (Date.now() - missionStartTime) / 1000 // Convert to seconds
        const remaining = Math.max(0, missionTimeLimit - elapsed)
        setMissionTimer(remaining)
        
        // Calculate success probability based on accuracy and time
        const accuracyBonus = Math.max(0, (100 - consecutiveIncorrectResponses * 10)) // Accuracy bonus
        const timeBonus = Math.max(0, (remaining / missionTimeLimit) * 30) // Time bonus
        const newProbability = Math.min(100, accuracyBonus + timeBonus)
        setSuccessProbability(newProbability)
        
        // Mission complete or fail
        if (remaining <= 0 || missionComplete) {
          clearInterval(interval)
          setMissionComplete(true)
          setMissionTimer(0)
          
          // Final mission message
          const finalMessage = remaining <= 0 
            ? 'MISSION FAILED: Time expired. System integrity compromised.'
            : `MISSION COMPLETE: Success Probability: ${newProbability.toFixed(1)}%. Combat Power adjusted.`
          
          setMessages(prev => [...prev, {
            id: messages.length + 1,
            sender: 'copilot',
            text: finalMessage,
            timestamp: new Date()
          }])
          
          // Trigger mission complete callback
          if (onMissionComplete && remaining <= 0) {
            onMissionComplete(newProbability, elapsed)
          }
        }
      }, 100) // Update every 100ms
    }
  }, [isMissionActive, missionStartTime, consecutiveIncorrectResponses, missionComplete])

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle hint timer
  useEffect(() => {
    if (messages.length > 0 && !isMissionActive) {
      const lastCopilotMessage = messages.filter(m => m.sender === 'copilot').pop()
      if (lastCopilotMessage && !showHint) {
        const timer = setTimeout(() => {
          setShowHint(true)
        }, 60000) // 60 seconds
        
        return () => clearTimeout(timer)
      }
    }
  }, [messages, showHint, isMissionActive])

  // Mission complete handler
  const handleMissionComplete = (probability, elapsed) => {
    setMissionComplete(true)
    setMissionTimer(0)
    
    // Trigger MissionDebrief overlay
    setTimeout(() => {
      const event = new CustomEvent('missionComplete', {
        detail: {
          probability,
          elapsed,
          sessionData,
          radarData: problemData?.radarData || {},
          timePerQuestion: problemData?.timePerQuestion || {},
          missionSuccess: probability >= 72.5
        }
      })
      window.dispatchEvent(event)
    }, 1000)
  }

  const handleSendMessage = () => {
    if (inputValue.trim() && !isThinking) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'student',
        text: inputValue.trim(),
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, newMessage])
      setInputValue('')
      setInputSuccess(true)
      setTimeout(() => setInputSuccess(false), 500)

      // Process student response
      setTimeout(() => {
        setIsThinking(true)
        setTimeout(() => {
          processStudentResponse(inputValue.trim())
          setIsThinking(false)
        }, 1000)
      }, 300)
    }
  }

  // Safety Valve: Enhanced student response processing
  const processStudentResponse = (response) => {
    let copilotResponse = ''
    let shouldDecreaseDifficulty = false
    let shouldIncreaseDifficulty = false
    let shouldTriggerFallback = false
    
    // Reset consecutive incorrect counter on correct response
    if (response.toLowerCase().includes('excellent') || 
        response.toLowerCase().includes('perfect') || 
        response.toLowerCase().includes('great') || 
        response.toLowerCase().includes('correct')) {
      setConsecutiveIncorrectResponses(0)
      setStallDetected(false)
      setFallbackMode(false)
      
      // In mission mode, correct answers also increase success probability
      if (isMissionActive) {
        setSuccessProbability(prev => Math.min(100, prev + 5))
      }
    } else {
      // Increment consecutive incorrect counter
      const newCount = consecutiveIncorrectResponses + 1
      setConsecutiveIncorrectResponses(newCount)
      
      // Stall detection: 3 consecutive incorrect responses trigger stall warning
      if (newCount >= 3) {
        setStallDetected(true)
      }
      
      // Fallback mode: 5 consecutive incorrect responses trigger visual demo
      if (newCount >= 5) {
        setFallbackMode(true)
        shouldTriggerFallback = true
      }
      
      // In mission mode, incorrect answers decrease success probability
      if (isMissionActive) {
        setSuccessProbability(prev => Math.max(0, prev - 15))
      }
    }
    
    // Determine next Socratic question based on response
    if (response.toLowerCase().includes('negative') || response.toLowerCase().includes('minus')) {
      copilotResponse = 'Excellent! Now what happens when we add 25 to both sides?'
      shouldIncreaseDifficulty = true
    } else if (response.toLowerCase().includes('positive') || response.toLowerCase().includes('plus')) {
      copilotResponse = 'Wait - let me check that. What would -5 + 5 equal?'
      shouldIncreaseDifficulty = true
    } else if (response.includes('20') || response.includes('twenty')) {
      copilotResponse = 'Perfect! Now we have x² + 5x + 20 = 0. What method could we use to solve this?'
      shouldIncreaseDifficulty = true
    } else if (response.toLowerCase().includes('factor') || response.toLowerCase().includes('quadratic')) {
      copilotResponse = 'Great choice! Can you see two numbers that multiply to 20 and add to 5?'
      shouldIncreaseDifficulty = true
    } else if (fallbackMode) {
      // Visual fallback: Use physical analogy instead of direct question
      const bridgeGapResponse = getBridgeGapResponse(problemData?.concept || 'Unknown', currentDifficulty)
      copilotResponse = bridgeGapResponse.analogy
      setCurrentDifficulty(1) // Reset to easiest level
    } else if (stallDetected) {
      // Bridge Gap: Lower difficulty and provide physical analogy
      const bridgeGapResponse = getBridgeGapResponse(problemData?.concept || 'Unknown', currentDifficulty)
      copilotResponse = bridgeGapResponse.analogy
      setCurrentDifficulty(Math.max(1, currentDifficulty - 1))
    } else {
      copilotResponse = 'Interesting approach. Walk me through your thinking step by step.'
    }

    const newMessage = {
      id: messages.length + 1,
      sender: 'copilot',
      text: copilotResponse,
      timestamp: new Date(),
      metadata: {
        difficulty: currentDifficulty,
        stallDetected,
        fallbackMode,
        consecutiveIncorrect: consecutiveIncorrectResponses,
        missionTimer,
        successProbability,
        isMissionActive,
        visualType: bridgeGapResponse?.visual || 'blocks'
      }
    }

    setMessages(prev => [...prev, newMessage])
    setShowHint(false)
  }

  const handleHint = () => {
    setMessages(prev => [...prev, {
      id: messages.length + 1,
      sender: 'copilot',
      text: 'Hint: Look for two numbers that multiply to 6 and add to 5. Think about factors of 6.',
      timestamp: new Date()
    }])
    setShowHint(false)
  }

  const handleAbort = () => {
    if (onClose) onClose()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        style={{ 
          backgroundColor: 'rgba(11, 14, 20, 0.9)',
          backgroundImage: `
            linear-gradient(rgba(177, 156, 217, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(177, 156, 217, 0.03) 1px, transparent 1px)
          `
        }}
      >
        {/* Mobile Comms Bubble */}
        <div className="comms-bubble md:hidden">
          <div className="w-3 h-3 bg-verve rounded-full animate-pulse"></div>
          <div className="text-xs text-white font-bold">COMMS</div>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-2xl neon-card"
        >
          {/* Header */}
          <div className={`glass-panel border-b p-6 rounded-t-2xl ${
            isMissionActive ? 'border-red-500' : ''
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  isMissionActive ? 'bg-red-500' : 'bg-verve'
                }`}></div>
                <div>
                  <h2 className={`text-2xl font-bold holographic-text ${
                    isMissionActive ? 'text-red-500' : ''
                  }`}>
                    {isMissionActive ? 'MISSION CONTROL' : 'TACTICAL COMMS'}
                  </h2>
                  <p className="text-sm data-text-secondary mt-1">
                    {isMissionActive ? 'Final Simulation Active' : 'Recovery Engine Analysis'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Mission Timer Display */}
                {isMissionActive && (
                  <div className="flex items-center gap-2">
                    <div className="text-xs data-text-secondary">TIME REMAINING:</div>
                    <div className={`text-sm font-mono ${
                      successProbability < 72.5 ? 'text-red-500' : 'text-verve'
                    }`} style={{
                      textShadow: successProbability < 72.5 
                        ? '0 0 10px rgba(255, 49, 49, 0.8)' 
                        : '0 0 5px rgba(177, 156, 217, 0.5)'
                    }}>
                      {Math.floor(missionTimer / 60)}:{(missionTimer % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className="text-xs data-text-secondary">CALL SIGN:</div>
                  <div className="text-sm font-mono text-verve">{callSign || 'WARRIOR'}</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="data-text-secondary hover:text-white transition-colors text-2xl"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Whiteboard */}
            <div className="neon-card p-4 mb-6">
              <div className="text-center">
                <div className="text-xs data-text-secondary mb-2">CURRENT PROBLEM</div>
                <div className="text-forge font-mono text-lg font-bold">
                  {currentEquation}
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 neon-card rounded-lg max-h-96">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'} mb-3`}
                >
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'student' 
                      ? 'glass-panel text-black data-text' 
                      : `neon-card text-white data-text bridge-gap-message ${message.metadata?.visualType || 'blocks'}`
                  }`}>
                    {message.text}
                    {message.metadata?.visualType && (
                      <div className={`visual-indicator ${message.metadata.visualType}`}></div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {/* Thinking Indicator */}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="neon-card p-3 phase-btn aura-glow text-black data-text">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                      <span className="typewriter">DECODING RESPONSE<span className="animate-pulse">...</span></span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="neon-card p-4 space-y-3">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Awaiting transmission..."
                  className={`flex-1 neon-input px-4 py-3 text-lg ${
                    inputSuccess 
                      ? 'border-green-400' 
                      : 'border-verve focus:aura-glow'
                  }`}
                  style={{
                    boxShadow: inputSuccess ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none'
                  }}
                  disabled={isThinking}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isThinking || !inputValue.trim()}
                  className="phase-btn verve-glow text-black font-bold py-3 px-6 disabled:cursor-not-allowed"
                >
                  TRANSMIT
                </button>
              </div>
              
              {/* Tactical Commands */}
              <div className="flex gap-2">
                <button
                  onClick={handleHint}
                  disabled={showHint || isThinking || isMissionActive}
                  className={`phase-btn glass-panel data-text-secondary hover:text-verve disabled:cursor-not-allowed px-4 py-2 text-sm ${
                    isMissionActive ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {showHint ? 'HINT DEPLOYED' : isMissionActive ? 'HINTS DISABLED' : 'DEPLOY HINT'}
                </button>
                <button
                  onClick={handleAbort}
                  className="phase-btn glass-panel data-text-secondary hover:text-forge px-4 py-2 text-sm"
                >
                  {isMissionActive ? 'ABORT MISSION' : 'ABORT MISSION'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )

  // Add CSS animations for Red Alert mode
  const style = document.createElement('style')
  style.textContent = `
    @keyframes scanning {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    @keyframes radial-pulse {
      0% { transform: scale(1); opacity: 0.1; }
      50% { transform: scale(1.1); opacity: 0.3; }
      100% { transform: scale(1); opacity: 0.1; }
    }
    
    .scanning-line {
      animation: scanning 2s linear infinite;
    }
    
    .radial-pulse {
      animation: radial-pulse 3s ease-in-out infinite;
    }
  `
  document.head.appendChild(style)
}

export default SocraticCoPilot
