import { supabase } from '../lib/supabase';

export const reportToCommander = async (payload) => {
  const { call_sign, rank, command_level, last_event, morale_score, zone_id, email } = payload;

  const { data, error } = await supabase
    .from('mission_logs')
    .upsert({ 
      call_sign, 
      rank, 
      command_level, 
      last_event, 
      morale_score, 
      zone_id,
      email,
      updated_at: new Date()
    }, { onConflict: 'call_sign' });

  if (error) console.error('Cloud Sync Error:', error);
  return { data, error };
};

export const logTraumaPoint = async (payload) => {
  const { call_sign, problem_type, zone_id, friction_score } = payload;

  const { data, error } = await supabase
    .from('trauma_logs')
    .insert({ 
      call_sign, 
      problem_type, 
      zone_id, 
      friction_score,
      timestamp: new Date()
    });

  if (error) console.error('Trauma Log Error:', error);
  return { data, error };
};

export const recordMastery = async (payload) => {
  const { call_sign, problem_type, independent_win, zone_id, readiness_score } = payload;

  const { data, error } = await supabase
    .from('mastery_ledger')
    .insert({ 
      call_sign, 
      problem_type, 
      independent_win, 
      zone_id, 
      readiness_score,
      timestamp: new Date()
    });

  if (error) console.error('Mastery Ledger Error:', error);
  return { data, error };
};

export const createUserRecord = async (payload) => {
  const { call_sign, real_name, email } = payload;

  const { data, error } = await supabase
    .from('users')
    .insert({ 
      call_sign, 
      real_name, 
      email,
      subscription_status: 'active',
      created_at: new Date(),
      onboarding_status: {}
    });

  if (error) console.error('User Creation Error:', error);
  return { data, error };
};

export const updateOnboardingStatus = async (callSign, statusType) => {
  try {
    // First get current onboarding status
    const { data: userData } = await supabase
      .from('users')
      .select('onboarding_status')
      .eq('call_sign', callSign)
      .single()

    let currentStatus = {}
    if (userData?.onboarding_status) {
      currentStatus = userData.onboarding_status
    }

    // Update the specific status type
    currentStatus[statusType] = true
    currentStatus[`${statusType}_at`] = new Date().toISOString()

    // Update the user record
    const { data, error } = await supabase
      .from('users')
      .update({ onboarding_status: currentStatus })
      .eq('call_sign', callSign)
      .select()

    if (error) {
      console.error('Onboarding status update error:', error)
      return { error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Onboarding status update error:', error)
    return { error }
  }
}

// Get onboarding status
export const getOnboardingStatus = async (callSign) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('onboarding_status')
      .eq('call_sign', callSign)
      .single()

    if (error) {
      console.error('Onboarding status fetch error:', error)
      return { data: null, error }
    }

    return { data: data?.onboarding_status || {}, error: null }
  } catch (error) {
    console.error('Onboarding status fetch error:', error)
    return { data: null, error }
  }
}

