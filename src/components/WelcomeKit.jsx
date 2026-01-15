import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WelcomeKit = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isDeploying, setIsDeploying] = useState(false)

  const steps = [
    {
      id: 1,
      icon: '🗺️',
      title: 'Mission Start',
      description: 'I am one who showed up. I am not my past score; I am my current effort. Every problem is a rep. Every mistake is a recalibration. I am an Overcomer because I am still here.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 2,
      icon: '🌊',
      title: 'The Flow',
      description: 'Verve is for action. Aura is for recalibration. If your stress levels rise, the Command Center will guide you through a reset.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 3,
      icon: '🏆',
      title: 'The Ledger',
      description: 'Your progress is permanent. Watch your Reclaimed Strongholds expand as you build your future.',
      color: 'from-yellow-500 to-yellow-600'
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleDeploy = () => {
    setIsDeploying(true)
    
    // Set isFirstTimeUser to false
    localStorage.setItem('isFirstTimeUser', 'false')
    
    // Trigger deployment animation then complete
    setTimeout(() => {
      onComplete()
    }, 2500)
  }

  const currentStepData = steps[currentStep]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
      >
        {/* Deployment Scan Line Animation */}
        {isDeploying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none"
          >
            <motion.div
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_#3B82F6]"
              animate={{ y: ['-10vh', '110vh'] }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute left-0 right-0 h-2 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"
              animate={{ y: ['-10vh', '110vh'] }}
              transition={{ duration: 2.5, ease: 'easeInOut', delay: 0.1 }}
            />
          </motion.div>
        )}

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-2xl w-full mx-4"
        >
          <div className={`bg-gradient-to-br ${currentStepData.color} bg-opacity-10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl`}>
            {/* Progress Indicators */}
            <div className="flex justify-center space-x-2 mb-8">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-white scale-125 shadow-lg shadow-white/50'
                      : index < currentStep
                      ? 'bg-white/80'
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>

            {/* Step Content */}
            <div className="text-center space-y-6">
              {/* Step Icon - High Contrast */}
              <motion.div
                key={currentStep}
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40 shadow-xl"
              >
                <span className="text-5xl filter drop-shadow-lg">{currentStepData.icon}</span>
              </motion.div>

              {/* Step Title - Warm but Strong */}
              <motion.h2
                key={`title-${currentStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-white mb-2 drop-shadow-lg"
              >
                {currentStepData.title}
              </motion.h2>

              {/* Step Description - High Contrast */}
              <motion.p
                key={`desc-${currentStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-white/95 leading-relaxed max-w-md mx-auto font-medium drop-shadow"
              >
                {currentStepData.description}
              </motion.p>

              {/* Navigation Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex justify-center space-x-4 pt-4"
              >
                {/* Previous Button */}
                {currentStep > 0 && !isDeploying && (
                  <button
                    onClick={handlePrevious}
                    className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition backdrop-blur-sm border border-white/30"
                  >
                    Previous
                  </button>
                )}

                {/* Deploy Button */}
                {!isDeploying && (
                  <button
                    onClick={handleDeploy}
                    className={`px-8 py-4 bg-gradient-to-r ${currentStepData.color} hover:opacity-90 text-white rounded-lg font-bold transition transform hover:scale-105 shadow-lg text-lg`}
                  >
                    {currentStep < steps.length - 1 ? 'Next Step' : 'INITIALIZE COMMAND CENTER'}
                  </button>
                )}

                {/* Deploying State */}
                {isDeploying && (
                  <div className="flex items-center space-x-3 text-white">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span className="font-bold text-lg">Deploying Command Center...</span>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Skip Option */}
            {!isDeploying && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={handleDeploy}
                className="absolute top-4 right-4 text-white/70 hover:text-white text-sm underline transition"
              >
                Skip Briefing
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default WelcomeKit
