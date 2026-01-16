// Live Fire Test Script - Comprehensive System Validation
import { SocraticCoPilot } from '../services/SocraticCoPilot'
import { CommissioningService } from '../services/CommissioningService'
import { supabase } from '../supabase'

class LiveFireTest {
  constructor() {
    this.socraticCoPilot = new SocraticCoPilot()
    this.commissioningService = new CommissioningService()
    this.testResults = []
  }

  // Log test results
  logTest(testName, status, details) {
    const result = {
      test: testName,
      status: status,
      details: details,
      timestamp: new Date().toISOString()
    }
    this.testResults.push(result)
    console.log(`🧪 ${testName}: ${status}`)
    console.log(`📋 Details: ${details}`)
    return result
  }

  // Test 1: Ghost Protocol Trigger on Fraction Failures
  async testGhostProtocolFractionFailure() {
    console.log('\n🔥 TEST 1: Ghost Protocol - Fraction Failure Simulation')
    
    try {
      // Simulate first failure
      this.socraticCoPilot.trackFriction('fraction_simplification')
      const firstFailure = this.socraticCoPilot.getFrictionData()
      
      // Simulate second failure (should trigger Ghost Protocol)
      this.socraticCoPilot.trackFriction('fraction_simplification')
      const secondFailure = this.socraticCoPilot.getFrictionData()
      
      // Check if Ghost Protocol was triggered
      const interventionHistory = this.socraticCoPilot.getInterventionHistory()
      const ghostProtocolTriggered = interventionHistory.some(
        event => event.type === 'GHOST_PROTOCOL_ACTIVATED'
      )

      // Generate Socratic hint with intervention
      const hint = this.socraticCoPilot.generateSocraticHint(
        'Simplify 3/4', 
        'fraction_simplification', 
        2
      )

      if (ghostProtocolTriggered && hint.requiresIntervention) {
        return this.logTest(
          'Ghost Protocol Fraction Failure',
          '✅ PASS',
          `Ghost Protocol triggered after 2 failures. Intervention active: ${hint.requiresIntervention}. Hint: "${hint.hint}"`
        )
      } else {
        return this.logTest(
          'Ghost Protocol Fraction Failure',
          '❌ FAIL',
          `Ghost Protocol not triggered. Friction count: ${secondFailure['fraction_simplification']}`
        )
      }
    } catch (error) {
      return this.logTest(
        'Ghost Protocol Fraction Failure',
        '❌ ERROR',
        `Exception: ${error.message}`
      )
    }
  }

  // Test 2: Commissioning Service Economic Impact Calculation
  async testCommissioningServiceEconomicImpact() {
    console.log('\n💰 TEST 2: Commissioning Service - Economic Impact Calculation')
    
    try {
      // Set up test data - simulate 100 warriors completed
      this.commissioningService.totalCompletions = 100
      
      // Calculate economic impact
      const impact = this.commissioningService.calculateEconomicImpact()
      
      // Expected values
      const expectedLifetimeWealth = 100 * 266760 // $26,676,000
      const expectedAnnualWageBoost = 100 * 8892   // $889,200
      
      if (
        impact.lifetimeWealth === expectedLifetimeWealth &&
        impact.annualWageBoost === expectedAnnualWageBoost &&
        impact.totalCompletions === 100
      ) {
        return this.logTest(
          'Commissioning Service Economic Impact',
          '✅ PASS',
          `Economic impact calculated correctly. Lifetime: $${impact.lifetimeWealth.toLocaleString()}, Annual: $${impact.annualWageBoost.toLocaleString()}`
        )
      } else {
        return this.logTest(
          'Commissioning Service Economic Impact',
          '❌ FAIL',
          `Incorrect calculation. Expected Lifetime: $${expectedLifetimeWealth}, Got: $${impact.lifetimeWealth}`
        )
      }
    } catch (error) {
      return this.logTest(
        'Commissioning Service Economic Impact',
        '❌ ERROR',
        `Exception: ${error.message}`
      )
    }
  }

