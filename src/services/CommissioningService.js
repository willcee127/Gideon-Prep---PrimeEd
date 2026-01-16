// Commissioning Service - Tracks 100% mastery milestone and economic impact
class CommissioningService {
  constructor() {
    this.commissionMilestones = new Map()
    this.totalCompletions = 0
    this.lifetimeWealth = 0
    this.annualWageBoost = 0
  }

  // Track 100% mastery milestone
  trackMilestone100k() {
    const currentProgress = (this.totalCompletions / 100000) * 100
    
    // Check if milestone reached
    if (currentProgress >= 100 && !this.commissionMilestones.has('100k_milestone')) {
      this.commissionMilestones.set('100k_milestone', {
        timestamp: new Date().toISOString(),
        type: 'COMMISSION_MILESTONE',
        message: '🎉 100K WARRIORS SERVED - Phase 03: Applied Math Complete',
        data: {
          completions: this.totalCompletions,
          lifetimeWealth: this.totalCompletions * 266760,
          annualWageBoost: this.totalCompletions * 8892
        }
      })

      // Trigger celebration and commissioning
      this.triggerCommissioning()
    }
  }

  // Calculate economic impact
  calculateEconomicImpact() {
    const wealth = this.totalCompletions * 266760
    const wageBoost = this.totalCompletions * 8892
    return {
      lifetimeWealth: wealth,
      annualWageBoost: wageBoost,
      totalCompletions: this.totalCompletions
      impactMessage: `💰 Economic Impact: $${wageBoost.toLocaleString()} annual wage boost for ${this.totalCompletions} warriors`
    }
  }

  // Trigger commissioning event
  triggerCommissioning() {
    const impact = this.calculateEconomicImpact()
    
    // You could integrate with Supabase here to save the milestone
    console.log('Commissioning milestone reached:', impact.impactMessage)
    
    // Or trigger a local celebration
    if (typeof window !== 'undefined') {
      alert(`🎉 ${impact.impactMessage}`)
    }
  }

  // Get current stats
  getCurrentStats() {
    return {
      totalCompletions: this.totalCompletions,
      lifetimeWealth: this.lifetimeWealth,
      annualWageBoost: this.annualWageBoost,
      progressTo100k: (this.totalCompletions / 100000) * 100,
      hasReached100k: this.commissionMilestones.has('100k_milestone')
    }
  }

  // Initialize with existing data
  async initialize() {
    try {
      // You could fetch existing stats from Supabase
      const { data } = await supabase
        .from('user_profiles')
        .select('total_completions, lifetime_wealth, annual_wage_boost, milestones')
        .eq('id', (await supabase.auth.getUser())?.user?.id)
        .single()

      if (data) {
        this.totalCompletions = data.total_completions || 0
        this.lifetimeWealth = data.lifetime_wealth || 0
        this.annualWageBoost = data.annual_wage_boost || 0
        
        // Load existing milestones
        if (data.milestones) {
          data.milestones.forEach(milestone => {
            this.commissionMilestones.set(milestone.milestone_type, {
              timestamp: milestone.timestamp,
              type: milestone.type,
              message: milestone.message,
              data: milestone.data
            })
          })
        }
      }
    } catch (error) {
      console.error('Failed to initialize CommissioningService:', error)
    }
  }
}

export default CommissioningService
