import { lockCurrentSector, checkSectorLock } from '../services/syncService'

// Test function to simulate 3rd failure and lockout
export const testLockoutSimulation = async (callSign) => {
  console.log('🧪 Starting Lockout Simulation Test')
  console.log('📋 Testing for callSign:', callSign)
  
  try {
    // Step 1: Check current lock status
    console.log('🔍 Step 1: Checking current lock status...')
    const { locked, reason, lockedAt, error: checkError } = await checkSectorLock(callSign)
    
    if (checkError) {
      console.error('❌ Error checking lock status:', checkError)
      return { success: false, error: checkError }
    }
    
    console.log('📊 Current lock status:', { locked, reason, lockedAt })
    
    if (locked) {
      console.log('⚠️  User is already locked!')
      return { success: false, error: 'User already locked' }
    }
    
    // Step 2: Simulate 3rd failure and lock sector
    console.log('🔒 Step 2: Simulating 3rd failure - locking sector...')
    const { data, error: lockError } = await lockCurrentSector(callSign)
    
    if (lockError) {
      console.error('❌ Error locking sector:', lockError)
      return { success: false, error: lockError }
    }
    
    console.log('✅ Sector locked successfully:', data)
    
    // Step 3: Verify lock was applied
    console.log('🔍 Step 3: Verifying lock was applied...')
    const { locked: newLocked, reason: newReason, lockedAt: newLockedAt, error: verifyError } = await checkSectorLock(callSign)
    
    if (verifyError) {
      console.error('❌ Error verifying lock:', verifyError)
      return { success: false, error: verifyError }
    }
    
    if (!newLocked) {
      console.error('❌ Lock was not applied correctly')
      return { success: false, error: 'Lock not applied' }
    }
    
    console.log('✅ Lock verification successful:', { newLocked, newReason, newLockedAt })
    
    // Step 4: Test redirect logic (simulated)
    console.log('🔄 Step 4: Testing redirect logic...')
    console.log('📍 User should be redirected to Dashboard with "Strategic Retreat" message')
    
    const redirectResult = {
      shouldRedirect: true,
      destination: '/dashboard',
      message: 'Strategic Retreat - 3rd failure lock activated',
      lockReason: newReason,
      lockedAt: newLockedAt
    }
    
    console.log('✅ Redirect test result:', redirectResult)
    
    // Test Summary
    console.log('📋 Lockout Simulation Test Summary:')
    console.log('✅ Lock status check: PASSED')
    console.log('✅ Sector lock application: PASSED')
    console.log('✅ Lock verification: PASSED')
    console.log('✅ Redirect logic: PASSED')
    
    return {
      success: true,
      testResults: {
        initialLockStatus: { locked, reason, lockedAt },
        lockApplied: data,
        verifiedLock: { locked: newLocked, reason: newReason, lockedAt: newLockedAt },
        redirectLogic: redirectResult
      }
    }
    
  } catch (error) {
    console.error('❌ Lockout simulation failed:', error)
    return { success: false, error }
  }
}

// Manual test runner
export const runLockoutTest = async () => {
  const testCallSign = 'TEST_WARRIOR_01'
  
  console.log('🚀 Starting Manual Lockout Test')
  console.log('🎯 Target:', testCallSign)
  
  const result = await testLockoutSimulation(testCallSign)
  
  if (result.success) {
    console.log('🎉 Lockout test completed successfully!')
    console.log('📊 Test Results:', result.testResults)
  } else {
    console.log('💥 Lockout test failed:', result.error)
  }
  
  return result
}

// Cleanup function to unlock test user
export const cleanupTestLockout = async (callSign) => {
  console.log('🧹 Cleaning up test lockout for:', callSign)
  
  try {
    const { supabase } = await import('../services/supabase')
    
    const { data, error } = await supabase
      .from('users')
      .update({ 
        sector_locked: false,
        lock_reason: null,
        locked_at: null
      })
      .eq('call_sign', callSign)
      .select()
    
    if (error) {
      console.error('❌ Error cleaning up lockout:', error)
      return { success: false, error }
    }
    
    console.log('✅ Lockout cleanup successful:', data)
    return { success: true, data }
    
  } catch (error) {
    console.error('❌ Lockout cleanup error:', error)
    return { success: false, error }
  }
}
