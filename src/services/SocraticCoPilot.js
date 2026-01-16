// Socratic CoPilot Service with Ghost Protocol Integration
class SocraticCoPilot {
  constructor() {
    this.frictionCount = new Map() // Track failures per concept
    this.interventionActive = false
    this.currentConcept = null
    this.interventionHistory = []
  }

  // Track concept failures to trigger Ghost Protocol
  trackFriction(conceptId) {
    const currentCount = this.frictionCount.get(conceptId) || 0
    this.frictionCount.set(conceptId, currentCount + 1)
    
    // Check for Ghost Protocol trigger (2 failures)
    if (currentCount >= 2) {
      this.triggerIntervention(conceptId)
    }
  }

  // Trigger Ghost Protocol intervention
  triggerIntervention(conceptId) {
    this.interventionActive = true
    this.interventionHistory.push({
      conceptId,
      timestamp: new Date().toISOString(),
      type: 'GHOST_PROTOCOL_ACTIVATED',
      message: `Critical friction detected in ${conceptId}. Activating Warrior Identity Protection.`
    })

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
        "Warrior, hold your position. The system detects high friction. Let's break this down systematically."

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
      message: `Student demonstrated understanding in ${conceptId}. Ghost Protocol deactivated.`
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
