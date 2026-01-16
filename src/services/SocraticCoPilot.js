// Socratic CoPilot Service with Tactical Intel Integration
class SocraticCoPilot {
  constructor() {
    this.frictionCount = new Map() // Track failures per concept
    this.interventionActive = false
    this.currentConcept = null
    this.interventionHistory = []
  }

  // Track concept failures to trigger Tactical Intel
  trackFriction(conceptId) {
    const currentCount = this.frictionCount.get(conceptId) || 0
    this.frictionCount.set(conceptId, currentCount + 1)
    
    // Check for Tactical Intel trigger (2 failures)
    if (currentCount >= 2) {
      this.triggerIntervention(conceptId)
    }
  }

  // Trigger Tactical Intel intervention
  triggerIntervention(conceptId) {
    this.interventionActive = true
    this.interventionHistory.push({
      conceptId,
      timestamp: new Date().toISOString(),
      type: 'TACTICAL_INTEL_DEPLOYED',
      message: `High friction detected in ${conceptId}. Deploying Tactical Intel for breakthrough.`
    })
  }

  // Socratic hint generation with intervention-aware messaging
  generateSocraticHint(problem, conceptId, failureCount) {
    const baseMessages = [
      "Let's look at this problem together.",
      "What do you notice about the structure?",
      "Which part seems most challenging?",
      "Can you think of a similar problem you've solved before?",
    ]

    // If intervention is active, use protective messaging
    if (this.interventionActive) {
      const interventionIndex = Math.floor(Math.random() * baseMessages.length)
      const protectiveMessage = baseMessages[interventionIndex] || 
        "Warrior, hold your position. You aren't failing; you've hit a high-friction zone that stops most. We are deploying intel to help you break through what previously held you back."

    return {
      hint: protectiveMessage,
      requiresIntervention: this.interventionActive
    }
  }

  // Reset intervention when student shows understanding
  resetIntervention(conceptId) {
    this.interventionActive = false
    this.currentConcept = null
    this.interventionHistory.push({
      conceptId,
      timestamp: new Date().toISOString(),
      type: 'INTERVENTION_SUCCESS',
      message: `Student demonstrated understanding in ${conceptId}. Tactical Intel deactivated.`
    })
  }

  // Get intervention history
  getInterventionHistory() {
    return this.interventionHistory
  }

  // Get current friction data
  getFrictionData() {
    const data = {}
    this.frictionCount.forEach((count, concept) => {
      data[concept] = count
    })
    return data
  }
}

export default SocraticCoPilot
