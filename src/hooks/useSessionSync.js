import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const useSessionSync = (initialState = {}) => {
  const [sessionData, setSessionData] = useState(() => {
    try {
      const stored = localStorage.getItem('gideon_session_data')
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          ...initialState,
          ...parsed,
          completedNodes: parsed.completedNodes || [],
          // Ensure all required fields exist
          combatPower: {
            ...initialState.combatPower,
            ...parsed.combatPower
          },
          radarData: {
            ...initialState.radarData,
            ...parsed.radarData
          },
          warriorRank: parsed.warriorRank || 'Recruit',
          lastActiveSector: parsed.lastActiveSector || null,
          // New deployment fields
          deployment_step: parsed.deployment_step || 0,
          registration_complete: parsed.registration_complete || false,
          is_mission_ready: parsed.is_mission_ready || false
        }
      }
    } catch (error) {
      console.error('Failed to parse session data:', error)
      return {
        ...initialState,
        completedNodes: [],
        deployment_step: 0,
        registration_complete: false,
        is_mission_ready: false
      }
    }
    return {
      ...initialState,
      completedNodes: [],
      deployment_step: 0,
      registration_complete: false,
      is_mission_ready: false
    }
  })

  // Auto-sync to Supabase when combat power reaches 145+
  useEffect(() => {
    if (sessionData.combatPower?.average >= 145 && !sessionData.is_mission_ready) {
      // Set mission ready status in local state first
      setSessionData(prev => ({ ...prev, is_mission_ready: true }))
      
      // Then sync to Supabase in background
      supabase.from('profiles').upsert({
        user_id: sessionData.user_id || 'anonymous',
        is_mission_ready: true,
        combat_power: sessionData.combatPower.average,
        updated_at: new Date().toISOString()
      }).then(({ error }) => {
        if (error) {
          console.error('Failed to sync mission ready status to Supabase:', error)
        } else {
          console.log('Mission ready status synced to Supabase successfully')
        }
      })
    }
  }, [sessionData.combatPower?.average, sessionData.is_mission_ready])

  // Auto-sync deployment_step and registration_complete changes to Supabase
  useEffect(() => {
    if (sessionData.deployment_step > 0 || sessionData.registration_complete) {
      supabase.from('profiles').upsert({
        user_id: sessionData.user_id || 'anonymous',
        deployment_step: sessionData.deployment_step,
        registration_complete: sessionData.registration_complete,
        updated_at: new Date().toISOString()
      }).then(({ error }) => {
        if (error) {
          console.error('Failed to sync deployment status to Supabase:', error)
        } else {
          console.log('Deployment status synced to Supabase successfully')
        }
      })
    }
  }, [sessionData.deployment_step, sessionData.registration_complete])

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    try {
      const dataToSave = {
        combatPower: sessionData.combatPower || {},
        radarData: sessionData.radarData || {},
        warriorRank: sessionData.warriorRank || 'Recruit',
        lastActiveSector: sessionData.lastActiveSector || null,
        completedNodes: sessionData.completedNodes || [],
        // New deployment fields
        deployment_step: sessionData.deployment_step || 0,
        registration_complete: sessionData.registration_complete || false,
        is_mission_ready: sessionData.is_mission_ready || false,
        sessionTimestamp: new Date().toISOString()
      }
      localStorage.setItem('gideon_session_data', JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Failed to save session data:', error)
    }
  }, [sessionData])

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
          completedNodes: updated.completedNodes || [],
          // New deployment fields
          deployment_step: updated.deployment_step || 0,
          registration_complete: updated.registration_complete || false,
          is_mission_ready: updated.is_mission_ready || false,
          sessionTimestamp: new Date().toISOString()
        }
        localStorage.setItem('gideon_session_data', JSON.stringify(dataToSave))
        return updated
      })
    }
  }
}

export default useSessionSync
