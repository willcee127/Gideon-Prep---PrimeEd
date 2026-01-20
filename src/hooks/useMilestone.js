import { useState, useEffect, useRef } from 'react'

const useMilestone = (combatPower) => {
  const [showCelebration, setShowCelebration] = useState(false)
  const [level4Unlock, setLevel4Unlock] = useState(false)
  const previousPowerRef = useRef(combatPower)
  const celebrationTimeoutRef = useRef(null)
  const level4TimeoutRef = useRef(null)

  useEffect(() => {
    const currentPower = combatPower
    const previousPower = previousPowerRef.current

    // Check if power level increased
    if (currentPower > previousPower && currentPower > 0) {
      setShowCelebration(true)
      
      // Clear any existing timeout
      if (celebrationTimeoutRef.current) {
        clearTimeout(celebrationTimeoutRef.current)
      }
      
      // Hide celebration after 3 seconds
      celebrationTimeoutRef.current = setTimeout(() => {
        setShowCelebration(false)
      }, 3000)
    }

    // Special Level 4 Unlock (3 → 4)
    if (previousPower === 3 && currentPower === 4) {
      setLevel4Unlock(true)
      
      // Clear any existing timeout
      if (level4TimeoutRef.current) {
        clearTimeout(level4TimeoutRef.current)
      }
      
      // Hide Level 4 unlock after 5 seconds
      level4TimeoutRef.current = setTimeout(() => {
        setLevel4Unlock(false)
      }, 5000)
    }

    // Update ref for next comparison
    previousPowerRef.current = currentPower

    // Cleanup timeouts on unmount
    return () => {
      if (celebrationTimeoutRef.current) {
        clearTimeout(celebrationTimeoutRef.current)
      }
      if (level4TimeoutRef.current) {
        clearTimeout(level4TimeoutRef.current)
      }
    }
  }, [combatPower])

  return { showCelebration, level4Unlock }
}

export default useMilestone
