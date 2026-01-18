import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SocraticCoPilot = ({ 
  problemData, 
  studentMistake, 
  onBreakthrough,
  isOpen,
  onClose 
}) => {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [currentEquation, setCurrentEquation] = useState('')
  const [inputSuccess, setInputSuccess] = useState(false)
  const inputRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Initialize with problem data
  useEffect(() => {
    if (problemData) {
      setCurrentEquation(problemData.equation || 'x² + 5x + 6 = 0')
      
      // Initial Co-Pilot greeting
      setMessages([{
        id: 1,
        sender: 'copilot',
        text: `CO-PILOT: Tactical Guidance Active. I see friction in: ${problemData.concept || 'Quadratic Equations'}.`,
        timestamp: new Date()
      }])
      
      // First Socratic question
      setTimeout(() => {
        setIsThinking(true)
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: 2,
            sender: 'copilot',
            text: `What happens to the sign when we move -5 to the other side of the equation?`,
            timestamp: new Date()
          }])
          setIsThinking(false)
        }, 1500)
      }, 500)
    }
  }, [problemData])

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle hint timer
  useEffect(() => {
    if (messages.length > 0) {
      const lastCopilotMessage = messages.filter(m => m.sender === 'copilot').pop()
      if (lastCopilotMessage && !showHint) {
        const timer = setTimeout(() => {
          setShowHint(true)
        }, 60000) // 60 seconds
        
        return () => clearTimeout(timer)
      }
    }
  }, [messages, showHint])

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

  const processStudentResponse = (response) => {
    let copilotResponse = ''
    
    // Simple logic to determine next Socratic question
    if (response.toLowerCase().includes('negative') || response.toLowerCase().includes('minus')) {
      copilotResponse = 'Excellent! Now what happens when we add 25 to both sides?'
    } else if (response.toLowerCase().includes('positive') || response.toLowerCase().includes('plus')) {
      copilotResponse = 'Wait - let me check that. What would -5 + 5 equal?'
    } else if (response.includes('20') || response.includes('twenty')) {
      copilotResponse = 'Perfect! Now we have x² + 5x + 20 = 0. What method could we use to solve this?'
    } else if (response.toLowerCase().includes('factor') || response.toLowerCase().includes('quadratic')) {
      copilotResponse = 'Great choice! Can you see two numbers that multiply to 20 and add to 5?'
    } else {
      copilotResponse = 'Interesting approach. Walk me through your thinking step by step.'
    }

    const newMessage = {
      id: messages.length + 1,
      sender: 'copilot',
      text: copilotResponse,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setShowHint(false) // Reset hint timer
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
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-2xl neon-card"
        >
          {/* Header */}
          <div className="glass-panel border-b p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-verve rounded-full animate-pulse"></div>
                <div>
                  <h2 className="text-2xl font-bold holographic-text">TACTICAL COMMS</h2>
                  <p className="text-sm data-text-secondary mt-1">Recovery Engine Analysis</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs data-text-secondary">CALL SIGN:</div>
                <div className="text-sm font-mono text-verve">{callSign || 'WARRIOR'}</div>
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
                      : 'neon-card text-white data-text'
                  }`}>
                    {message.text}
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
                  disabled={showHint || isThinking}
                  className="phase-btn glass-panel data-text-secondary hover:text-verve disabled:cursor-not-allowed px-4 py-2 text-sm"
                >
                  {showHint ? 'HINT DEPLOYED' : 'DEPLOY HINT'}
                </button>
                <button
                  onClick={handleAbort}
                  className="phase-btn glass-panel data-text-secondary hover:text-forge px-4 py-2 text-sm"
                >
                  ABORT MISSION
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SocraticCoPilot
