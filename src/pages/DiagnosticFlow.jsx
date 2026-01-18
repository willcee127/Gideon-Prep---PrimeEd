import React, { useState } from 'react'
import { motion } from 'framer-motion'
import RangeQual from '../components/RangeQual'
import MiniTraining from '../components/MiniTraining'
import { useNavigate } from 'react-router-dom'

const DiagnosticFlow = () => {
  const [currentStep, setCurrentStep] = useState('diagnostic') // 'diagnostic' | 'training' | 'complete'
  const [terminationLevel, setTerminationLevel] = useState(null)
  const navigate = useNavigate()

  const handleDiagnosticComplete = (level) => {
    setTerminationLevel(String(level))
    setCurrentStep('training')
  }

  const handleTrainingComplete = () => {
    setCurrentStep('complete')
    // Route to mission after a short delay
    setTimeout(() => {
      navigate('/mission')
    }, 2000)
  }

  if (currentStep === 'diagnostic') {
    return <RangeQual onComplete={handleDiagnosticComplete} />
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
