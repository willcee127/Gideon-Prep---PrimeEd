// Combat Power Calculator with validation, decay, and Forge Pressure weighting
export const calculateCombatPower = (sectors = {}, lastReviewDates = {}, timePerQuestion = {}) => {
  // Default baseline score if no data available
  const BASELINE_SCORE = 100

  // Validate and extract sector scores with defaults
  const mathScore = typeof sectors.math === 'number' && !isNaN(sectors.math) ? sectors.math : BASELINE_SCORE
  const rlaScore = typeof sectors.rla === 'number' && !isNaN(sectors.rla) ? sectors.rla : BASELINE_SCORE
  const scienceScore = typeof sectors.science === 'number' && !isNaN(sectors.science) ? sectors.science : BASELINE_SCORE
  const socialStudiesScore = typeof sectors.socialStudies === 'number' && !isNaN(sectors.socialStudies) ? sectors.socialStudies : BASELINE_SCORE

  // Calculate weighted average with Forge Pressure time factor
  const mathTime = timePerQuestion.math || 60 // Default 60 seconds per question
  const rlaTime = timePerQuestion.rla || 60
  const scienceTime = timePerQuestion.science || 60
  const socialStudiesTime = timePerQuestion.socialStudies || 60

  // Apply Forge Pressure weighting (faster = higher power)
  const mathWeightedScore = mathScore * (60 / mathTime) // Inverse: faster = higher score
  const rlaWeightedScore = rlaScore * (60 / rlaTime)
  const scienceWeightedScore = scienceScore * (60 / scienceTime)
  const socialStudiesWeightedScore = socialStudiesScore * (60 / socialStudiesTime)

  const weightedTotal = mathWeightedScore + rlaWeightedScore + scienceWeightedScore + socialStudiesWeightedScore
  const weightedAverage = weightedTotal / 4

  // Calculate mastery status with decay logic
  const getMasteryStatus = (sector, lastReviewDate) => {
    if (!lastReviewDate) {
      return { status: 'mastered', isDecayed: false }
    }

    const daysSinceReview = (Date.now() - new Date(lastReviewDate).getTime()) / (1000 * 60 * 60 * 24) // Convert to days
    
    // If more than 14 days since last review, mark as decayed
    if (daysSinceReview > 14) {
      return { status: 'requires_reverification', isDecayed: true }
    }
    
    return { status: 'mastered', isDecayed: false }
  }

  // Apply mastery status to each sector
  const mathStatus = getMasteryStatus('math', lastReviewDates.math)
  const rlaStatus = getMasteryStatus('rla', lastReviewDates.rla)
  const scienceStatus = getMasteryStatus('science', lastReviewDates.science)
  const socialStudiesStatus = getMasteryStatus('socialStudies', lastReviewDates.socialStudies)

  // Determine warrior rank based on weighted average
  let warriorRank = 'Recruit'
  if (weightedAverage >= 90) warriorRank = 'Commander'
  else if (weightedAverage >= 75) warriorRank = 'Elite Warrior'
  else if (weightedAverage >= 50) warriorRank = 'Specialist'
  else if (weightedAverage >= 25) warriorRank = 'Verve'

  return {
    combatPower: {
      math: { score: mathScore, weightedScore: mathWeightedScore, status: mathStatus },
      rla: { score: rlaScore, weightedScore: rlaWeightedScore, status: rlaStatus },
      science: { score: scienceScore, weightedScore: scienceWeightedScore, status: scienceStatus },
      socialStudies: { score: socialStudiesScore, weightedScore: socialStudiesWeightedScore, status: socialStudiesStatus },
      average: Math.round(weightedAverage),
      total: weightedTotal,
      // Add decay information
      decayedSectors: {
        math: mathStatus.isDecayed,
        rla: rlaStatus.isDecayed,
        science: scienceStatus.isDecayed,
        socialStudies: socialStudiesStatus.isDecayed
      }
    },
    warriorRank,
    sovereigntyProgress: Math.min(100, Math.round((weightedAverage / 100) * 100)),
    lastActiveSector: Object.keys(sectors).find(key => sectors[key] === Math.max(...Object.values(sectors))) || null,
    // Add timePerQuestion data for tracking
    timePerQuestion: {
      math: mathTime,
      rla: rlaTime,
      science: scienceTime,
      socialStudies: socialStudiesTime
    }
  }
}

export const validateSectorData = (sectors) => {
  const validatedSectors = {}
  
  Object.keys(sectors).forEach(sector => {
    const score = sectors[sector]
    
    // Validate score is a number and within bounds
    if (typeof score === 'number' && !isNaN(score) && score >= 0 && score <= 100) {
      validatedSectors[sector] = score
    } else {
      console.warn(`Invalid score for ${sector}:`, score)
      validatedSectors[sector] = BASELINE_SCORE // Use baseline for invalid data
    }
  })

  return validatedSectors
}
