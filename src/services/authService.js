import { supabase } from './supabase'

// Read user profile on login
export const getUserProfileOnLogin = async (callSign) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('starting_sector, medals_earned, intel_unlocked, onboarding_status, sector_locked, lock_reason')
      .eq('call_sign', callSign)
      .single()

    if (error) {
      console.error('User profile fetch error:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('User profile fetch error:', error)
    return { data: null, error }
  }
}

// Check if user needs RangeQual
export const needsRangeQual = (userProfile) => {
  if (!userProfile) return true
  
  const onboardingStatus = userProfile.onboarding_status || {}
  return !onboardingStatus.range_qual_complete
}

// Check if sector is locked
export const isSectorLocked = (userProfile) => {
  if (!userProfile) return false
  
  return userProfile.sector_locked || false
}

// Get current sector for user
export const getCurrentSector = (userProfile) => {
  if (!userProfile) return 1
  
  return userProfile.starting_sector || 1
}

// Initialize user session with profile data
export const initializeUserSession = async (callSign) => {
  try {
    const { data: userProfile, error } = await getUserProfileOnLogin(callSign)
    
    if (error) {
      console.error('Failed to initialize user session:', error)
      return { userProfile: null, error }
    }

    // Store profile data in localStorage for immediate access
    if (userProfile) {
      localStorage.setItem('gideon_user_profile', JSON.stringify(userProfile))
      localStorage.setItem('gideon_starting_sector', userProfile.starting_sector || 1)
      localStorage.setItem('gideon_medals_earned', JSON.stringify(userProfile.medals_earned || []))
      localStorage.setItem('gideon_intel_unlocked', JSON.stringify(userProfile.intel_unlocked || []))
    }

    return { userProfile, error: null }
  } catch (error) {
    console.error('User session initialization error:', error)
    return { userProfile: null, error }
  }
}

// Clear user session
export const clearUserSession = () => {
  localStorage.removeItem('gideon_user_profile')
  localStorage.removeItem('gideon_starting_sector')
  localStorage.removeItem('gideon_medals_earned')
  localStorage.removeItem('gideon_intel_unlocked')
}