// Forge new medal for warrior
export const forgeMedal = async (callSign, medalId) => {
  try {
    // First get current medals
    const { data: userData } = await supabase
      .from('users')
      .select('medals_earned')
      .eq('call_sign', callSign)
      .single()

    let currentMedals = []
    if (userData?.medals_earned) {
      currentMedals = userData.medals_earned
    }

    // Add new medal if not already earned
    if (!currentMedals.includes(medalId)) {
      currentMedals.push(medalId)
    }

    // Update user record
    const { data, error } = await supabase
      .from('users')
      .update({ 
        medals_earned: currentMedals,
        updated_at: new Date()
      })
      .eq('call_sign', callSign)
      .select()

    if (error) {
      console.error('Medal forging error:', error)
      return { error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Medal forging error:', error)
    return { error }
  }
}

// Track intel unlock from TacticalExtraction
export const trackIntelUnlock = async (callSign, conceptId) => {
  try {
    // First get current intel
    const { data: userData } = await supabase
      .from('users')
      .select('intel_unlocked')
      .eq('call_sign', callSign)
      .single()

    let currentIntel = []
    if (userData?.intel_unlocked) {
      currentIntel = userData.intel_unlocked
    }

    // Add new intel if not already tracked
    if (!currentIntel.includes(conceptId)) {
      currentIntel.push({
        concept_id: conceptId,
        unlocked_at: new Date().toISOString()
      })
    }

    // Update user record
    const { data, error } = await supabase
      .from('users')
      .update({ 
        intel_unlocked: currentIntel,
        updated_at: new Date()
      })
      .eq('call_sign', callSign)
      .select()

    if (error) {
      console.error('Intel tracking error:', error)
      return { error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Intel tracking error:', error)
    return { error }
  }
}

// Update starting sector after RangeQual completion
export const updateStartingSector = async (callSign, finalLevel) => {
  try {
    // Get current onboarding status
    const { data: userData } = await supabase
      .from('users')
      .select('onboarding_status')
      .eq('call_sign', callSign)
      .single()

    let currentStatus = {}
    if (userData?.onboarding_status) {
      currentStatus = userData.onboarding_status
    }

    // Update onboarding status and starting sector
    currentStatus.range_qual_complete = true
    currentStatus.range_qual_completed_at = new Date().toISOString()
    currentStatus.termination_level = finalLevel

    // Forge medals based on final level
    const medalsToForge = []
    if (finalLevel >= 2) medalsToForge.push('basic_ops')
    if (finalLevel >= 5) medalsToForge.push('decimal_raider')
    if (finalLevel >= 8) medalsToForge.push('percent_master')
    if (finalLevel >= 10) medalsToForge.push('algebra_initiate')

    // Update user record
    const { data, error } = await supabase
      .from('users')
      .update({ 
        starting_sector: finalLevel,
        onboarding_status: currentStatus,
        updated_at: new Date()
      })
      .eq('call_sign', callSign)
      .select()

    if (error) {
      console.error('Starting sector update error:', error)
      return { error }
    }

    // Forge earned medals
    for (const medalId of medalsToForge) {
      await forgeMedal(callSign, medalId)
    }

    return { data, error: null, medalsForged: medalsToForge }
  } catch (error) {
    console.error('Starting sector update error:', error)
    return { error }
  }
}

// Fetch intel mapping for current problem
export const fetchIntelMapping = async (problemId) => {
  try {
    const { data, error } = await supabase
      .from('intel_map')
      .select('video_id, recovery_concept_id')
      .eq('problem_id', problemId)
      .single()

    if (error) {
      console.error('Intel mapping fetch error:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Intel mapping fetch error:', error)
    return { data: null, error }
  }
}

// Get Commander Dashboard data
export const getCommanderDashboardData = async () => {
  try {
    // Get total medals forged across all warriors
    const { data: usersData } = await supabase
      .from('users')
      .select('medals_earned')

    const totalMedals = usersData?.reduce((total, user) => {
      return total + (user.medals_earned?.length || 0)
    }, 0) || 0

    // Get top 3 high friction concepts from intel_unlocked
    const { data: intelData } = await supabase
      .from('users')
      .select('intel_unlocked')

    const conceptCounts = {}
    intelData?.forEach(user => {
      if (user.intel_unlocked) {
        user.intel_unlocked.forEach(intel => {
          const concept = intel.concept_id
          conceptCounts[concept] = (conceptCounts[concept] || 0) + 1
        })
      }
    })

    const topFriction = Object.entries(conceptCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([concept, count]) => ({
        concept: concept.replace('_', ' ').toUpperCase(),
        count
      }))

    // Get active warriors with combat power
    const { data: warriorsData } = await supabase
      .from('users')
      .select('call_sign, starting_sector, medals_earned')
      .not('call_sign', 'is', null)

    const activeWarriors = warriorsData?.map(warrior => ({
      call_sign: warrior.call_sign,
      combat_power: (warrior.starting_sector || 1) * 100 + (warrior.medals_earned?.length || 0) * 50
    })).sort((a, b) => b.combat_power - a.combat_power).slice(0, 10) || []

    return {
      totalMedals,
      topFriction,
      activeWarriors,
      error: null
    }
  } catch (error) {
    console.error('Commander dashboard data fetch error:', error)
    return {
      totalMedals: 0,
      topFriction: [],
      activeWarriors: [],
      error
    }
  }
}

// Lock current sector for warrior (Safety Valve)
export const lockCurrentSector = async (callSign) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ 
        sector_locked: true,
        lock_reason: 'Strategic Retreat - 3rd failure',
        locked_at: new Date().toISOString()
      })
      .eq('call_sign', callSign)
      .select()

    if (error) {
      console.error('Sector lock error:', error)
      return { error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Sector lock error:', error)
    return { error }
  }
}

// Check if sector is locked for warrior
export const checkSectorLock = async (callSign) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('sector_locked, lock_reason, locked_at')
      .eq('call_sign', callSign)
      .single()

    if (error) {
      console.error('Sector lock check error:', error)
      return { locked: false, error }
    }

    return { 
      locked: data?.sector_locked || false,
      reason: data?.lock_reason,
      lockedAt: data?.locked_at,
      error: null
    }
  } catch (error) {
    console.error('Sector lock check error:', error)
    return { locked: false, error }
  }
}
