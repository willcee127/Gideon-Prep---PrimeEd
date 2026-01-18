import React from 'react'
import { useNavigate } from 'react-router-dom'

const GideonLandingPageV2 = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-slate-900 text-white font-mono overflow-x-hidden" style={{backgroundColor: '#0a0a0b'}}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Background Glow */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-800/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-700/5 via-blue-800/2 to-transparent animate-pulse" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Main Headline */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight" style={{ textShadow: '0 0 15px rgba(255, 191, 0, 0.5)' }}>
              Master Your GED.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text" style={{ textShadow: '0 0 20px rgba(255, 191, 0, 0.8)' }}>Achieve Your Goals</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Build your mathematical confidence with personalized learning.<br />
              Progress at your own pace with targeted support.
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
            <button
              onClick={() => navigate('/onboarding')}
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl shadow-amber-400/50 transform hover:scale-105"
            >
              🎯 START MISSION (FREE)
            </button>

            <button
              onClick={() => navigate('/mission')}
              className="border-2 border-cyan-400 hover:border-cyan-300 hover:bg-cyan-400/10 text-cyan-400 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg backdrop-blur-sm"
            >
              🚀 CONTINUE LEARNING
            </button>
          </div>
        </div>
      </section>

      {/* Learning Pathways Section */}
      <section className="py-20 px-4" style={{backgroundColor: '#0a0a0b'}}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text">
                LEARNING PATHWAYS
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Three stages to build your mathematical confidence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* STAGE 1 - BUILD (Lavender) */}
            <div className="rounded-3xl p-8 h-full relative overflow-hidden group bg-slate-800/50 border border-slate-700/30">
              <div className="text-center">
                <div className="text-3xl font-black mb-4" style={{ color: '#c4b5fd' }}>
                  STAGE 1
                </div>
                <div className="text-xl font-bold mb-2 text-lavender-300">
                  BUILD
                </div>
                <p className="text-slate-200 mb-4">
                  Foundational Skills
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Master core concepts and build your mathematical foundation through guided practice and clear explanations.
                </p>
              </div>
            </div>

            {/* STAGE 2 - GROW (Cyan) */}
            <div className="rounded-3xl p-8 h-full bg-slate-800/50 border border-slate-700/30">
              <div className="text-center">
                <div className="text-3xl font-black mb-4" style={{ color: '#67e8f9' }}>
                  STAGE 2
                </div>
                <div className="text-xl font-bold mb-2 text-cyan-300">
                  GROW
                </div>
                <p className="text-slate-200 mb-4">
                  Problem-Solving Skills
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Develop your analytical thinking and learn effective strategies for solving complex mathematical problems.
                </p>
              </div>
            </div>

            {/* STAGE 3 - ACHIEVE (Amber) */}
            <div className="rounded-3xl p-8 h-full bg-slate-800/50 border border-slate-700/30" style={{border: '2px solid #f59e0b', boxShadow: '0 0 20px rgba(245, 158, 11, 0.1)'}}>
              <div className="text-center">
                <div className="text-3xl font-black mb-4" style={{ color: '#fbbf24' }}>
                  STAGE 3
                </div>
                <div className="text-xl font-bold mb-2 text-amber-300">
                  ACHIEVE
                </div>
                <p className="text-slate-200 mb-4">
                  Test Success
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Apply your knowledge with confidence and excel in your GED examination through focused practice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4" style={{backgroundColor: '#0a0a0b'}}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text">
                LEARNING SUPPORT
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Personalized tools and guidance for your success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
              <div className="text-4xl mb-4 text-purple-400">🎯</div>
              <h3 className="text-xl font-bold mb-2 text-white">Targeted Learning</h3>
              <p className="text-gray-300">
                Focus on exactly what you need to master with our adaptive learning system that identifies your specific areas for improvement.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
              <div className="text-4xl mb-4 text-cyan-400">⚡</div>
              <h3 className="text-xl font-bold mb-2 text-white">Steady Progress</h3>
              <p className="text-gray-300">
                Learn at your own pace with structured paths that build confidence and understanding step by step.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
              <div className="text-4xl mb-4 text-amber-400">📚</div>
              <h3 className="text-xl font-bold mb-2 text-white">Personal Guidance</h3>
              <p className="text-gray-300">
                Get help exactly when you need it with targeted support that identifies where you're stuck and provides specific guidance to move forward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{backgroundColor: '#0a0a0b'}} className="py-12 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-gray-400">
            <a
              href="https://ko-fi.com/willcee127"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-400 hover:border-yellow-400 hover:text-yellow-400 transition-colors px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <span>💪 Support Learning</span>
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
            <div className="text-amber-400 font-bold text-lg mb-2" style={{color: '#f59e0b'}}>
              Start Your Learning Journey Today
            </div>
            &copy; 2026 Gideon Prep - Educational Success Platform
          </div>
        </div>
      </footer>
    </div>
  )
}

export default GideonLandingPageV2
