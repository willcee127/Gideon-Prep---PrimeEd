import { useState, useEffect, useRef, useCallback } from 'react'

const useStressSensor = (options = {}) => {
  const {
    rageThreshold = 4, 
    stallThreshold = 20000, 
    jitterThreshold = 50, 
    onStressDetected = () => {},
    onStressCleared = () => {},
    onStressLevelChanged = () => {}
  } = options

  const [stressLevel, setStressLevel] = useState(0) 
  const [isStressed, setIsStressed] = useState(false)
  const [isStalled, setIsStalled] = useState(false)
  const [isJittery, setIsJittery] = useState(false)
  const [isRaging, setIsRaging] = useState(false)
  
  const clickTimesRef = useRef([])
  const lastActivityRef = useRef(Date.now())
  const mousePositionsRef = useRef([])
  const inactivityTimerRef = useRef(null)
  const visibilityRef = useRef(!document.hidden)
  
  // 1. Calculate click velocity
  const calculateClickVelocity = useCallback(() => {
    const now = Date.now()
    const recentClicks = clickTimesRef.current.filter(time => now - time < 2000)
    if (recentClicks.length < 2) return 0
    const timeDiffs = []
    for (let i = 1; i < recentClicks.length; i++) {
      timeDiffs.push(recentClicks[i] - recentClicks[i-1])
    }
    const avgTimeDiff = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length
    return avgTimeDiff > 0 ? Math.min(1000 / avgTimeDiff, 100) : 0
  }, [])

  // 2. Detect erratic mouse movements
  const detectJitter = useCallback(() => {
    const positions = mousePositionsRef.current
    if (positions.length < 10) return false
    let totalDistance = 0
    let directionChanges = 0
    let lastDirection = null
    
    for (let i = 1; i < positions.length; i++) {
      const dx = positions[i].x - positions[i-1].x
      const dy = positions[i].y - positions[i-1].y
      totalDistance += Math.sqrt(dx * dx + dy * dy)
      const currentDirection = Math.atan2(dy, dx)
      if (lastDirection !== null && Math.abs(currentDirection - lastDirection) > Math.PI / 4) {
        directionChanges++
      }
      lastDirection = currentDirection
    }
    return (totalDistance / (positions.length - 1)) > jitterThreshold || (directionChanges / (positions.length - 1)) > 3
  }, [jitterThreshold])

  // 3. Update stress level logic (Simplified dependencies to prevent loops)
  const updateStress = useCallback(() => {
    let newLevel = 0
    let rage = false, jitter = false, stall = false

    const velocity = calculateClickVelocity()
    if (velocity > rageThreshold) { newLevel += 40; rage = true; }
    if (detectJitter()) { newLevel += 30; jitter = true; }
    if (Date.now() - lastActivityRef.current > stallThreshold) { newLevel += 20; stall = true; }
    if (document.hidden) { newLevel += 25; }

    newLevel = Math.min(100, newLevel)
    
    setStressLevel(newLevel)
    setIsStressed(newLevel > 0)
    setIsRaging(rage)
    setIsJittery(jitter)
    setIsStalled(stall)

    if (newLevel > 0) {
      onStressDetected({ level: newLevel, type: rage ? 'rage' : jitter ? 'jitter' : 'general' })
    }
  }, [calculateClickVelocity, detectJitter, rageThreshold, stallThreshold, onStressDetected])

  // 4. Event Handlers
  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now()
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current)
      inactivityTimerRef.current = setTimeout(updateStress, stallThreshold)
      updateStress()
    }

    const handleMouseMove = (e) => {
      mousePositionsRef.current = [...mousePositionsRef.current.slice(-19), { x: e.clientX, y: e.clientY }]
      handleActivity()
    }

    const handleClick = () => {
      clickTimesRef.current = [...clickTimesRef.current.slice(-9), Date.now()]
      handleActivity()
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleActivity)
    document.addEventListener('visibilitychange', updateStress)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleActivity)
      document.removeEventListener('visibilitychange', updateStress)
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current)
    }
  }, [updateStress, stallThreshold])

  return {
    stressLevel,
    isStressed,
    isStalled,
    isJittery,
    isRaging,
    resetStress: () => setStressLevel(0)
  }
}

export default useStressSensor