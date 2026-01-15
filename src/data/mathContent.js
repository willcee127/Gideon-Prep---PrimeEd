// Math Content Library - Source of Truth for all learning nodes
export const mathContent = {
  'ged-001': {
    title: 'Algebra Basics',
    description: 'Master the fundamentals of algebraic thinking',
    mode: 'VERVE',
    difficulty: 'Beginner',
    estimatedTime: '15-20 min',
    sector: 'Foundations',
    prerequisites: [],
    coordinates: { x: 200, y: 300 },
    icon: '🧮',
    xpRequired: 100,
    tacticalTip: 'Tactical Tip: The [x] key is your best friend. Use it to build the equation.',
    problems: [
      {
        id: 'ab1',
        question: 'Solve for x: 3x + 7 = 22',
        answer: '5',
        equation: '3x + 7 = 22',
        variable: 'x',
        solution: [
          'Step 1: Subtract 7 from both sides: 3x = 22 - 7',
          'Step 2: Simplify: 3x = 15',
          'Step 3: Divide both sides by 3: x = 15 ÷ 3',
          'Step 4: Final answer: x = 5'
        ]
      },
      {
        id: 'ab2',
        question: 'If y = 2x - 4 and x = 6, what is y?',
        answer: '8',
        equation: 'y = 2x - 4',
        variable: 'y',
        solution: [
          'Step 1: Substitute x = 6 into the equation',
          'Step 2: y = 2(6) - 4',
          'Step 3: y = 12 - 4',
          'Step 4: y = 8'
        ]
      },
      {
        id: 'ab3',
        question: 'Solve: 2(x - 3) = 14',
        answer: '10',
        equation: '2(x - 3) = 14',
        variable: 'x',
        solution: [
          'Step 1: Divide both sides by 2: x - 3 = 7',
          'Step 2: Add 3 to both sides: x = 7 + 3',
          'Step 3: Simplify: x = 10'
        ]
      },
      {
        id: 'ab4',
        question: 'What is x if 5x + 3 = 28?',
        answer: '5',
        equation: '5x + 3 = 28',
        variable: 'x',
        solution: [
          'Step 1: Subtract 3 from both sides: 5x = 25',
          'Step 2: Divide both sides by 5: x = 5'
        ]
      },
      {
        id: 'ab5',
        question: 'Solve: 4x - 9 = 11',
        answer: '5',
        equation: '4x - 9 = 11',
        variable: 'x',
        solution: [
          'Step 1: Add 9 to both sides: 4x = 20',
          'Step 2: Divide both sides by 4: x = 5'
        ]
      }
    ]
  },
  
  'ged-002': {
    title: 'Linear Equations',
    description: 'Work with linear equations and graphing',
    mode: 'AURA',
    difficulty: 'Beginner',
    estimatedTime: '20-25 min',
    sector: 'Foundations',
    prerequisites: ['ged-001'],
    coordinates: { x: 400, y: 300 },
    icon: '📈',
    xpRequired: 150,
    problems: [
      {
        id: 'le1',
        question: 'Find the slope: y = 2x + 3',
        answer: '2',
        equation: 'y = 2x + 3',
        concept: 'slope',
        solution: [
          'The equation is in slope-intercept form: y = mx + b',
          'The coefficient of x (m) is the slope',
          'In y = 2x + 3, the slope is 2'
        ]
      },
      {
        id: 'le2',
        question: 'What is the y-intercept of y = -3x + 6?',
        answer: '6',
        equation: 'y = -3x + 6',
        concept: 'y-intercept',
        solution: [
          'The y-intercept is where x = 0',
          'Substitute x = 0: y = -3(0) + 6',
          'y = 0 + 6 = 6'
        ]
      },
      {
        id: 'le3',
        question: 'Find x when y = 0 in 2x + 4y = 8',
        answer: '4',
        equation: '2x + 4y = 8',
        concept: 'x-intercept',
        solution: [
          'Set y = 0: 2x + 4(0) = 8',
          'Simplify: 2x = 8',
          'Divide by 2: x = 4'
        ]
      },
      {
        id: 'le4',
        question: 'What is the slope of the line through (1,2) and (3,8)?',
        answer: '3',
        points: [(1, 2), (3, 8)],
        concept: 'slope from points',
        solution: [
          'Slope formula: m = (y₂ - y₁) / (x₂ - x₁)',
          'm = (8 - 2) / (3 - 1) = 6/2 = 3'
        ]
      },
      {
        id: 'le5',
        question: 'Write the equation of a line with slope -2 and y-intercept 5',
        answer: 'y = -2x + 5',
        concept: 'writing equations',
        solution: [
          'Use slope-intercept form: y = mx + b',
          'Substitute m = -2 and b = 5',
          'y = -2x + 5'
        ]
      }
    ]
  },

  'ged-003': {
    title: 'Systems of Equations',
    description: 'Solve systems using multiple methods',
    mode: 'FORGE',
    difficulty: 'Intermediate',
    estimatedTime: '25-30 min',
    sector: 'Foundations',
    prerequisites: ['ged-001', 'ged-002'],
    coordinates: { x: 600, y: 300 },
    icon: '🔗',
    xpRequired: 200,
    tacticalTip: 'Tactical Tip: Use [ALPHA] key for variables. Press ALPHA Y= to enter Y variable.',
    problems: [
      {
        id: 'se1',
        question: 'Solve: x + y = 10, 2x - y = 5',
        answer: '(5, 5)',
        equations: ['x + y = 10', '2x - y = 5'],
        method: 'elimination',
        solution: [
          'Add the equations: (x + y) + (2x - y) = 10 + 5',
          'Simplify: 3x = 15',
          'Solve for x: x = 5',
          'Substitute back: 5 + y = 10, so y = 5'
        ]
      },
      {
        id: 'se2',
        question: 'Solve: 3x + 2y = 12, x - y = 1',
        answer: '(2, 1)',
        equations: ['3x + 2y = 12', 'x - y = 1'],
        method: 'substitution',
        solution: [
          'From second equation: x = y + 1',
          'Substitute into first: 3(y + 1) + 2y = 12',
          'Expand: 3y + 3 + 2y = 12',
          'Combine: 5y + 3 = 12',
          'Solve: 5y = 9, y = 9/5 = 1.8',
          'Find x: x = 1.8 + 1 = 2.8'
        ]
      },
      {
        id: 'se3',
        question: 'Find x and y: 2x + 3y = 7, 4x - y = 3',
        answer: '(2, 1)',
        equations: ['2x + 3y = 7', '4x - y = 3'],
        method: 'elimination',
        solution: [
          'Multiply second equation by 3: 12x - 3y = 9',
          'Add to first equation: (2x + 3y) + (12x - 3y) = 7 + 9',
          'Simplify: 14x = 16, x = 8/7',
          'Substitute to find y'
        ]
      },
      {
        id: 'se4',
        question: 'Solve the system: x + y = 6, x - y = 2',
        answer: '(4, 2)',
        equations: ['x + y = 6', 'x - y = 2'],
        method: 'elimination',
        solution: [
          'Add equations: 2x = 8',
          'Solve: x = 4',
          'Substitute: 4 + y = 6, so y = 2'
        ]
      },
      {
        id: 'se5',
        question: 'Find the solution: 5x + y = 11, 2x + 3y = 12',
        answer: '(1, 6)',
        equations: ['5x + y = 11', '2x + 3y = 12'],
        method: 'substitution',
        solution: [
          'From first equation: y = 11 - 5x',
          'Substitute into second: 2x + 3(11 - 5x) = 12',
          'Expand: 2x + 33 - 15x = 12',
          'Simplify: -13x + 33 = 12',
          'Solve: -13x = -21, x = 21/13'
        ]
      }
    ]
  },

  'ged-004': {
    title: 'Quadratic Equations',
    description: 'Master quadratic equations and factoring',
    mode: 'VERVE',
    difficulty: 'Intermediate',
    estimatedTime: '30-35 min',
    sector: 'Advanced',
    prerequisites: ['ged-001', 'ged-002'],
    coordinates: { x: 400, y: 150 },
    icon: '📊',
    xpRequired: 250,
    problems: [
      {
        id: 'qe1',
        question: 'Solve: x² - 9 = 0',
        answer: 'x = 3, -3',
        equation: 'x² - 9 = 0',
        method: 'factoring',
        solution: [
          'Factor: (x - 3)(x + 3) = 0',
          'Set each factor to 0: x - 3 = 0 or x + 3 = 0',
          'Solve: x = 3 or x = -3'
        ]
      },
      {
        id: 'qe2',
        question: 'Solve: x² + 5x + 6 = 0',
        answer: 'x = -2, -3',
        equation: 'x² + 5x + 6 = 0',
        method: 'factoring',
        solution: [
          'Factor: (x + 2)(x + 3) = 0',
          'Set each factor to 0: x + 2 = 0 or x + 3 = 0',
          'Solve: x = -2 or x = -3'
        ]
      },
      {
        id: 'qe3',
        question: 'Find x: 2x² - 8x = 0',
        answer: 'x = 0, 4',
        equation: '2x² - 8x = 0',
        method: 'factoring',
        solution: [
          'Factor out common term: 2x(x - 4) = 0',
          'Set each factor to 0: 2x = 0 or x - 4 = 0',
          'Solve: x = 0 or x = 4'
        ]
      },
      {
        id: 'qe4',
        question: 'Solve using quadratic formula: x² - 4x + 3 = 0',
        answer: 'x = 1, 3',
        equation: 'x² - 4x + 3 = 0',
        method: 'quadratic formula',
        solution: [
          'Use formula: x = [-b ± √(b² - 4ac)] / 2a',
          'a = 1, b = -4, c = 3',
          'x = [4 ± √(16 - 12)] / 2',
          'x = [4 ± 2] / 2 = 3 or 1'
        ]
      },
      {
        id: 'qe5',
        question: 'Complete the square: x² + 6x + 9 = 0',
        answer: 'x = -3',
        equation: 'x² + 6x + 9 = 0',
        method: 'perfect square',
        solution: [
          'Recognize as (x + 3)² = 0',
          'Take square root: x + 3 = 0',
          'Solve: x = -3'
        ]
      }
    ]
  },

  'ged-005': {
    title: 'Functions & Graphs',
    description: 'Explore functions and their graphical representations',
    mode: 'AURA',
    difficulty: 'Intermediate',
    estimatedTime: '25-30 min',
    sector: 'Advanced',
    prerequisites: ['ged-002'],
    coordinates: { x: 600, y: 150 },
    icon: '📉',
    xpRequired: 225,
    problems: [
      {
        id: 'fg1',
        question: 'If f(x) = 3x - 2, find f(4)',
        answer: '10',
        function: 'f(x) = 3x - 2',
        input: 4,
        solution: [
          'Substitute x = 4 into the function',
          'f(4) = 3(4) - 2',
          'f(4) = 12 - 2 = 10'
        ]
      },
      {
        id: 'fg2',
        question: 'Find x if g(x) = x² + 1 and g(x) = 10',
        answer: '3, -3',
        function: 'g(x) = x² + 1',
        output: 10,
        solution: [
          'Set up equation: x² + 1 = 10',
          'Subtract 1: x² = 9',
          'Take square root: x = ±3'
        ]
      },
      {
        id: 'fg3',
        question: 'What is the domain of f(x) = √(x - 4)?',
        answer: 'x ≥ 4',
        function: 'f(x) = √(x - 4)',
        concept: 'domain',
        solution: [
          'Square root requires non-negative input',
          'x - 4 ≥ 0',
          'x ≥ 4'
        ]
      },
      {
        id: 'fg4',
        question: 'If h(x) = 2x + 1, find h⁻¹(7)',
        answer: '3',
        function: 'h(x) = 2x + 1',
        inverse: true,
        solution: [
          'Set y = 2x + 1 and y = 7',
          'Solve for x: 7 = 2x + 1',
          'Subtract 1: 6 = 2x',
          'Divide by 2: x = 3'
        ]
      },
      {
        id: 'fg5',
        question: 'Find the range of f(x) = -x² + 9',
        answer: 'y ≤ 9',
        function: 'f(x) = -x² + 9',
        concept: 'range',
        solution: [
          'Maximum occurs at vertex x = 0',
          'f(0) = -0² + 9 = 9',
          'Since coefficient is negative, parabola opens downward',
          'Range: y ≤ 9'
        ]
      }
    ]
  },

  'ged-006': {
    title: 'Fraction Fundamentals',
    description: 'Master the basics of fractions and operations',
    mode: 'VERVE',
    difficulty: 'Beginner',
    estimatedTime: '20-25 min',
    sector: 'Foundation',
    prerequisites: [],
    coordinates: { x: 150, y: 400 },
    icon: '🍕',
    xpRequired: 100,
    tacticalTip: 'Tactical Tip: Use the [n/d] key on your TI-30XS to enter this directly.',
    problems: [
      {
        id: 'frac1',
        question: 'Simplify: 4/8',
        answer: '1/2',
        solution: [
          'Find the greatest common divisor of 4 and 8',
          'GCD is 4',
          'Divide numerator and denominator by 4',
          '4 ÷ 4 = 1, 8 ÷ 4 = 2',
          'Result: 1/2'
        ]
      },
      {
        id: 'frac2',
        question: 'Add: 1/3 + 1/6',
        answer: '1/2',
        solution: [
          'Find common denominator: 6',
          'Convert 1/3 to 2/6',
          'Add: 2/6 + 1/6 = 3/6',
          'Simplify: 3/6 = 1/2'
        ]
      },
      {
        id: 'frac3',
        question: 'Multiply: 2/3 × 3/4',
        answer: '1/2',
        solution: [
          'Multiply numerators: 2 × 3 = 6',
          'Multiply denominators: 3 × 4 = 12',
          'Result: 6/12',
          'Simplify: 6/12 = 1/2'
        ]
      },
      {
        id: 'frac4',
        question: 'Convert to mixed number: 7/3',
        answer: '2 1/3',
        solution: [
          'Divide 7 by 3',
          '3 goes into 7 two times (2 × 3 = 6)',
          'Remainder: 7 - 6 = 1',
          'Mixed number: 2 1/3'
        ]
      },
      {
        id: 'frac5',
        question: 'Subtract: 3/4 - 1/4',
        answer: '1/2',
        solution: [
          'Same denominator, subtract numerators',
          '3 - 1 = 2',
          'Result: 2/4',
          'Simplify: 2/4 = 1/2'
        ]
      }
    ]
  },

  'ged-007': {
    title: 'Decimal Operations',
    description: 'Learn to work with decimal numbers',
    mode: 'VERVE',
    difficulty: 'Beginner',
    estimatedTime: '20-25 min',
    sector: 'Foundation',
    prerequisites: [],
    coordinates: { x: 350, y: 400 },
    icon: '💰',
    xpRequired: 100,
    problems: [
      {
        id: 'dec1',
        question: 'Add: 2.5 + 1.3',
        answer: '3.8',
        solution: [
          'Line up decimal points',
          '  2.5',
          '+ 1.3',
          '------',
          '  3.8'
        ]
      },
      {
        id: 'dec2',
        question: 'Multiply: 0.5 × 0.4',
        answer: '0.2',
        solution: [
          'Ignore decimals: 5 × 4 = 20',
          'Count decimal places: 1 + 1 = 2',
          'Place decimal: 0.20',
          'Simplify: 0.2'
        ]
      },
      {
        id: 'dec3',
        question: 'Convert to fraction: 0.75',
        answer: '3/4',
        solution: [
          '0.75 = 75/100',
          'Simplify by dividing by 25',
          '75 ÷ 25 = 3, 100 ÷ 25 = 4',
          'Result: 3/4'
        ]
      },
      {
        id: 'dec4',
        question: 'Subtract: 5.0 - 2.3',
        answer: '2.7',
        solution: [
          'Line up decimal points',
          '  5.0',
          '- 2.3',
          '------',
          '  2.7'
        ]
      },
      {
        id: 'dec5',
        question: 'Divide: 1.5 ÷ 0.5',
        answer: '3',
        solution: [
          'Move decimal to make divisor whole: 15 ÷ 5',
          '15 ÷ 5 = 3',
          'Result: 3'
        ]
      }
    ]
  },

  'ged-008': {
    title: 'Equation Basics',
    description: 'Solve simple one-step equations',
    mode: 'VERVE',
    difficulty: 'Beginner',
    estimatedTime: '20-25 min',
    sector: 'Foundation',
    prerequisites: [],
    coordinates: { x: 550, y: 400 },
    icon: '⚖️',
    xpRequired: 100,
    problems: [
      {
        id: 'eq1',
        equation: 'x + 3 = 8',
        answer: '5',
        solution: [
          'Subtract 3 from both sides',
          'x + 3 - 3 = 8 - 3',
          'x = 5'
        ]
      },
      {
        id: 'eq2',
        equation: 'x - 2 = 7',
        answer: '9',
        solution: [
          'Add 2 to both sides',
          'x - 2 + 2 = 7 + 2',
          'x = 9'
        ]
      },
      {
        id: 'eq3',
        equation: '2x = 12',
        answer: '6',
        solution: [
          'Divide both sides by 2',
          '2x ÷ 2 = 12 ÷ 2',
          'x = 6'
        ]
      },
      {
        id: 'eq4',
        equation: 'x ÷ 4 = 3',
        answer: '12',
        solution: [
          'Multiply both sides by 4',
          'x ÷ 4 × 4 = 3 × 4',
          'x = 12'
        ]
      },
      {
        id: 'eq5',
        equation: 'x + 5 = 11',
        answer: '6',
        solution: [
          'Subtract 5 from both sides',
          'x + 5 - 5 = 11 - 5',
          'x = 6'
        ]
      }
    ]
  },

  'ged-009': {
    title: 'Fraction Word Problems',
    description: 'Apply fractions to real-world situations',
    mode: 'AURA',
    difficulty: 'Intermediate',
    estimatedTime: '25-30 min',
    sector: 'Foundation',
    prerequisites: ['ged-006'],
    coordinates: { x: 250, y: 550 },
    icon: '📊',
    xpRequired: 150,
    problems: [
      {
        id: 'fw1',
        question: 'A pizza has 8 slices. You eat 3 slices. What fraction did you eat?',
        answer: '3/8',
        solution: [
          'Total slices = 8',
          'Slices eaten = 3',
          'Fraction = parts/whole = 3/8'
        ]
      },
      {
        id: 'fw2',
        question: 'If 1/4 of a class is 6 students, how many students are in the whole class?',
        answer: '24',
        solution: [
          '1/4 of class = 6 students',
          'Whole class = 6 × 4 = 24 students'
        ]
      },
      {
        id: 'fw3',
        question: 'You have 2/3 of a cake and give away 1/3. How much is left?',
        answer: '1/3',
        solution: [
          'Start with 2/3',
          'Give away 1/3',
          '2/3 - 1/3 = 1/3'
        ]
      },
      {
        id: 'fw4',
        question: 'A recipe calls for 3/4 cup of flour. You only have 1/2 cup. How much more do you need?',
        answer: '1/4',
        solution: [
          'Needed: 3/4 cup',
          'Have: 1/2 cup = 2/4 cup',
          'Need: 3/4 - 2/4 = 1/4 cup'
        ]
      },
      {
        id: 'fw5',
        question: 'If you study 1/2 hour each day for 5 days, how many total hours did you study?',
        answer: '2.5',
        solution: [
          '1/2 hour per day × 5 days',
          '5/2 hours = 2.5 hours'
        ]
      }
    ]
  },

  'ged-010': {
    title: 'Decimal Applications',
    description: 'Use decimals in practical scenarios',
    mode: 'AURA',
    difficulty: 'Intermediate',
    estimatedTime: '25-30 min',
    sector: 'Foundation',
    prerequisites: ['ged-007'],
    coordinates: { x: 450, y: 550 },
    icon: '🛒',
    xpRequired: 150,
    problems: [
      {
        id: 'da1',
        question: 'You buy items costing $3.50, $2.25, and $1.75. What is the total cost?',
        answer: '$7.50',
        solution: [
          'Add the costs: $3.50 + $2.25 + $1.75',
          '$3.50 + $2.25 = $5.75',
          '$5.75 + $1.75 = $7.50'
        ]
      },
      {
        id: 'da2',
        question: 'If sales tax is 8%, what is the tax on a $25 purchase?',
        answer: '$2.00',
        solution: [
          'Tax = 8% of $25',
          '0.08 × 25 = $2.00'
        ]
      },
      {
        id: 'da3',
        question: 'A car gets 28.5 miles per gallon. How far can it go on 10 gallons?',
        answer: '285 miles',
        solution: [
          'Distance = miles per gallon × gallons',
          '28.5 × 10 = 285 miles'
        ]
      },
      {
        id: 'da4',
        question: 'If you save $12.50 per week, how much will you save in 4 weeks?',
        answer: '$50.00',
        solution: [
          'Weekly savings × number of weeks',
          '$12.50 × 4 = $50.00'
        ]
      },
      {
        id: 'da5',
        question: 'A shirt costs $19.99. If you pay with a $20 bill, how much change do you get?',
        answer: '$0.01',
        solution: [
          'Change = amount paid - cost',
          '$20.00 - $19.99 = $0.01'
        ]
      }
    ]
  },

  'ged-011': {
    title: 'Multi-Step Equations',
    description: 'Solve equations requiring multiple steps',
    mode: 'FORGE',
    difficulty: 'Intermediate',
    estimatedTime: '25-30 min',
    sector: 'Foundation',
    prerequisites: ['ged-008'],
    coordinates: { x: 650, y: 550 },
    icon: '🔧',
    xpRequired: 150,
    problems: [
      {
        id: 'me1',
        equation: '2x + 3 = 11',
        answer: '4',
        solution: [
          'Subtract 3 from both sides: 2x = 8',
          'Divide by 2: x = 4'
        ]
      },
      {
        id: 'me2',
        equation: '3x - 4 = 11',
        answer: '5',
        solution: [
          'Add 4 to both sides: 3x = 15',
          'Divide by 3: x = 5'
        ]
      },
      {
        id: 'me3',
        equation: 'x/2 + 1 = 5',
        answer: '8',
        solution: [
          'Subtract 1: x/2 = 4',
          'Multiply by 2: x = 8'
        ]
      },
      {
        id: 'me4',
        equation: '4x + 2 = 18',
        answer: '4',
        solution: [
          'Subtract 2: 4x = 16',
          'Divide by 4: x = 4'
        ]
      },
      {
        id: 'me5',
        equation: 'x/3 - 2 = 1',
        answer: '9',
        solution: [
          'Add 2: x/3 = 3',
          'Multiply by 3: x = 9'
        ]
      }
    ]
  },

  'ged-012': {
    title: 'Mixed Practice',
    description: 'Combine fractions, decimals, and equations',
    mode: 'FORGE',
    difficulty: 'Intermediate',
    estimatedTime: '30-35 min',
    sector: 'Foundation',
    prerequisites: ['ged-009', 'ged-010', 'ged-011'],
    coordinates: { x: 450, y: 700 },
    icon: '🎯',
    xpRequired: 200,
    problems: [
      {
        id: 'mp1',
        question: 'Solve: x + 1.5 = 4.5',
        answer: '3',
        solution: [
          'Subtract 1.5: x = 4.5 - 1.5',
          'x = 3'
        ]
      },
      {
        id: 'mp2',
        question: 'Convert 0.25 to a fraction and simplify',
        answer: '1/4',
        solution: [
          '0.25 = 25/100',
          'Simplify: divide by 25',
          '25 ÷ 25 = 1, 100 ÷ 25 = 4',
          'Result: 1/4'
        ]
      },
      {
        id: 'mp3',
        equation: '2x - 0.5 = 3.5',
        answer: '2',
        solution: [
          'Add 0.5: 2x = 4.0',
          'Divide by 2: x = 2'
        ]
      },
      {
        id: 'mp4',
        question: 'Add: 1/2 + 0.25',
        answer: '0.75',
        solution: [
          'Convert 1/2 to decimal: 0.5',
          'Add: 0.5 + 0.25 = 0.75'
        ]
      },
      {
        id: 'mp5',
        equation: 'x/4 + 1/2 = 1',
        answer: '2',
        solution: [
          'Subtract 1/2: x/4 = 1/2',
          'Multiply by 4: x = 2'
        ]
      }
    ]
  },

  'stronghold-001': {
    title: 'GED Stronghold Exam',
    description: 'Timed simulated exam to test your readiness',
    mode: 'FORGE',
    difficulty: 'EXAM',
    estimatedTime: '15 minutes',
    sector: 'Expert',
    prerequisites: ['ged-001', 'ged-002', 'ged-003'],
    coordinates: { x: 900, y: 300 },
    icon: '🏰',
    xpRequired: 100,
    isStronghold: true,
    problems: [
      {
        id: 'exam-1',
        equation: '3x + 7 = 22',
        answer: '5',
        solution: [
          'Subtract 7 from both sides: 3x = 22 - 7',
          'Simplify: 3x = 15',
          'Divide both sides by 3: x = 15/3',
          'Final answer: x = 5'
        ],
        difficulty: 1,
        concept: 'basic_algebra'
      },
      {
        id: 'exam-2',
        equation: '2y - 5 = 11',
        answer: '8',
        solution: [
          'Add 5 to both sides: 2y = 11 + 5',
          'Simplify: 2y = 16',
          'Divide both sides by 2: y = 16/2',
          'Final answer: y = 8'
        ],
        difficulty: 1,
        concept: 'basic_algebra'
      },
      {
        id: 'exam-3',
        equation: '4x + 9 = 33',
        answer: '6',
        solution: [
          'Subtract 9 from both sides: 4x = 33 - 9',
          'Simplify: 4x = 24',
          'Divide both sides by 4: x = 24/4',
          'Final answer: x = 6'
        ],
        difficulty: 1,
        concept: 'basic_algebra'
      },
      {
        id: 'exam-4',
        equation: '5y - 12 = 18',
        answer: '6',
        solution: [
          'Add 12 to both sides: 5y = 18 + 12',
          'Simplify: 5y = 30',
          'Divide both sides by 5: y = 30/5',
          'Final answer: y = 6'
        ],
        difficulty: 1,
        concept: 'basic_algebra'
      },
      {
        id: 'exam-5',
        equation: '2x + 3x = 25',
        answer: '5',
        solution: [
          'Combine like terms: 5x = 25',
          'Divide both sides by 5: x = 25/5',
          'Final answer: x = 5'
        ],
        difficulty: 2,
        concept: 'combining_terms'
      },
      {
        id: 'exam-6',
        equation: '4y - y = 18',
        answer: '6',
        solution: [
          'Combine like terms: 3y = 18',
          'Divide both sides by 3: y = 18/3',
          'Final answer: y = 6'
        ],
        difficulty: 2,
        concept: 'combining_terms'
      },
      {
        id: 'exam-7',
        equation: '3(x + 2) = 21',
        answer: '5',
        solution: [
          'Distribute: 3x + 6 = 21',
          'Subtract 6: 3x = 15',
          'Divide by 3: x = 5'
        ],
        difficulty: 2,
        concept: 'distributive_property'
      },
      {
        id: 'exam-8',
        equation: '2(y - 3) = 10',
        answer: '8',
        solution: [
          'Distribute: 2y - 6 = 10',
          'Add 6: 2y = 16',
          'Divide by 2: y = 8'
        ],
        difficulty: 2,
        concept: 'distributive_property'
      },
      {
        id: 'exam-9',
        equation: 'x/2 + 3 = 8',
        answer: '10',
        solution: [
          'Subtract 3: x/2 = 5',
          'Multiply both sides by 2: x = 10'
        ],
        difficulty: 2,
        concept: 'fractions'
      },
      {
        id: 'exam-10',
        equation: 'y/3 + 4 = 7',
        answer: '9',
        solution: [
          'Subtract 4: y/3 = 3',
          'Multiply both sides by 3: y = 9'
        ],
        difficulty: 2,
        concept: 'fractions'
      }
    ]
  },

  // Zone Alpha - Fraction-to-Decimal Focus
  'ged-051': {
    title: 'Fraction Mastery',
    description: 'Convert between fractions and decimals with precision',
    mode: 'AURA',
    difficulty: 'Intermediate',
    estimatedTime: '20-25 min',
    sector: 'Alpha',
    prerequisites: ['ged-003'],
    coordinates: { x: 800, y: 200 },
    icon: '🔢',
    xpRequired: 250,
    tacticalTip: 'Tactical Tip: Use [n/d] key for fractions. Press [f◊►d] to toggle between fraction and decimal.',
    problems: [
      {
        id: 'alpha1',
        question: 'Convert 3/4 to decimal',
        answer: '0.75',
        equation: '3/4',
        concept: 'fraction_to_decimal',
        solution: [
          'Step 1: Divide numerator by denominator',
          'Step 2: 3 ÷ 4 = 0.75'
        ],
        difficulty: 2
      },
      {
        id: 'alpha2',
        question: 'Convert 5/8 to decimal',
        answer: '0.625',
        equation: '5/8',
        concept: 'fraction_to_decimal',
        solution: [
          'Step 1: Divide numerator by denominator',
          'Step 2: 5 ÷ 8 = 0.625'
        ],
        difficulty: 2
      },
      {
        id: 'alpha3',
        question: 'Convert 0.4 to fraction',
        answer: '2/5',
        equation: '0.4',
        concept: 'decimal_to_fraction',
        solution: [
          'Step 1: Write as fraction over 10',
          'Step 2: Simplify: 4/10 = 2/5'
        ],
        difficulty: 3
      },
      {
        id: 'alpha4',
        question: 'Convert 7/12 to decimal',
        answer: '0.583',
        equation: '7/12',
        concept: 'fraction_to_decimal',
        solution: [
          'Step 1: Divide numerator by denominator',
          'Step 2: 7 ÷ 12 ≈ 0.583'
        ],
        difficulty: 3
      },
      {
        id: 'alpha5',
        question: 'Convert 0.875 to fraction',
        answer: '7/8',
        equation: '0.875',
        concept: 'decimal_to_fraction',
        solution: [
          'Step 1: Write as fraction over 1000',
          'Step 2: Simplify: 875/1000 = 7/8'
        ],
        difficulty: 3
      },
      {
        id: 'alpha6',
        question: 'Add: 2/3 + 1/4',
        answer: '11/12',
        equation: '2/3 + 1/4',
        concept: 'fraction_addition',
        solution: [
          'Step 1: Find common denominator: 12',
          'Step 2: Convert: 8/12 + 3/12 = 11/12'
        ],
        difficulty: 4
      },
      {
        id: 'alpha7',
        question: 'Subtract: 5/6 - 1/3',
        answer: '1/2',
        equation: '5/6 - 1/3',
        concept: 'fraction_subtraction',
        solution: [
          'Step 1: Find common denominator: 6',
          'Step 2: Convert: 5/6 - 2/6 = 3/6 = 1/2'
        ],
        difficulty: 4
      },
      {
        id: 'alpha8',
        question: 'Multiply: 3/4 × 2/5',
        answer: '3/10',
        equation: '3/4 × 2/5',
        concept: 'fraction_multiplication',
        solution: [
          'Step 1: Multiply numerators: 3 × 2 = 6',
          'Step 2: Multiply denominators: 4 × 5 = 20',
          'Step 3: Combine: 6/20 = 3/10'
        ],
        difficulty: 4
      },
      {
        id: 'alpha9',
        question: 'Divide: (3/4) ÷ (1/2)',
        answer: '3/2',
        equation: '(3/4) ÷ (1/2)',
        concept: 'fraction_division',
        solution: [
          'Step 1: Multiply by reciprocal: (3/4) × (2/1)',
          'Step 2: Multiply: 6/4 = 3/2'
        ],
        difficulty: 5,
        requiresGhostCalc: true
      },
      {
        id: 'alpha10',
        question: 'Convert 2.125 to mixed number',
        answer: '2 1/8',
        equation: '2.125',
        concept: 'decimal_to_mixed',
        solution: [
          'Step 1: Whole number: 2',
          'Step 2: Decimal part: 0.125 = 125/1000 = 1/8',
          'Step 3: Combine: 2 1/8'
        ],
        difficulty: 5,
        requiresGhostCalc: true
      }
    ]
  },

  // Zone Bravo - Variable Substitution Focus
  'ged-052': {
    title: 'Variable Substitution',
    description: 'Master calculator memory and variable operations',
    mode: 'FORGE',
    difficulty: 'Advanced',
    estimatedTime: '25-35 min',
    sector: 'Bravo',
    prerequisites: ['ged-004'],
    coordinates: { x: 1000, y: 400 },
    icon: '🧮',
    xpRequired: 300,
    tacticalTip: 'Tactical Tip: Use [STO] to store values. Use [ALPHA] + [X,T,θ,n] for variables.',
    problems: [
      {
        id: 'bravo1',
        question: 'If x = 5, evaluate 3x² - 2x + 7',
        answer: '78',
        equation: '3x² - 2x + 7',
        variable: 'x',
        concept: 'substitution',
        solution: [
          'Step 1: Substitute x = 5',
          'Step 2: 3(5)² - 2(5) + 7',
          'Step 3: 3(25) - 10 + 7 = 75 - 10 + 7 = 78'
        ],
        difficulty: 3
      },
      {
        id: 'bravo2',
        question: 'If y = -3, evaluate 2y³ + 4y - 5',
        answer: '-38',
        equation: '2y³ + 4y - 5',
        variable: 'y',
        concept: 'substitution',
        solution: [
          'Step 1: Substitute y = -3',
          'Step 2: 2(-3)³ + 4(-3) - 5',
          'Step 3: 2(-27) - 12 - 5 = -54 - 12 - 5 = -71'
        ],
        difficulty: 3
      },
      {
        id: 'bravo3',
        question: 'Store 42 in memory, then calculate 5x + MEM',
        answer: '5x + 42',
        equation: '5x + MEM',
        concept: 'calculator_memory',
        solution: [
          'Step 1: Press [STO] [4] [2] [ENTER]',
          'Step 2: Memory now contains 42',
          'Step 3: Use [ALPHA] [MEM] [ENTER] to recall'
        ],
        difficulty: 4
      },
      {
        id: 'bravo4',
        question: 'If a = 7 and b = 3, evaluate ab² - 2ab',
        answer: '105',
        equation: 'ab² - 2ab',
        variables: ['a', 'b'],
        concept: 'multi_variable',
        solution: [
          'Step 1: Substitute a = 7, b = 3',
          'Step 2: (7)(3)² - 2(7)(3)',
          'Step 3: 49 - 42 = 7'
        ],
        difficulty: 4
      },
      {
        id: 'bravo5',
        question: 'Store π in memory, then calculate 2πr',
        answer: '2πr',
        equation: '2πr',
        concept: 'memory_with_constants',
        solution: [
          'Step 1: Press [2nd] [π] [STO] [ENTER]',
          'Step 2: Memory now contains π',
          'Step 3: Use [2] [×] [ALPHA] [π] [×] [r] [ENTER]'
        ],
        difficulty: 4
      },
      {
        id: 'bravo6',
        question: 'If x = √12, evaluate x³ + 3x',
        answer: '12√12 + 3√12',
        equation: 'x³ + 3x',
        variable: 'x',
        concept: 'radical_substitution',
        solution: [
          'Step 1: Substitute x = √12',
          'Step 2: (√12)³ + 3(√12)',
          'Step 3: 12√12 + 3√12'
        ],
        difficulty: 5
      },
      {
        id: 'bravo7',
        question: 'Store 2.5 in memory, then calculate 4x² + MEM',
        answer: '4x² + 2.5',
        equation: '4x² + MEM',
        concept: 'decimal_memory',
        solution: [
          'Step 1: Press [2] [.] [5] [STO] [ENTER]',
          'Step 2: Memory now contains 2.5',
          'Step 3: Use [4] [×] [x²] [+] [ALPHA] [MEM] [ENTER]'
        ],
        difficulty: 5,
        requiresGhostCalc: true
      },
      {
        id: 'bravo8',
        question: 'If y = 2x + 1 and x = 3, find y using memory',
        answer: '7',
        equation: 'y = 2x + 1',
        variables: ['x', 'y'],
        concept: 'memory_substitution',
        solution: [
          'Step 1: Store x = 3 in memory: [3] [STO] [ENTER]',
          'Step 2: Calculate y = 2(MEM) + 1',
          'Step 3: y = 2(3) + 1 = 7'
        ],
        difficulty: 5,
        requiresGhostCalc: true
      },
      {
        id: 'bravo9',
        question: 'Evaluate 3x²y - 2xy² when x = 4, y = 5',
        answer: '3(4)²(5) - 2(4)(5)²',
        equation: '3x²y - 2xy²',
        variables: ['x', 'y'],
        concept: 'complex_substitution',
        solution: [
          'Step 1: Substitute x = 4, y = 5',
          'Step 2: 3(4)²(5) - 2(4)(5)²',
          'Step 3: 3(16)(5) - 2(4)(25) = 240 - 200 = 40'
        ],
        difficulty: 5,
        requiresGhostCalc: true
      },
      {
        id: 'bravo10',
        question: 'Store e in memory, then calculate x² + 2xe + MEM',
        answer: 'x² + 2xe + e',
        equation: 'x² + 2xe + MEM',
        concept: 'exponential_memory',
        solution: [
          'Step 1: Press [2nd] [ln] [STO] [ENTER]',
          'Step 2: Memory now contains e',
          'Step 3: Use [x²] [+] [2] [×] [x] [×] [ALPHA] [e] [+] [ALPHA] [MEM] [ENTER]'
        ],
        difficulty: 5,
        requiresGhostCalc: true
      }
    ]
  },

  // Zone Charlie - Formula Application Focus
  'ged-053': {
    title: 'Formula Application',
    description: 'Apply formulas for volume, surface area, and more',
    mode: 'VERVE',
    difficulty: 'Advanced',
    estimatedTime: '30-40 min',
    sector: 'Charlie',
    prerequisites: ['ged-012'],
    coordinates: { x: 1200, y: 300 },
    icon: '📐',
    xpRequired: 350,
    tacticalTip: 'Tactical Tip: Use [x²] for squares, [√] for roots. Store intermediate results.',
    problems: [
      {
        id: 'charlie1',
        question: 'Find volume of cylinder with radius 4, height 10',
        answer: '502.65',
        equation: 'V = πr²h',
        concept: 'cylinder_volume',
        solution: [
          'Step 1: V = π(4)²(10)',
          'Step 2: V = π(16)(10) = 160π ≈ 502.65'
        ],
        difficulty: 3
      },
      {
        id: 'charlie2',
        question: 'Find surface area of sphere with radius 6',
        answer: '452.39',
        equation: 'SA = 4πr²',
        concept: 'sphere_surface_area',
        solution: [
          'Step 1: SA = 4π(6)²',
          'Step 2: SA = 4π(36) = 144π ≈ 452.39'
        ],
        difficulty: 3
      },
      {
        id: 'charlie3',
        question: 'Find volume of cone with radius 5, height 12',
        answer: '314.16',
        equation: 'V = (1/3)πr²h',
        concept: 'cone_volume',
        solution: [
          'Step 1: V = (1/3)π(5)²(12)',
          'Step 2: V = (1/3)π(25)(12) = 100π ≈ 314.16'
        ],
        difficulty: 4
      },
      {
        id: 'charlie4',
        question: 'Find surface area of rectangular prism: 3×4×5',
        answer: '94',
        equation: 'SA = 2(lw + lh + wh)',
        concept: 'prism_surface_area',
        solution: [
          'Step 1: SA = 2(3×4 + 3×5 + 4×5)',
          'Step 2: SA = 2(12 + 15 + 20) = 2(47) = 94'
        ],
        difficulty: 4
      },
      {
        id: 'charlie5',
        question: 'Find volume of pyramid with square base 6×6, height 8',
        answer: '96',
        equation: 'V = (1/3)Bh',
        concept: 'pyramid_volume',
        solution: [
          'Step 1: Base area = 6×6 = 36',
          'Step 2: V = (1/3)(36)(8) = 12×8 = 96'
        ],
        difficulty: 4
      },
      {
        id: 'charlie6',
        question: 'Find surface area of cylinder with radius 7, height 15',
        answer: '967.61',
        equation: 'SA = 2πr² + 2πrh',
        concept: 'cylinder_surface_area',
        solution: [
          'Step 1: SA = 2π(7)² + 2π(7)(15)',
          'Step 2: SA = 2π(49) + 2π(105) = 98π + 210π = 308π ≈ 967.61'
        ],
        difficulty: 5
      },
      {
        id: 'charlie7',
        question: 'Find volume of sphere with radius 8',
        answer: '2144.66',
        equation: 'V = (4/3)πr³',
        concept: 'sphere_volume',
        solution: [
          'Step 1: V = (4/3)π(8)³',
          'Step 2: V = (4/3)π(512) = (2048/3)π ≈ 2144.66'
        ],
        difficulty: 5
      },
      {
        id: 'charlie8',
        question: 'Find surface area of cone with radius 9, slant height 15',
        answer: '678.58',
        equation: 'SA = πr² + πrl',
        concept: 'cone_surface_area',
        solution: [
          'Step 1: SA = π(9)² + π(9)(15)',
          'Step 2: SA = 81π + 135π = 216π ≈ 678.58'
        ],
        difficulty: 5,
        requiresGhostCalc: true
      },
      {
        id: 'charlie9',
        question: 'Find volume of complex shape: cylinder r=3, h=4 + cone r=2, h=6',
        answer: '141.37',
        equation: 'V = πr²h + (1/3)πr²h',
        concept: 'composite_volume',
        solution: [
          'Step 1: Cylinder: π(3)²(4) = 36π',
          'Step 2: Cone: (1/3)π(2)²(6) = 8π',
          'Step 3: Total: 36π + 8π = 44π ≈ 138.23'
        ],
        difficulty: 5,
        requiresGhostCalc: true
      },
      {
        id: 'charlie10',
        question: 'Find surface area of complex shape: sphere r=4 + cylinder r=3, h=5',
        answer: '263.89',
        equation: 'SA = 4πr² + 2πr² + 2πrh',
        concept: 'composite_surface_area',
        solution: [
          'Step 1: Sphere: 4π(4)² = 64π',
          'Step 2: Cylinder: 2π(3)² + 2π(3)(5) = 18π + 30π = 48π',
          'Step 3: Total: 64π + 48π = 112π ≈ 351.86'
        ],
        difficulty: 5,
        requiresGhostCalc: true
      }
    ]
  },

  // Zone Delta - Mean and Median Focus
  'ged-054': {
    title: 'Mean and Median',
    description: 'Calculate central tendency from data sets',
    mode: 'AURA',
    difficulty: 'Expert',
    estimatedTime: '35-45 min',
    sector: 'Delta',
    prerequisites: ['ged-025'],
    coordinates: { x: 1400, y: 400 },
    icon: '📊',
    xpRequired: 400,
    tacticalTip: 'Tactical Tip: Use calculator memory for running totals. [2nd] [STAT] for statistics.',
    problems: [
      {
        id: 'delta1',
        question: 'Find mean: 12, 15, 18, 21, 24',
        answer: '18',
        data: [12, 15, 18, 21, 24],
        concept: 'mean',
        solution: [
          'Step 1: Sum all values: 12 + 15 + 18 + 21 + 24 = 90',
          'Step 2: Divide by count: 90 ÷ 5 = 18'
        ],
        difficulty: 3
      },
      {
        id: 'delta2',
        question: 'Find median: 8, 12, 16, 20, 25',
        answer: '16',
        data: [8, 12, 16, 20, 25],
        concept: 'median',
        solution: [
          'Step 1: Order data: 8, 12, 16, 20, 25',
          'Step 2: Middle value is 16'
        ],
        difficulty: 3
      },
      {
        id: 'delta3',
        question: 'Find mean: 45, 52, 48, 61, 59, 55',
        answer: '53.33',
        data: [45, 52, 48, 61, 59, 55],
        concept: 'mean',
        solution: [
          'Step 1: Sum all values: 45 + 52 + 48 + 61 + 59 + 55 = 320',
          'Step 2: Divide by count: 320 ÷ 6 ≈ 53.33'
        ],
        difficulty: 4
      },
      {
        id: 'delta4',
        question: 'Find median: 33, 41, 28, 36, 39, 42',
        answer: '37.5',
        data: [33, 41, 28, 36, 39, 42],
        concept: 'median',
        solution: [
          'Step 1: Order data: 28, 33, 36, 39, 41, 42',
          'Step 2: Average middle two: (36 + 39) ÷ 2 = 37.5'
        ],
        difficulty: 4
      },
      {
        id: 'delta5',
        question: 'Find mode: 7, 9, 7, 12, 9, 7, 15',
        answer: '7',
        data: [7, 9, 7, 12, 9, 7, 15],
        concept: 'mode',
        solution: [
          'Step 1: Count frequency: 7 appears 3 times, 9 appears 2 times, 12 appears 1 time, 15 appears 1 time',
          'Step 2: Most frequent value is 7'
        ],
        difficulty: 4
      },
      {
        id: 'delta6',
        question: 'Find range: 15, 22, 18, 31, 25, 28',
        answer: '16',
        data: [15, 22, 18, 31, 25, 28],
        concept: 'range',
        solution: [
          'Step 1: Find min and max: min = 15, max = 31',
          'Step 2: Range = max - min = 31 - 15 = 16'
        ],
        difficulty: 4
      },
      {
        id: 'delta7',
        question: 'Find mean and median: 42, 38, 45, 51, 47, 43',
        answer: 'mean=44.33, median=44.5',
        data: [42, 38, 45, 51, 47, 43],
        concept: 'mean_median',
        solution: [
          'Step 1: Mean: Sum ÷ count = 266 ÷ 6 ≈ 44.33',
          'Step 2: Median: Ordered data, middle two average = (44 + 45) ÷ 2 = 44.5'
        ],
        difficulty: 5
      },
      {
        id: 'delta8',
        question: 'Find weighted mean: grades 80(20%), 85(30%), 90(50%)',
        answer: '86.5',
        data: [80, 85, 90],
        weights: [0.2, 0.3, 0.5],
        concept: 'weighted_mean',
        solution: [
          'Step 1: Multiply grades by weights: 80×0.2=16, 85×0.3=25.5, 90×0.5=45',
          'Step 2: Sum weighted scores: 16 + 25.5 + 45 = 86.5'
        ],
        difficulty: 5
      },
      {
        id: 'delta9',
        question: 'Find standard deviation: 10, 12, 14, 16, 18',
        answer: '2.83',
        data: [10, 12, 14, 16, 18],
        concept: 'standard_deviation',
        solution: [
          'Step 1: Mean = (10+12+14+16+18)÷5 = 14',
          'Step 2: Variance = [(10-14)²+(12-14)²+(14-14)²+(16-14)²+(18-14)²]÷5 = 8',
          'Step 3: Standard deviation = √8 ≈ 2.83'
        ],
        difficulty: 5,
        requiresGhostCalc: true
      },
      {
        id: 'delta10',
        question: 'Find quartiles: 12, 15, 18, 21, 24, 27, 30',
        answer: 'Q1=16.5, Q2=21, Q3=25.5',
        data: [12, 15, 18, 21, 24, 27, 30],
        concept: 'quartiles',
        solution: [
          'Step 1: Order data and find medians of halves',
          'Step 2: Q1 = median of lower half = 16.5',
          'Step 3: Q2 = median of all = 21',
          'Step 4: Q3 = median of upper half = 25.5'
        ],
        difficulty: 5,
        requiresGhostCalc: true
      }
    ]
  }
}

