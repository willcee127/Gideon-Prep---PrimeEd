// AI Problem Forge Service
// Uses API calls to generate problems with fallback to hardcoded problems

const API_ENDPOINTS = {
  gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  openai: 'https://api.openai.com/v1/chat/completions'
}

// Zone-specific templates for problem generation
const ZONE_TEMPLATES = {
  'Alpha': {
    focus: 'Fraction-to-Decimal',
    tacticalTip: 'Tactical Tip: Use [n/d] key for fractions. Press [f◊►d] to toggle between fraction and decimal.',
    context: 'To secure this outpost, convert between fractions and decimals with precision.',
    examples: [
      'Convert 3/4 to decimal',
      'Convert 0.625 to fraction',
      'Add: 2/3 + 1/4',
      'Divide: (3/4) ÷ (1/2)',
      'Convert 2.125 to mixed number'
    ]
  },
  'Bravo': {
    focus: 'Variable Substitution',
    tacticalTip: 'Tactical Tip: Use [STO] to store values. Use [ALPHA] + [X,T,θ,n] for variables.',
    context: 'To breach this stronghold, master calculator memory and variable operations.',
    examples: [
      'If x = 5, evaluate 3x + 7',
      'If y = -3, evaluate 2y² + 4y',
      'Store 42 in memory, then calculate 5x + MEM',
      'If a = 7 and b = 3, evaluate ab² - 2ab',
      'Store π in memory, then calculate 2πr'
    ]
  },
  'Charlie': {
    focus: 'Formula Application',
    tacticalTip: 'Tactical Tip: Use [x²] for squares, [√] for roots. Store intermediate results.',
    context: 'To fortify this position, apply formulas for volume and surface area.',
    examples: [
      'Find volume of cylinder with radius 4, height 10',
      'Find surface area of sphere with radius 6',
      'Find volume of cone with radius 5, height 12',
      'Find surface area of cylinder with radius 7, height 15',
      'Find volume of sphere with radius 8'
    ]
  },
  'Delta': {
    focus: 'Mean and Median',
    tacticalTip: 'Tactical Tip: Use calculator memory for running totals. [2nd] [STAT] for statistics.',
    context: 'To analyze this battlefield, calculate central tendency from data sets.',
    examples: [
      'Find mean: 12, 15, 18, 21, 24',
      'Find median: 8, 12, 16, 20, 25',
      'Find mean: 45, 52, 48, 61, 59, 55',
      'Find weighted mean: grades 80(20%), 85(30%), 90(50%)',
      'Find standard deviation: 10, 12, 14, 16, 18'
    ]
  }
}

