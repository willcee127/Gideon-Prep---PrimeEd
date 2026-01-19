// GED Score Calculator with weighted combat power engine
export const getProjectedGEDScore = (radarData) => {
  // GED Standard Weights
  const weights = {
    algebra: 0.55, // High Impact
    numberSense: 0.30, // Medium Impact
    dataAnalysis: 0.30, // Medium Impact
    geometry: 0.15, // Foundational
    fractions: 0.15  // Foundational
  }

  // Calculate weighted score
  const weightedScore = Object.entries(radarData).reduce((total, [axis, score]) => {
    const axisWeight = weights[axis] || 0.15 // Default to 15% for unknown axes
    return total + (score * axisWeight)
  }, 0)

  // Convert to 100-200 GED Scale
  const projectedScore = Math.min(200, Math.round((weightedScore / 100) * 200))
  
  return {
    projectedScore,
    weightedScore,
    breakdown: Object.entries(radarData).map(([axis, score]) => ({
      axis,
      score,
      weight: weights[axis] || 0.15,
      weightedContribution: score * (weights[axis] || 0.15),
      percentage: (score / 100) * 100
    }))
  }
}

export const analyzeFrictionPoints = (radarData, timePerQuestion = {}) => {
  // Identify sectors with lowest speed/accuracy
  const sectorAnalysis = Object.entries(radarData).map(([axis, score]) => {
    const time = timePerQuestion[axis] || 60
    const speed = 100 / time // Questions per minute (higher is better)
    const efficiency = score * speed // Combined metric of accuracy and speed
    
    return {
      axis,
      score,
      time,
      speed,
      efficiency
    }
  }).sort((a, b) => b.efficiency - a.efficiency) // Sort by efficiency (lowest first)

  return {
    lowestSectors: sectorAnalysis.slice(0, 3), // Top 3 areas of greatest resistance
    sectorAnalysis,
    recommendations: sectorAnalysis.map(sector => {
      if (sector.efficiency < 30) {
        return {
          axis: sector.axis,
          priority: 'critical',
          action: `CRITICAL: ${sector.axis.toUpperCase()} speed is ${sector.speed.toFixed(1)} q/min. Return to Verve-Sector 3 for re-verification.`
        }
      } else if (sector.efficiency < 50) {
        return {
          axis: sector.axis,
          priority: 'high',
          action: `ALERT: ${sector.axis.toUpperCase()} showing significant friction. Deploy targeted practice drills.`
        }
      } else {
        return {
          axis: sector.axis,
          priority: 'medium',
          action: `MAINTAIN: Continue current ${sector.axis.toUpperCase()} strategy with focused practice.`
        }
      }
    })
  }
}
