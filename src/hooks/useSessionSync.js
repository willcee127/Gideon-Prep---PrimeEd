import { useState, useEffect } from 'react'

const useSessionSync = (initialState = {}) => {
  const [sessionData, setSessionData] = useState(initialState)

  // Sync to localStorage on every state change
  useEffect(() => {
    // Save session data to localStorage
    const dataToSave = {
      combatPower: sessionData.combatPower || {},
      radarData: sessionData.radarData || {},
      warriorRank: sessionData.warriorRank || 'Recruit',
      lastActiveSector: sessionData.lastActiveSector || null,
      sessionTimestamp: new Date().toISOString()
    }
    localStorage.setItem('gideon_session_data', JSON.stringify(dataToSave))
  }, [sessionData])

  // Load session data on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('gideon_session_data')
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        setSessionData(prev => ({
          ...prev,
          ...parsedData,
          // Don't overwrite with undefined values
          combatPower: parsedData.combatPower || prev.combatPower,
          radarData: parsedData.radarData || prev.radarData,
          warriorRank: parsedData.warriorRank || prev.warriorRank,
          lastActiveSector: parsedData.lastActiveSector || prev.lastActiveSector
        }))
      }
    } catch (error) {
      console.error('Failed to load session data:', error)
    }
  }, [])

  return {
    sessionData,
    setSessionData,
    updateSessionData: (newData) => {
      setSessionData(prev => {
        const updated = { ...prev, ...newData }
        // Auto-sync to localStorage
        const dataToSave = {
          combatPower: updated.combatPower || {},
          radarData: updated.radarData || {},
          warriorRank: updated.warriorRank || 'Recruit',
          lastActiveSector: updated.lastActiveSector || null,
          sessionTimestamp: new Date().toISOString()
        }
        localStorage.setItem('gideon_session_data', JSON.stringify(dataToSave))
        return updated
      })
    }
  }
}

export default useSessionSync
