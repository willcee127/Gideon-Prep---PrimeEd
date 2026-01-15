import React, { createContext, useContext, useState, useCallback } from 'react'
import useStressSensor from '../hooks/useStressSensor'
import { supabase } from '../supabase'

const NeuroContext = createContext()

export const useNeuro = () => {
  const context = useContext(NeuroContext)
  if (!context) {
    throw new Error('useNeuro must be used within a NeuroProvider')
  }
  return context
}

export const NeuroProvider = ({ children }) => {
  const [mode, setMode] = useState('VERVE') // VERVE, AURA, FORGE
  const [identityStrikeTrigger, setIdentityStrikeTrigger] = useState(0)
  const [neuralActivity, setNeuralActivity] = useState(0.3)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedNode, setSelectedNode] = useState(null)
  const [practiceMode, setPracticeMode] = useState(false)
  const [isIdentityMirrorVisible, setIsIdentityMirrorVisible] = useState(false)
  const [identityMirrorMessage, setIdentityMirrorMessage] = useState('')
  const [hasKeyToVictory, setHasKeyToVictory] = useState(false)

  const { stressLevel, isStressed, resetStress } = useStressSensor({
    onStressDetected: (stressData) => {
      if (stressData.isRaging || stressData.isJittery) {
        setMode('VERVE')
      }
    }
  })

  // NEW: This function manages the visual themes for the different modes
  const getModeStyles = useCallback(() => {
    switch (mode) {
      case 'FORGE':
        return {
          borderColor: '#D4AF37', // Gold
          glowColor: 'rgba(212, 175, 55, 0.5)',
          blur: '20px',
          title: 'Guardian of Logic'
        }
      case 'AURA':
        return {
          borderColor: '#00008B', // Deep Blue
          glowColor: 'rgba(0, 0, 139, 0.4)',
          blur: '15px',
          title: 'Master of Focus'
        }
      default: // VERVE
        return {
          borderColor: '#E6E6FA', // Lavender
          glowColor: 'rgba(230, 230, 250, 0.3)',
          blur: '10px',
          title: 'Initiate of Verve'
        }
    }
  }, [mode])

  const triggerIdentityStrike = useCallback(() => {
    setIdentityStrikeTrigger(prev => prev + 1)
  }, [])

  const switchMode = useCallback((newMode) => {
    setMode(newMode)
  }, [])

  const value = {
    mode,
    getModeStyles,
    neuralActivity,
    isProcessing,
    identityStrikeTrigger,
    selectedNode,
    practiceMode,
    stressLevel,
    isStressed,
    hasKeyToVictory,
    triggerIdentityStrike,
    switchMode,
    isInVerveMode: mode === 'VERVE',
    isInAuraMode: mode === 'AURA',
    isInForgeMode: mode === 'FORGE'
  }

  return (
    <NeuroContext.Provider value={value}>
      {children}
    </NeuroContext.Provider>
  )
}

export default NeuroProvider