// Helper functions for content management
export const getNodeById = (nodeId) => {
  return mathContent[nodeId] || null
}

export const getAllNodes = () => {
  return Object.values(mathContent)
}

export const getNodesBySector = (sectorName) => {
  return Object.values(mathContent).filter(node => node.sector === sectorName)
}

export const getUnlockedNodes = (completedNodes = []) => {
  return Object.values(mathContent).filter(node => {
    if (completedNodes.includes(node.id)) return false // Skip already completed
    return node.prerequisites.every(prereq => completedNodes.includes(prereq))
  })
}

// AI Problem Forge Function
export const forgeNewRep = async (zone, difficulty) => {
  try {
    // Zone-specific tactical focus templates
    const zoneTemplates = {
      'Alpha': {
        focus: 'Fraction-to-Decimal',
        tacticalTip: 'Tactical Tip: Use [n/d] key for fractions. Press [f◊►d] to toggle between fraction and decimal.',
        context: 'To secure this outpost, convert between fractions and decimals with precision.'
      },
      'Bravo': {
        focus: 'Variable Substitution',
        tacticalTip: 'Tactical Tip: Use [STO] to store values. Use [ALPHA] + [X,T,θ,n] for variables.',
        context: 'To breach this stronghold, master calculator memory and variable operations.'
      },
      'Charlie': {
        focus: 'Formula Application',
        tacticalTip: 'Tactical Tip: Use [x²] for squares, [√] for roots. Store intermediate results.',
        context: 'To fortify this position, apply formulas for volume and surface area.'
      },
      'Delta': {
        focus: 'Mean and Median',
        tacticalTip: 'Tactical Tip: Use calculator memory for running totals. [2nd] [STAT] for statistics.',
        context: 'To analyze this battlefield, calculate central tendency from data sets.'
      }
    }

    const template = zoneTemplates[zone] || zoneTemplates['Alpha']
    
    // Generate problem based on zone and difficulty
    let problem = {}
    
    switch (zone) {
      case 'Alpha':
        problem = generateFractionProblem(difficulty, template)
        break
      case 'Bravo':
        problem = generateVariableProblem(difficulty, template)
        break
      case 'Charlie':
        problem = generateFormulaProblem(difficulty, template)
        break
      case 'Delta':
        problem = generateStatisticsProblem(difficulty, template)
        break
      default:
        problem = generateFractionProblem(difficulty, template)
    }

    // Add common properties
    problem.id = `forge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    problem.difficulty = difficulty
    problem.requiresGhostCalc = difficulty >= 4
    problem.isForge = true
    problem.tacticalTip = template.tacticalTip
    problem.context = template.context

    return problem
  } catch (error) {
    console.error('Failed to forge problem:', error)
    return null
  }
}

// Zone-specific problem generators
const generateFractionProblem = (difficulty, template) => {
  const problems = {
    1: {
      question: `${template.context} Convert 3/4 to decimal.`,
      answer: '0.75',
      equation: '3/4',
      concept: 'fraction_to_decimal',
      solution: ['Step 1: Divide numerator by denominator', 'Step 2: 3 ÷ 4 = 0.75']
    },
    2: {
      question: `${template.context} Convert 0.625 to fraction.`,
      answer: '5/8',
      equation: '0.625',
      concept: 'decimal_to_fraction',
      solution: ['Step 1: Write as fraction over 1000', 'Step 2: Simplify: 625/1000 = 5/8']
    },
    3: {
      question: `${template.context} Add: 2/3 + 1/4`,
      answer: '11/12',
      equation: '2/3 + 1/4',
      concept: 'fraction_addition',
      solution: ['Step 1: Find common denominator: 12', 'Step 2: Convert: 8/12 + 3/12 = 11/12']
    },
    4: {
      question: `${template.context} Divide: (3/4) ÷ (1/2)`,
      answer: '3/2',
      equation: '(3/4) ÷ (1/2)',
      concept: 'fraction_division',
      solution: ['Step 1: Multiply by reciprocal: (3/4) × (2/1)', 'Step 2: Multiply: 6/4 = 3/2']
    },
    5: {
      question: `${template.context} Convert 2.125 to mixed number`,
      answer: '2 1/8',
      equation: '2.125',
      concept: 'decimal_to_mixed',
      solution: ['Step 1: Whole number: 2', 'Step 2: Decimal part: 0.125 = 125/1000 = 1/8', 'Step 3: Combine: 2 1/8']
    }
  }
  
  return problems[difficulty] || problems[1]
}

const generateVariableProblem = (difficulty, template) => {
  const problems = {
    1: {
      question: `${template.context} If x = 5, evaluate 3x + 7`,
      answer: '22',
      equation: '3x + 7',
      variable: 'x',
      concept: 'substitution',
      solution: ['Step 1: Substitute x = 5', 'Step 2: 3(5) + 7 = 15 + 7 = 22']
    },
    2: {
      question: `${template.context} If y = -3, evaluate 2y² + 4y`,
      answer: '6',
      equation: '2y² + 4y',
      variable: 'y',
      concept: 'substitution',
      solution: ['Step 1: Substitute y = -3', 'Step 2: 2(-3)² + 4(-3) = 2(9) - 12 = 18 - 12 = 6']
    },
    3: {
      question: `${template.context} Store 42 in memory, then calculate 5x + MEM`,
      answer: '5x + 42',
      equation: '5x + MEM',
      concept: 'calculator_memory',
      solution: ['Step 1: Press [STO] [4] [2] [ENTER]', 'Step 2: Memory now contains 42', 'Step 3: Use [ALPHA] [MEM] [ENTER] to recall']
    },
    4: {
      question: `${template.context} If a = 7 and b = 3, evaluate ab² - 2ab`,
      answer: '21',
      equation: 'ab² - 2ab',
      variables: ['a', 'b'],
      concept: 'multi_variable',
      solution: ['Step 1: Substitute a = 7, b = 3', 'Step 2: (7)(3)² - 2(7)(3) = 7(9) - 42 = 63 - 42 = 21']
    },
    5: {
      question: `${template.context} Store π in memory, then calculate 2πr`,
      answer: '2πr',
      equation: '2πr',
      concept: 'memory_with_constants',
      solution: ['Step 1: Press [2nd] [π] [STO] [ENTER]', 'Step 2: Memory now contains π', 'Step 3: Use [2] [×] [ALPHA] [π] [×] [r] [ENTER]']
    }
  }
  
  return problems[difficulty] || problems[1]
}

const generateFormulaProblem = (difficulty, template) => {
  const problems = {
    1: {
      question: `${template.context} Find volume of cylinder with radius 4, height 10`,
      answer: '502.65',
      equation: 'V = πr²h',
      concept: 'cylinder_volume',
      solution: ['Step 1: V = π(4)²(10)', 'Step 2: V = π(16)(10) = 160π ≈ 502.65']
    },
    2: {
      question: `${template.context} Find surface area of sphere with radius 6`,
      answer: '452.39',
      equation: 'SA = 4πr²',
      concept: 'sphere_surface_area',
      solution: ['Step 1: SA = 4π(6)²', 'Step 2: SA = 4π(36) = 144π ≈ 452.39']
    },
    3: {
      question: `${template.context} Find volume of cone with radius 5, height 12`,
      answer: '314.16',
      equation: 'V = (1/3)πr²h',
      concept: 'cone_volume',
      solution: ['Step 1: V = (1/3)π(5)²(12)', 'Step 2: V = (1/3)π(25)(12) = 100π ≈ 314.16']
    },
    4: {
      question: `${template.context} Find surface area of cylinder with radius 7, height 15`,
      answer: '967.61',
      equation: 'SA = 2πr² + 2πrh',
      concept: 'cylinder_surface_area',
      solution: ['Step 1: SA = 2π(7)² + 2π(7)(15)', 'Step 2: SA = 2π(49) + 2π(105) = 98π + 210π = 308π ≈ 967.61']
    },
    5: {
      question: `${template.context} Find volume of sphere with radius 8`,
      answer: '2144.66',
      equation: 'V = (4/3)πr³',
      concept: 'sphere_volume',
      solution: ['Step 1: V = (4/3)π(8)³', 'Step 2: V = (4/3)π(512) = (2048/3)π ≈ 2144.66']
    }
  }
  
  return problems[difficulty] || problems[1]
}

const generateStatisticsProblem = (difficulty, template) => {
  const problems = {
    1: {
      question: `${template.context} Find mean: 12, 15, 18, 21, 24`,
      answer: '18',
      data: [12, 15, 18, 21, 24],
      concept: 'mean',
      solution: ['Step 1: Sum all values: 12 + 15 + 18 + 21 + 24 = 90', 'Step 2: Divide by count: 90 ÷ 5 = 18']
    },
    2: {
      question: `${template.context} Find median: 8, 12, 16, 20, 25`,
      answer: '16',
      data: [8, 12, 16, 20, 25],
      concept: 'median',
      solution: ['Step 1: Order data: 8, 12, 16, 20, 25', 'Step 2: Middle value is 16']
    },
    3: {
      question: `${template.context} Find mean: 45, 52, 48, 61, 59, 55`,
      answer: '53.33',
      data: [45, 52, 48, 61, 59, 55],
      concept: 'mean',
      solution: ['Step 1: Sum all values: 45 + 52 + 48 + 61 + 59 + 55 = 320', 'Step 2: Divide by count: 320 ÷ 6 ≈ 53.33']
    },
    4: {
      question: `${template.context} Find weighted mean: grades 80(20%), 85(30%), 90(50%)`,
      answer: '86.5',
      data: [80, 85, 90],
      weights: [0.2, 0.3, 0.5],
      concept: 'weighted_mean',
      solution: ['Step 1: Multiply grades by weights: 80×0.2=16, 85×0.3=25.5, 90×0.5=45', 'Step 2: Sum weighted scores: 16 + 25.5 + 45 = 86.5']
    },
    5: {
      question: `${template.context} Find standard deviation: 10, 12, 14, 16, 18`,
      answer: '2.83',
      data: [10, 12, 14, 16, 18],
      concept: 'standard_deviation',
      solution: ['Step 1: Mean = (10+12+14+16+18)÷5 = 14', 'Step 2: Variance = [(10-14)²+(12-14)²+(14-14)²+(16-14)²+(18-14)²]÷5 = 8', 'Step 3: Standard deviation = √8 ≈ 2.83']
    }
  }
  
  return problems[difficulty] || problems[1]
}

export const getNextUnlockedNode = (completedNodes = []) => {
  const unlocked = getUnlockedNodes(completedNodes)
  return unlocked.find(node => !completedNodes.includes(node.id))
}
