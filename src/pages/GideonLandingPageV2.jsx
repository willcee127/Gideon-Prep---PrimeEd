import React from 'react'

const GideonLandingPageV2 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white font-mono overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Background Glow */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-lavender-500/10 via-blue-500/5 to-transparent animate-pulse" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Alert Badge */}
          <div className="absolute -top-8 -right-8 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-orange-500/50">
            🎯 GIDEON COMMAND CENTER
          </div>

          {/* Main Headline */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight" style={{ textShadow: '0 0 15px rgba(255, 191, 0, 0.5)' }}>
              STOP HIDING IN<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text" style={{ textShadow: '0 0 20px rgba(255, 191, 0, 0.8)' }}>THE WINEPRESS</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Transform to Conquer Your GED.<br />
              Master mathematics through tactical precision and strategic mastery.
            </p>
          </div>

          {/* Guardian Assembly Visualization */}
          <div className="mb-8">
            <div className="relative w-64 h-64 mx-auto">
              {/* Central Guardian Core */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/15 to-amber-500/20 backdrop-blur-md border-2 border-amber-400/40 flex items-center justify-center"
                  style={{
                    boxShadow: '0 0 40px rgba(255, 191, 0, 0.2), inset 0 0 20px rgba(255, 191, 0, 0.1)'
                  }}>
                <div className="text-6xl" style={{ color: '#fbbf24' }}>
                  🛡️
                </div>
              </div>
              
              {/* Orbiting Guardian Elements */}
              {[0, 120, 240].map((angle, index) => (
                <div
                  key={index}
                  className="absolute inset-0"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lavender-400/25 to-cyan-400/25 backdrop-blur-sm border border-lavender-400/60 flex items-center justify-center text-2xl"
                         style={{
                           boxShadow: '0 0 20px rgba(230, 230, 250, 0.3), inset 0 0 10px rgba(230, 230, 250, 0.2)'
                         }}>
                      {typeof index === 'number' && ['🌱', '⚡', '🏆'][index] || '🌱'}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Protective Aura */}
              <div className="absolute inset-0 rounded-full border-2 border-amber-400/15"
                  style={{
                    boxShadow: 'inset 0 0 30px rgba(255, 191, 0, 0.1)'
                  }}
              />
              
              {/* Hero Ring */}
              <div className="absolute inset-0 rounded-full border border-amber-400/20"
                  style={{
                    borderStyle: 'dashed',
                    boxShadow: '0 0 15px rgba(255, 191, 0, 0.15)'
                  }}
              />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="/mission"
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl shadow-amber-400/50 transform hover:scale-105"
            >
              🎯 START INITIAL RECRUITMENT & DIAGNOSTIC
            </a>

            <a
              href="/mission"
              className="border-2 border-cyan-400 hover:border-cyan-300 hover:bg-cyan-400/10 text-cyan-400 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg backdrop-blur-sm"
            >
              🚀 EXISTING WARRIOR
            </a>
          </div>
        </div>
      </section>

      {/* Transformation Protocol Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text">
                TRANSFORMATION PROTOCOL
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Three phases to reclaim your mathematical sovereignty
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* PHASE 1 - VERVE (Lavender) */}
            <div className="rounded-3xl p-8 h-full relative overflow-hidden group bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-700/30">
              <div className="text-center">
                <div className="text-3xl font-black mb-4" style={{ color: '#c4b5fd' }}>
                  PHASE 1
                </div>
                <div className="text-xl font-bold mb-2 text-lavender-300">
                  VERVE
                </div>
                <p className="text-slate-200 mb-4">
                  Foundational Mastery
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Build your mathematical foundation through systematic practice and precision training. Master the fundamentals that will carry you through advanced concepts.
                </p>
              </div>
            </div>

            {/* PHASE 2 - AURA (Cyan) */}
            <div className="rounded-3xl p-8 h-full bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 border border-cyan-700/30">
              <div className="text-center">
                <div className="text-3xl font-black mb-4" style={{ color: '#67e8f9' }}>
                  PHASE 2
                </div>
                <div className="text-xl font-bold mb-2 text-cyan-300">
                  AURA
                </div>
                <p className="text-slate-200 mb-4">
                  Strategic Thinking
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Develop tactical problem-solving skills and strategic approaches to complex mathematical challenges. Think like a mathematician.
                </p>
              </div>
            </div>

            {/* PHASE 3 - FORGE (Amber) */}
            <div className="rounded-3xl p-8 h-full bg-gradient-to-br from-amber-900/20 to-amber-800/10 border border-amber-700/30">
              <div className="text-center">
                <div className="text-3xl font-black mb-4" style={{ color: '#fbbf24' }}>
                  PHASE 3
                </div>
                <div className="text-xl font-bold mb-2 text-amber-300">
                  FORGE
                </div>
                <p className="text-slate-200 mb-4">
                  Advanced Application
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Apply your mastery to real-world scenarios and advanced mathematical concepts. Forge your path to success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text">
                TACTICAL ADVANTAGES
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Cutting-edge tools and strategies for mathematical mastery
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
              <div className="text-4xl mb-4 text-purple-400">🎯</div>
              <h3 className="text-xl font-bold mb-2 text-white">Precision Targeting</h3>
              <p className="text-gray-300">
                Focus on exactly what you need to master with our adaptive learning system that targets your specific weaknesses.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
              <div className="text-4xl mb-4 text-cyan-400">⚡</div>
              <h3 className="text-xl font-bold mb-2 text-white">Lightning Progress</h3>
              <p className="text-gray-300">
                Accelerated learning paths that help you achieve mastery in record time without sacrificing understanding.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
              <div className="text-4xl mb-4 text-amber-400">🛡️</div>
              <h3 className="text-xl font-bold mb-2 text-white">Guardian Support</h3>
              <p className="text-gray-300">
                Real-time tactical support when you need it most. Step-by-step guidance, hints, and encouragement to keep you moving forward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-black to-slate-900 py-12 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-gray-400">
            <a
              href="https://ko-fi.com/willcee127"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition-colors flex items-center gap-2"
            >
              <span>💪 Support the Mission</span>
            </a>
            
            <a
              href="/privacy"
              className="hover:text-yellow-400 transition-colors flex items-center gap-2"
            >
              <span>📋 Privacy</span>
            </a>
            
            <a
              href="/terms"
              className="hover:text-yellow-400 transition-colors flex items-center gap-2"
            >
              <span>📜 Terms</span>
            </a>
          </div>
          
          <div className="text-center mt-8 text-gray-500 text-sm">
            <div className="text-amber-400 font-bold text-lg mb-2">
              FIELD TESTING ACTIVE — START MISSION
            </div>
            &copy; 2026 Gideon Prep - Tactical Training Systems
          </div>
        </div>
      </footer>
    </div>
  )
}

export default GideonLandingPageV2
