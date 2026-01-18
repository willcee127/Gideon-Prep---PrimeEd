import React, { useState } from 'react'
import { motion } from 'framer-motion'
import RangeQual from '../components/RangeQual'
import MiniTraining from '../components/MiniTraining'
import SocraticCoPilot from '../components/SocraticCoPilot'
import { useNavigate } from 'react-router-dom'

const DiagnosticFlow = () => {
  const [currentStep, setCurrentStep] = useState('diagnostic') // 'diagnostic' | 'training' | 'complete'
  const [terminationLevel, setTerminationLevel] = useState(null)
  const [showCoPilot, setShowCoPilot] = useState(false)
  const [activeProblem, setActiveProblem] = useState(null)
  const [lastWrongAnswer, setLastWrongAnswer] = useState('')
  const navigate = useNavigate()

  const handleDiagnosticComplete = (level) => {
    setTerminationLevel(String(level))
    
    // Check for high friction and trigger Co-Pilot
    if (level && level < 60) {
      setActiveProblem({
        id: 'quadratic_equations',
        concept: 'Quadratic Equations',
        equation: 'x² + 5x + 6 = 0',
        difficulty: level
      })
      setShowCoPilot(true)
    } else {
      setCurrentStep('training')
    }
  }

  const handleTrainingComplete = () => {
    setCurrentStep('complete')
    // Route to mission after a short delay
    setTimeout(() => {
      navigate('/mission')
    }, 2000)
  }

  const handleBreakthrough = () => {
    setShowCoPilot(false)
    setActiveProblem(null)
    setCurrentStep('training')
  }

  const handleCoPilotClose = () => {
    setShowCoPilot(false)
  }

  if (currentStep === 'diagnostic') {
    return (
      <>
        <RangeQual onComplete={handleDiagnosticComplete} />
        <SocraticCoPilot 
          isOpen={showCoPilot}
          problemData={activeProblem}
          studentMistake={lastWrongAnswer}
          onBreakthrough={handleBreakthrough}
          onClose={handleCoPilotClose}
        />
      </>
    )
  }

  if (currentStep === 'training') {
    return <MiniTraining onComplete={handleTrainingComplete} terminationLevel={String(terminationLevel)} />
  }

  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: '#0a0a0b'}}>
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-6xl mb-4"
          >
            🎯
          </motion.div>
          <h1 className="text-3xl font-bold text-amber-400" style={{ fontFamily: 'Courier New, monospace' }}>
            TRAINING INITIALIZED
          </h1>
          <p className="text-gray-300 text-lg">
            Redirecting to your mission briefing...
          </p>
          <div className="animate-pulse text-cyan-400">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default DiagnosticFlow