// Hardcoded fallback problems for offline/API failure scenarios
const FALLBACK_PROBLEMS = {
  'Alpha': [
    {
      problem: "Convert 3/4 to decimal",
      options: ["0.75", "0.34", "0.25", "0.8"],
      correct: "0.75",
      tacticalTip: "Tactical Tip: Use [n/d] key for fractions. Press [f◊►d] to toggle between fraction and decimal.",
      explanation: "Step 1: Divide numerator by denominator. Step 2: 3 ÷ 4 = 0.75",
      difficulty: 2
    },
    {
      problem: "Convert 0.625 to fraction",
      options: ["5/8", "3/4", "2/3", "7/8"],
      correct: "5/8",
      tacticalTip: "Tactical Tip: Use [n/d] key for fractions. Press [f◊►d] to toggle between fraction and decimal.",
      explanation: "Step 1: Write as fraction over 1000. Step 2: Simplify: 625/1000 = 5/8",
      difficulty: 3
    }
  ],
  'Bravo': [
    {
      problem: "If x = 5, evaluate 3x + 7",
      options: ["22", "15", "12", "8"],
      correct: "22",
      tacticalTip: "Tactical Tip: Use [STO] to store values. Use [ALPHA] + [X,T,θ,n] for variables.",
      explanation: "Step 1: Substitute x = 5. Step 2: 3(5) + 7 = 15 + 7 = 22",
      difficulty: 2
    },
    {
      problem: "If y = -3, evaluate 2y² + 4y",
      options: ["6", "-6", "18", "-18"],
      correct: "6",
      tacticalTip: "Tactical Tip: Use [STO] to store values. Use [ALPHA] + [X,T,θ,n] for variables.",
      explanation: "Step 1: Substitute y = -3. Step 2: 2(-3)² + 4(-3) = 2(9) - 12 = 18 - 12 = 6",
      difficulty: 3
    }
  ],
  'Charlie': [
    {
      problem: "Find volume of cylinder with radius 4, height 10",
      options: ["502.65", "402.12", "603.19", "351.86"],
      correct: "502.65",
      tacticalTip: "Tactical Tip: Use [x²] for squares, [√] for roots. Store intermediate results.",
      explanation: "Step 1: V = π(4)²(10). Step 2: V = π(16)(10) = 160π ≈ 502.65",
      difficulty: 3
    },
    {
      problem: "Find surface area of sphere with radius 6",
      options: ["452.39", "301.59", "603.19", "150.80"],
      correct: "452.39",
      tacticalTip: "Tactical Tip: Use [x²] for squares, [√] for roots. Store intermediate results.",
      explanation: "Step 1: SA = 4π(6)². Step 2: SA = 4π(36) = 144π ≈ 452.39",
      difficulty: 3
    }
  ],
  'Delta': [
    {
      problem: "Find mean: 12, 15, 18, 21, 24",
      options: ["18", "15", "21", "16"],
      correct: "18",
      tacticalTip: "Tactical Tip: Use calculator memory for running totals. [2nd] [STAT] for statistics.",
      explanation: "Step 1: Sum all values: 12 + 15 + 18 + 21 + 24 = 90. Step 2: Divide by count: 90 ÷ 5 = 18",
      difficulty: 2
    },
    {
      problem: "Find median: 8, 12, 16, 20, 25",
      options: ["16", "12", "20", "14"],
      correct: "16",
      tacticalTip: "Tactical Tip: Use calculator memory for running totals. [2nd] [STAT] for statistics.",
      explanation: "Step 1: Order data: 8, 12, 16, 20, 25. Step 2: Middle value is 16",
      difficulty: 2
    }
  ]
}

class ProblemForge {
  constructor(apiKey = null, provider = 'gemini') {
    this.apiKey = apiKey
    this.provider = provider
    this.isOnline = navigator.onLine
  }

  // Check online status
  checkOnlineStatus() {
    this.isOnline = navigator.onLine
    return this.isOnline
  }

  // Generate problem using AI API
  async generateProblemWithAI(zone, difficulty) {
    if (!this.checkOnlineStatus() || !this.apiKey) {
      throw new Error('Offline or no API key available')
    }

    const template = ZONE_TEMPLATES[zone] || ZONE_TEMPLATES['Alpha']
    
    const prompt = `Create a Level ${difficulty} GED math problem for Zone ${zone} with focus on ${template.focus}.
    
    Context: ${template.context}
    Tactical Tip: ${template.tacticalTip}
    
    Examples of similar problems:
    ${template.examples.map(ex => `- ${ex}`).join('\n')}
    
    Return a JSON response with this exact format:
    {
      "problem": "Clear problem statement with context",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": "Correct answer from options",
      "tacticalTip": "Specific TI-30XS calculator instructions",
      "explanation": "Step-by-step solution explanation",
      "difficulty": ${difficulty}
    }
    
    Requirements:
    - Problem must be appropriate for GED level
    - Include contextual hook related to military/overcomer theme
    - Provide 4 multiple choice options with one correct answer
    - Include specific calculator key instructions
    - Clear step-by-step explanation
    - Difficulty should match the requested level (1-5)`

    try {
      let response
      
      if (this.provider === 'gemini') {
        response = await this.callGemini(prompt)
      } else if (this.provider === 'openai') {
        response = await this.callOpenAI(prompt)
      }

      // Parse the response
      const problemData = this.parseAIResponse(response)
      
      // Validate the response format
      if (!this.validateProblemFormat(problemData)) {
        throw new Error('Invalid AI response format')
      }

      return problemData
    } catch (error) {
      console.error('AI generation failed:', error)
      throw error
    }
  }

