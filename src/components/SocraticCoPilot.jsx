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
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-y-0 right-0 w-96 bg-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col"
        style={{ backgroundColor: '#0a0a0b' }}
      >
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <h2 className="text-white font-mono text-sm font-bold">CO-PILOT: Tactical Guidance Active.</h2>
          </div>
          <button
            onClick={handleAbort}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Whiteboard - Current Problem */}
        <div className="bg-slate-800/50 border-b border-slate-700 p-4">
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-2">CURRENT PROBLEM</div>
            <div className="text-amber-400 font-mono text-lg font-bold">
              {currentEquation}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'student' 
                  ? 'bg-orange-500 text-black' 
                  : 'bg-slate-700 text-white font-mono text-sm'
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
              <div className="bg-slate-700 text-white font-mono text-sm p-3 rounded-lg flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                Analyzing response...
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-700 p-4 space-y-3">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your response..."
              className={`flex-1 bg-slate-800 text-white px-4 py-3 rounded-lg font-mono text-sm border-2 transition-all duration-300 outline-none ${
                inputSuccess 
                  ? 'border-green-500' 
                  : 'border-orange-500 focus:border-orange-400 focus:shadow-lg focus:shadow-orange-500/20'
              }`}
              style={{
                boxShadow: inputSuccess ? '0 0 10px rgba(34, 197, 94, 0.3)' : 'none'
              }}
              disabled={isThinking}
            />
            <button
              onClick={handleSendMessage}
              disabled={isThinking || !inputValue.trim()}
              className="bg-orange-500 hover:bg-orange-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-black font-bold px-6 py-3 rounded-lg transition-all duration-300"
            >
              SEND
            </button>
          </div>
          
          {/* Tactical Commands */}
          <div className="flex gap-2">
            <button
              onClick={handleHint}
              disabled={showHint || isThinking}
              className="border border-gray-400 hover:border-orange-400 hover:text-orange-400 disabled:border-gray-600 disabled:text-gray-600 text-gray-400 px-4 py-2 rounded text-sm transition-all duration-300"
            >
              Explain Logic
            </button>
            <button
              onClick={handleAbort}
              className="border border-gray-400 hover:border-red-400 hover:text-red-400 text-gray-400 px-4 py-2 rounded text-sm transition-all duration-300"
            >
              Abort Mission
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SocraticCoPilot