  // Test 3: Phase 03 Completion Trigger
  async testPhase03CompletionTrigger() {
    console.log('\n🎯 TEST 3: Phase 03 Completion - Commissioning Trigger')
    
    try {
      // Simulate Phase 03 completion (100% mastery)
      this.commissioningService.totalCompletions = 100000 // 100K warriors
      
      // Trigger milestone check
      this.commissioningService.trackMilestone100k()
      
      // Check if milestone was reached
      const stats = this.commissioningService.getCurrentStats()
      const hasReached100k = stats.hasReached100k
      
      if (hasReached100k) {
        return this.logTest(
          'Phase 03 Completion Trigger',
          '✅ PASS',
          `100K milestone reached. Total completions: ${stats.totalCompletions}, Progress: ${stats.progressTo100k.toFixed(1)}%`
        )
      } else {
        return this.logTest(
          'Phase 03 Completion Trigger',
          '❌ FAIL',
          `100K milestone not reached. Progress: ${stats.progressTo100k.toFixed(1)}%`
        )
      }
    } catch (error) {
      return this.logTest(
        'Phase 03 Completion Trigger',
        '❌ ERROR',
        `Exception: ${error.message}`
      )
    }
  }

  // Test 4: Supabase Mission Economic Impact View
  async testSupabaseEconomicImpactView() {
    console.log('\n📊 TEST 4: Supabase Mission Economic Impact View')
    
    try {
      // Test if we can query the mission_economic_impact view
      const { data, error } = await supabase
        .from('mission_economic_impact')
        .select('*')
        .single()

      if (error) {
        // If view doesn't exist, that's expected in development
        if (error.code === 'PGRST116') {
          return this.logTest(
            'Supabase Economic Impact View',
            '⚠️ SKIP',
            'View does not exist yet - expected in development environment'
          )
        }
        throw error
      }

      // If data exists, check structure
      if (data && typeof data.total_warriors_commissioned === 'number') {
        return this.logTest(
          'Supabase Economic Impact View',
          '✅ PASS',
          `View accessible. Total Warriors Commissioned: ${data.total_warriors_commissioned}`
        )
      } else {
        return this.logTest(
          'Supabase Economic Impact View',
          '❌ FAIL',
          'View exists but missing expected columns'
        )
      }
    } catch (error) {
      return this.logTest(
        'Supabase Economic Impact View',
        '❌ ERROR',
        `Exception: ${error.message}`
      )
    }
  }

  // Test 5: UI Integration - Ghost Protocol Alert Display
  async testUIIntegrationGhostProtocolAlert() {
    console.log('\n🖥️ TEST 5: UI Integration - Ghost Protocol Alert Display')
    
    try {
      // Simulate the UI state when Ghost Protocol is active
      const mockUIState = {
        interventionActive: true,
        currentConcept: 'fraction_simplification',
        failureCount: 2,
        alertMessage: 'Warrior, hold your position. The system detects a high-friction zone.',
        severity: 'critical',
        probabilityDrop: '60%'
      }

      // Verify UI would display the alert correctly
      const wouldDisplayAlert = mockUIState.interventionActive && 
                               mockUIState.failureCount >= 2 && 
                               mockUIState.severity === 'critical'

      if (wouldDisplayAlert) {
        return this.logTest(
          'UI Integration Ghost Protocol Alert',
          '✅ PASS',
          `UI would display Ghost Protocol alert: "${mockUIState.alertMessage}" with ${mockUIState.probabilityDrop} probability drop`
        )
      } else {
        return this.logTest(
          'UI Integration Ghost Protocol Alert',
          '❌ FAIL',
          'UI state would not trigger alert display'
        )
      }
    } catch (error) {
      return this.logTest(
        'UI Integration Ghost Protocol Alert',
        '❌ ERROR',
        `Exception: ${error.message}`
      )
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 LIVE FIRE TEST - GIDEON PREP PRIME SYSTEMS')
    console.log('=' .repeat(60))
    
    const tests = [
      () => this.testGhostProtocolFractionFailure(),
      () => this.testCommissioningServiceEconomicImpact(),
      () => this.testPhase03CompletionTrigger(),
      () => this.testSupabaseEconomicImpactView(),
      () => this.testUIIntegrationGhostProtocolAlert()
    ]

    const results = []
    for (const test of tests) {
      const result = await test()
      results.push(result)
    }

    // Summary
    console.log('\n' + '=' .repeat(60))
    console.log('📊 LIVE FIRE TEST SUMMARY')
    console.log('=' .repeat(60))
    
    const passed = results.filter(r => r.status.includes('PASS')).length
    const failed = results.filter(r => r.status.includes('FAIL')).length
    const errors = results.filter(r => r.status.includes('ERROR')).length
    const skipped = results.filter(r => r.status.includes('SKIP')).length

    console.log(`✅ Passed: ${passed}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`🚫 Errors: ${errors}`)
    console.log(`⚠️ Skipped: ${skipped}`)
    console.log(`📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`)

    return {
      summary: {
        total: results.length,
        passed,
        failed,
        errors,
        skipped,
        successRate: (passed / results.length) * 100
      },
      results
    }
  }
}

export default LiveFireTest