  // Call Gemini API
  async callGemini(prompt) {
    const response = await fetch(API_ENDPOINTS.gemini + `?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
  }

  // Call OpenAI API
  async callOpenAI(prompt) {
    const response = await fetch(API_ENDPOINTS.openai, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  }

  // Parse AI response to extract JSON
  parseAIResponse(response) {
    try {
      // Look for JSON in the response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      
      // If no JSON found, try to parse the entire response
      return JSON.parse(response)
    } catch (error) {
      console.error('Failed to parse AI response:', error)
      throw new Error('Invalid JSON response from AI')
    }
  }

  // Validate problem format
  validateProblemFormat(problem) {
    const requiredFields = ['problem', 'options', 'correct', 'tacticalTip', 'explanation', 'difficulty']
    
    for (const field of requiredFields) {
      if (!problem[field]) {
        console.error(`Missing required field: ${field}`)
        return false
      }
    }

    // Validate options array
    if (!Array.isArray(problem.options) || problem.options.length !== 4) {
      console.error('Options must be an array of 4 elements')
      return false
    }

    // Validate correct answer is in options
    if (!problem.options.includes(problem.correct)) {
      console.error('Correct answer must be in options array')
      return false
    }

    // Validate difficulty
    if (problem.difficulty < 1 || problem.difficulty > 5) {
      console.error('Difficulty must be between 1 and 5')
      return false
    }

    return true
  }

  // Get fallback problem
  getFallbackProblem(zone, difficulty) {
    const problems = FALLBACK_PROBLEMS[zone] || FALLBACK_PROBLEMS['Alpha']
    
    // Filter problems by difficulty (or closest available)
    const suitableProblems = problems.filter(p => p.difficulty <= difficulty)
    
    if (suitableProblems.length === 0) {
      return problems[0] // Return easiest problem if none suitable
    }

    // Return a random suitable problem
    const randomIndex = Math.floor(Math.random() * suitableProblems.length)
    return suitableProblems[randomIndex]
  }

  // Main forge function with safety net
  async forgeProblem(zone, difficulty) {
    try {
      // Try AI generation first
      if (this.checkOnlineStatus() && this.apiKey) {
        console.log(`Attempting AI generation for Zone ${zone}, Level ${difficulty}`)
        const aiProblem = await this.generateProblemWithAI(zone, difficulty)
        
        // Add metadata
        aiProblem.isForge = true
        aiProblem.requiresGhostCalc = difficulty >= 4
        aiProblem.source = 'ai'
        
        return aiProblem
      }
    } catch (error) {
      console.warn('AI generation failed, using mock forge:', error.message)
    }

    // Fallback to mock forge
    console.log(`Using mock forge for Zone ${zone}, Level ${difficulty}`)
    const mockProblem = generateMockProblem(zone, difficulty)
    
    return mockProblem
  }
}

// Export singleton instance
export const problemForge = new ProblemForge()

// Export class for testing/custom instances
export default ProblemForge

// Mock Forge Service - Generate infinite tactical reps
export const generateMockProblem = (zone, difficulty) => {
  const templates = {
    'Alpha': {
      focus: 'Fraction-to-Decimal',
      tacticalTip: 'Tactical Tip: Use [n/d] key for fractions. Press [f◊►d] to toggle between fraction and decimal.',
      context: 'To secure this outpost, convert between fractions and decimals with precision.',
      generator: () => {
        const num = Math.floor(Math.random() * 20) + 1
        const den = Math.floor(Math.random() * 20) + 1
        const operation = Math.random() > 0.5 ? 'to decimal' : 'to fraction'
        
        if (operation === 'to decimal') {
          const decimal = (num / den).toFixed(3)
          return {
            problem: `Convert ${num}/${den} to decimal`,
            options: [decimal, (num/den).toFixed(2), (num/den).toFixed(1), (num+den)/den],
            correct: decimal,
            tacticalTip: 'Tactical Tip: Use [n/d] key for fractions. Press [f◊►d] to toggle between fraction and decimal.',
            explanation: `Step 1: Divide numerator by denominator. Step 2: ${num} ÷ ${den} = ${decimal}`,
            difficulty: difficulty
          }
        } else {
          const decimal = Math.random() * 0.9 + 0.1
          const wholeNum = Math.floor(decimal)
          const frac = decimal - wholeNum
          const approxDen = [2, 4, 5, 8, 10, 16, 20][Math.floor(Math.random() * 7)]
          const approxNum = Math.round(frac * approxDen)
          return {
            problem: `Convert ${decimal.toFixed(3)} to fraction`,
            options: [`${wholeNum} ${approxNum}/${approxDen}`, `${approxNum}/${approxDen}`, `${wholeNum + 1}/${approxDen}`, `${wholeNum}/${approxDen}`],
            correct: `${wholeNum} ${approxNum}/${approxDen}`,
            tacticalTip: 'Tactical Tip: Use [n/d] key for fractions. Press [f◊►d] to toggle between fraction and decimal.',
            explanation: `Step 1: Separate whole number and decimal. Step 2: Convert decimal part to fraction: ${frac} ≈ ${approxNum}/${approxDen}`,
            difficulty: difficulty
          }
        }
      }
    },
    'Bravo': {
      focus: 'Variable Substitution',
      tacticalTip: 'Tactical Tip: Use [STO] to store values. Use [ALPHA] + [X,T,θ,n] for variables.',
      context: 'To breach this stronghold, master calculator memory and variable operations.',
      generator: () => {
        const x = Math.floor(Math.random() * 10) + 1
        const y = Math.floor(Math.random() * 10) + 1
        const operations = ['+', '-', '×', '÷']
        const op = operations[Math.floor(Math.random() * operations.length)]
        
        let expression, answer
        switch(op) {
          case '+':
            expression = `${x} + ${y}`
            answer = x + y
            break
          case '-':
            expression = `${x} - ${y}`
            answer = x - y
            break
          case '×':
            expression = `${x} × ${y}`
            answer = x * y
            break
          case '÷':
            expression = `${x} ÷ ${y}`
            answer = (x / y).toFixed(2)
            break
        }
        
        return {
          problem: `If x = ${x} and y = ${y}, evaluate ${expression}`,
          options: [answer.toString(), (answer + 1).toString(), (answer - 1).toString(), (answer * 2).toString()],
          correct: answer.toString(),
          tacticalTip: 'Tactical Tip: Use [STO] to store values. Use [ALPHA] + [X,T,θ,n] for variables.',
          explanation: `Step 1: Substitute x = ${x} and y = ${y}. Step 2: Calculate ${expression} = ${answer}`,
          difficulty: difficulty
        }
      }
    },
    'Charlie': {
      focus: 'Formula Application',
      tacticalTip: 'Tactical Tip: Use [x²] for squares, [√] for roots. Store intermediate results.',
      context: 'To fortify this position, apply formulas for volume and surface area.',
      generator: () => {
        const shapes = ['cylinder', 'sphere', 'cone', 'rectangle']
        const shape = shapes[Math.floor(Math.random() * shapes.length)]
        
        switch(shape) {
          case 'cylinder':
            const r = Math.floor(Math.random() * 10) + 1
            const h = Math.floor(Math.random() * 10) + 1
            const volume = (Math.PI * r * r * h).toFixed(2)
            return {
              problem: `Find volume of cylinder with radius ${r}, height ${h}`,
              options: [volume, (Math.PI * r * h).toFixed(2), (2 * Math.PI * r * h).toFixed(2), (Math.PI * r * r).toFixed(2)],
              correct: volume,
              tacticalTip: 'Tactical Tip: Use [x²] for squares, [√] for roots. Store intermediate results.',
              explanation: `Step 1: V = πr²h. Step 2: V = π(${r})²(${h}) = ${volume}`,
              difficulty: difficulty
            }
          case 'sphere':
            const sr = Math.floor(Math.random() * 10) + 1
            const sa = (4 * Math.PI * sr * sr).toFixed(2)
            return {
              problem: `Find surface area of sphere with radius ${sr}`,
              options: [sa, (2 * Math.PI * sr * sr).toFixed(2), (Math.PI * sr * sr).toFixed(2), (3 * Math.PI * sr * sr).toFixed(2)],
              correct: sa,
              tacticalTip: 'Tactical Tip: Use [x²] for squares, [√] for roots. Store intermediate results.',
              explanation: `Step 1: SA = 4πr². Step 2: SA = 4π(${sr})² = ${sa}`,
              difficulty: difficulty
            }
          case 'cone':
            const cr = Math.floor(Math.random() * 10) + 1
            const ch = Math.floor(Math.random() * 10) + 1
            const cvolume = ((1/3) * Math.PI * cr * cr * ch).toFixed(2)
            return {
              problem: `Find volume of cone with radius ${cr}, height ${ch}`,
              options: [cvolume, (Math.PI * cr * cr * ch).toFixed(2), ((1/2) * Math.PI * cr * cr * ch).toFixed(2), ((1/4) * Math.PI * cr * cr * ch).toFixed(2)],
              correct: cvolume,
              tacticalTip: 'Tactical Tip: Use [x²] for squares, [√] for roots. Store intermediate results.',
              explanation: `Step 1: V = (1/3)πr²h. Step 2: V = (1/3)π(${cr})²(${ch}) = ${cvolume}`,
              difficulty: difficulty
            }
          default:
            const length = Math.floor(Math.random() * 10) + 1
            const width = Math.floor(Math.random() * 10) + 1
            const height = Math.floor(Math.random() * 10) + 1
            const vol = length * width * height
            return {
              problem: `Find volume of rectangular prism: ${length}×${width}×${height}`,
              options: [vol.toString(), (length + width + height).toString(), (length * width).toString(), (length * height).toString()],
              correct: vol.toString(),
              tacticalTip: 'Tactical Tip: Use [x²] for squares, [√] for roots. Store intermediate results.',
              explanation: `Step 1: V = l × w × h. Step 2: V = ${length} × ${width} × ${height} = ${vol}`,
              difficulty: difficulty
            }
        }
      }
    },
    'Delta': {
      focus: 'Mean and Median',
      tacticalTip: 'Tactical Tip: Use calculator memory for running totals. [2nd] [STAT] for statistics.',
      context: 'To analyze this battlefield, calculate central tendency from data sets.',
      generator: () => {
        const dataSize = Math.floor(Math.random() * 5) + 5 // 5-9 data points
        const data = []
        for (let i = 0; i < dataSize; i++) {
          data.push(Math.floor(Math.random() * 50) + 10)
        }
        
        const mean = (data.reduce((a, b) => a + b, 0) / data.length).toFixed(2)
        const sorted = [...data].sort((a, b) => a - b)
        const median = data.length % 2 === 0 
          ? ((sorted[data.length/2 - 1] + sorted[data.length/2]) / 2).toFixed(2)
          : sorted[Math.floor(data.length/2)]
        
        const calculation = Math.random() > 0.5 ? 'mean' : 'median'
        const answer = calculation === 'mean' ? mean : median.toString()
        
        return {
          problem: `Find ${calculation}: ${data.join(', ')}`,
          options: [answer, (parseFloat(answer) + 1).toString(), (parseFloat(answer) - 1).toString(), data[0].toString()],
          correct: answer,
          tacticalTip: 'Tactical Tip: Use calculator memory for running totals. [2nd] [STAT] for statistics.',
          explanation: calculation === 'mean' 
            ? `Step 1: Sum all values: ${data.reduce((a, b) => a + b, 0)}. Step 2: Divide by count: ${data.length} = ${mean}`
            : `Step 1: Order data: ${sorted.join(', ')}. Step 2: Middle value is ${median}`,
          difficulty: difficulty
        }
      }
    }
  }
  
  const template = templates[zone] || templates['Alpha']
  const problem = template.generator()
  
  // Add metadata
  problem.isForge = true
  problem.requiresGhostCalc = difficulty >= 4
  problem.source = 'mock'
  problem.zone = zone
  
  return problem
}
