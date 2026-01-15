import React, { useState } from 'react'
import { motion } from 'framer-motion'

const Initiation = ({ onComplete }) => {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')

  const handleNext = () => {
    if (step === 1) setStep(2)
    else if (name.trim()) onComplete(name) // This triggers the move to the Map
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full text-center space-y-8"
      >
        {step === 1 ? (
          <>
            <h1 className="text-6xl font-black italic tracking-tighter" style={{ fontFamily: 'Oswald, sans-serif' }}>
              WELCOME TO YOUR <span className="text-purple-500 underline decoration-4">COMMAND LEVEL</span>
            </h1>
            
            {/* Mission Statement */}
            <div className="mb-8 space-y-4 bg-black/60 p-6 rounded-2xl border border-purple-500/30">
              <p className="text-gray-200 text-lg leading-relaxed" style={{ fontFamily: 'Playfair Display, serif' }}>
                This is your space to reclaim what was lost through reps. 
                Every problem solved is a scar healed, every mistake a recalibration.
              </p>
              
              {/* The Seal of Reps */}
              <div className="mt-8 p-6 border border-purple-400/50 rounded-xl bg-purple-900/20">
                <h3 className="text-purple-300 text-xl font-bold mb-4 text-center" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  THE SEAL OF REPS
                </h3>
                <div className="space-y-3 text-gray-300 text-sm" style={{ fontFamily: 'Playfair Display, serif' }}>
                  <p className="italic">
                    I am one who showed up.
                  </p>
                  <p className="italic">
                    I am not the score I once got, or the chair I once walked away from. I am the effort I am putting in right now.
                  </p>
                  <p className="italic">
                    Every problem is a rep. Every mistake is a recalibration. I am rewiring my mind to see patterns where I once saw walls.
                  </p>
                  <p className="italic">
                    The math is just the language of my victory. The calculator is just the tool of my intent.
                  </p>
                  <p className="italic">
                    I have stayed when I wanted to leave. I have focused when I wanted to fade. I am an Overcomer, not because it was easy, but because I am still here.
                  </p>
                  <p className="italic font-bold text-purple-300 mt-4">
                    The territory is mine because I earned it, one rep at a time.
                  </p>
                </div>
              </div>
              
              {/* Three Steps */}
              <div className="space-y-3 mt-6">
                <div className="text-left bg-purple-900/30 p-3 rounded-lg border-l-4 border-purple-400">
                  <p className="text-purple-300 font-mono text-sm uppercase tracking-widest font-bold">LISTEN (Verve)</p>
                  <p className="text-gray-300 text-sm mt-1">Work at your own pace. The app adapts to your energy.</p>
                </div>
                
                <div className="text-left bg-blue-900/30 p-3 rounded-lg border-l-4 border-blue-400">
                  <p className="text-blue-300 font-mono text-sm uppercase tracking-widest font-bold">LEARN (Aura)</p>
                  <p className="text-gray-300 text-sm mt-1">Turn every challenge into a lesson. No pressure, just progress.</p>
                </div>
                
                <div className="text-left bg-yellow-900/30 p-3 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-yellow-300 font-mono text-sm uppercase tracking-widest font-bold">LEAD (Forge)</p>
                  <p className="text-gray-300 text-sm mt-1">You are the architect of your success. Map your way to reclaim territory.</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleNext}
              className="px-12 py-4 bg-purple-600 rounded-full font-bold text-lg hover:bg-purple-400 hover:scale-105 transition-all shadow-[0_0_30px_rgba(168,85,247,0.5)]"
            >
              BEGIN MY GROWTH
            </button>
          </>
        ) : (
          <>
            <h2 className="text-4xl font-bold italic mb-4">HOW SHOULD WE CELEBRATE YOUR WINS?</h2>
            <p className="text-gray-400 mb-8 text-lg">
              Enter the name you want to see on your Mastery Map.
            </p>
            <input 
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ENTER YOUR NAME..."
              className="w-full bg-transparent border-b-2 border-purple-500 p-4 text-3xl text-center focus:outline-none placeholder:text-gray-700 font-mono"
            />
            <button 
              onClick={handleNext}
              disabled={!name.trim()}
              className="px-12 py-4 bg-white text-black rounded-full font-black tracking-widest hover:scale-110 transition-all disabled:opacity-30"
            >
              START MY JOURNEY
            </button>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default Initiation