import { useState, useEffect, useRef } from 'react'

const useMilestone = (combatPower) => {
  const [showCelebration, setShowCelebration] = useState(false)
  const previousPowerRef = useRef(combatPower)
  const celebrationTimeoutRef = useRef(null)

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

    // Update ref for next comparison
    previousPowerRef.current = currentPower

    // Cleanup timeout on unmount
    return () => {
      if (celebrationTimeoutRef.current) {
        clearTimeout(celebrationTimeoutRef.current)
      }
    }
  }, [combatPower])

  return { showCelebration }
}

export default useMilestone
