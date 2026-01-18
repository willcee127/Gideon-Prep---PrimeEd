// Combat Power Calculator with validation
export const calculateCombatPower = (sectors = {}) => {
  // Default baseline score if no data available
  const BASELINE_SCORE = 100

  // Validate and extract sector scores with defaults
  const mathScore = typeof sectors.math === 'number' && !isNaN(sectors.math) ? sectors.math : BASELINE_SCORE
  const rlaScore = typeof sectors.rla === 'number' && !isNaN(sectors.rla) ? sectors.rla : BASELINE_SCORE
  const scienceScore = typeof sectors.science === 'number' && !isNaN(sectors.science) ? sectors.science : BASELINE_SCORE
  const socialStudiesScore = typeof sectors.socialStudies === 'number' && !isNaN(sectors.socialStudies) ? sectors.socialStudies : BASELINE_SCORE

  // Calculate weighted average (all sectors equally weighted)
  const totalScore = mathScore + rlaScore + scienceScore + socialStudiesScore
  const averageScore = totalScore / 4

  // Determine warrior rank based on average score
  let warriorRank = 'Recruit'
  if (averageScore >= 90) warriorRank = 'Commander'
  else if (averageScore >= 75) warriorRank = 'Elite Warrior'
  else if (averageScore >= 50) warriorRank = 'Specialist'
  else if (averageScore >= 25) warriorRank = 'Verve'

  return {
    combatPower: {
      math: mathScore,
      rla: rlaScore,
      science: scienceScore,
      socialStudies: socialStudiesScore,
      average: Math.round(averageScore),
      total: totalScore
    },
    warriorRank,
    sovereigntyProgress: Math.min(100, Math.round((averageScore / 100) * 100)), // Convert to percentage of 200 max
    lastActiveSector: Object.keys(sectors).find(key => sectors[key] === Math.max(...Object.values(sectors))) || null
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
