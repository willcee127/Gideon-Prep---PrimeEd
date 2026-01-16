// Socratic CoPilot Service with Tactical Intel Integration
import React, { useState } from 'react'

const SocraticCoPilot = () => {
  const [frictionCount, setFrictionCount] = useState(new Map())
  const [interventionActive, setInterventionActive] = useState(false)
  const [currentConcept, setCurrentConcept] = useState(null)
  const [interventionHistory, setInterventionHistory] = useState([])

  // Track concept failures to trigger Tactical Intel
  const trackFriction = (conceptId) => {
    const currentCount = frictionCount.get(conceptId) || 0
    setFrictionCount(new Map(frictionCount.set(conceptId, currentCount + 1)))
    
    // Check for Tactical Intel trigger (2 failures)
    if (currentCount >= 2) {
      deployTacticalIntel(conceptId)
    }
  }

  // Trigger Tactical Intel intervention
  const deployTacticalIntel = (conceptId) => {
    setInterventionActive(true)
    setInterventionHistory(prev => [...prev, {
      conceptId,
      timestamp: new Date().toISOString(),
      type: 'TACTICAL_INTEL_DEPLOYED',
      message: `High friction detected in ${conceptId}. Deploying Tactical Intel to help you conquer this sector.`
    }])
  }

  // Socratic hint generation with intervention-aware messaging
  const generateSocraticHint = (problem, conceptId, failureCount) => {
    const baseMessages = [
      "Let's look at this Problem together.",
      "What do you notice about the structure?",
      "Which part seems most challenging?",
      "Can you think of a similar Problem you've solved before?",
    ]

    // If intervention is active, use protective messaging
    if (interventionActive) {
      const interventionIndex = Math.floor(Math.random() * baseMessages.length)
      const protectiveMessage = baseMessages[interventionIndex] || 
        "Warrior, hold your position. You aren't failing; you've hit a high-friction zone. We are deploying Tactical Intel to help you conquer this sector."

      return {
        hint: protectiveMessage,
        requiresIntervention: interventionActive
      }
    }
  }

  // Reset intervention when student shows understanding
  const resetIntervention = (conceptId) => {
    setInterventionActive(false)
    setCurrentConcept(null)
    setInterventionHistory(prev => [...prev, {
      conceptId,
      timestamp: new Date().toISOString(),
      type: 'INTERVENTION_SUCCESS',
      message: `Student demonstrated understanding in ${conceptId}. Tactical Intel deactivated.`
    }])
  }

  // Get intervention history
  const getInterventionHistory = () => {
    return interventionHistory
  }

  // Get current friction data
  const getFrictionData = () => {
    const data = {}
    frictionCount.forEach((count, concept) => {
      data[concept] = count
    })
    return data
  }

  return {
    trackFriction,
    deployTacticalIntel,
    generateSocraticHint,
    resetIntervention,
    getInterventionHistory,
    getFrictionData
  }
}

export default SocraticCoPilot
