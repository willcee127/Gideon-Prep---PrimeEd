import React, { useState, useEffect } from 'react'

const SocraticSafetyValve = ({ 
  sessionData, 
  setSessionData,
  onStallDetected,
  stallThreshold = 30000 // 30 seconds without progress
}) => {
  const [stallTimer, setStallTimer] = useState(null)
  const [lastProgressTime, setLastProgressTime] = useState(Date.now())
  const [isStalled, setIsStalled] = useState(false)

  // Monitor for stall events
  useEffect(() => {
    const checkForStall = () => {
      const now = Date.now()
      const timeSinceLastProgress = now - lastProgressTime
      
      if (timeSinceLastProgress > stallThreshold && !isStalled) {
        setIsStalled(true)
        if (onStallDetected) {
          onStallDetected({
            stalled: true,
            timeSinceLastProgress,
            currentSector: sessionData.lastActiveSector,
            combatPower: sessionData.combatPower.average
          })
        }
      }
    }

    const timer = setInterval(checkForStall, 5000) // Check every 5 seconds
    setStallTimer(timer)

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [lastProgressTime, isStalled, stallThreshold, onStallDetected, sessionData])

  // Reset stall timer when progress is made
  const resetStallTimer = () => {
    setLastProgressTime(Date.now())
    setIsStalled(false)
  }

  // Bridge Gap Protocol responses - Physical Analogies Only
  const getBridgeGapResponse = (sector, difficulty) => {
    const responses = {
      'Quadratic Equations': {
        analogy: 'Imagine this is a balanced seesaw. We need to find the perfect balance point where both sides are equal.',
        simplified: 'What two weights (numbers) multiply to 6 and add up to 5? Think of it like finding two numbers that balance the seesaw.',
        visual: 'seesaw'
      },
      'Linear Functions': {
        analogy: 'Picture a straight road going up a hill. The slope tells us how steep the hill is.',
        simplified: 'If we start at height 3 and go up 2 units for every 1 unit forward, where do we end up?',
        visual: 'hill'
      },
      'Polynomial Division': {
        analogy: 'Think of sharing cookies equally among friends. We\'re dividing a big batch into equal smaller groups.',
        simplified: 'If we have 12 cookies and 3 friends, how many cookies does each friend get?',
        visual: 'cookies'
      },
      'Coordinate Geometry': {
        analogy: 'Imagine a treasure map. Each point has coordinates (x, y) that tell us exactly where the treasure is buried.',
        simplified: 'If the treasure is at (3, 4), how far is it from our starting point at (0, 0)?',
        visual: 'map'
      }
    }
    
    return responses[sector] || {
      analogy: 'Think of this like building with blocks. Each step adds another block to our tower.',
      simplified: 'What\'s the first block we should add to make our tower stable?',
      visual: 'blocks'
    }
  }

  // Trigger Bridge Gap Protocol
  const triggerBridgeGap = () => {
    const currentSector = sessionData.lastActiveSector || 'Unknown'
    const currentDifficulty = sessionData.combatPower.average || 0
    const response = getBridgeGapResponse(currentSector, currentDifficulty)
    
    return {
      isActive: true,
      sector: currentSector,
      difficulty: currentDifficulty,
      analogy: response.analogy,
      simplified: response.simplified,
      timestamp: new Date().toISOString()
    }
  }

  return {
    isStalled,
    resetStallTimer,
    triggerBridgeGap,
    bridgeGapActive: isStalled
  }
}

export default SocraticSafetyValve
