import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

const Initiation = ({ onComplete }) => {
  const [step, setStep] = useState(1)
  const [fullName, setFullName] = useState('')
  const [callSign, setCallSign] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = () => {
    if (step === 1) setStep(2)
    else if (step === 2) setStep(3)
  }

  const handleIdentitySubmit = async () => {
    if (!fullName.trim() || !callSign.trim() || !email.trim()) return
    
    setIsLoading(true)
    
    try {
      // Save to Supabase profiles table
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          full_name: fullName.trim(),
          call_sign: callSign.trim(),
          email: email.trim(),
          ai_support_level: 3, // Default to Aura level
          current_streak: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) throw error
      
      // Store the profile ID for future tracking
      localStorage.setItem('gideon_user_id', data.id)
      localStorage.setItem('gideon_call_sign', callSign.trim())
      localStorage.setItem('gideon_full_name', fullName.trim())
      localStorage.setItem('gideon_email', email.trim())
      
      console.log('Identity saved to profiles table:', data)
      
      // Complete initiation with profile data
      onComplete({
        fullName: fullName.trim(),
        callSign: callSign.trim(),
        email: email.trim(),
        profileId: data.id
      })
      
    } catch (error) {
      console.error('Failed to save identity:', error)
      alert('Failed to save your identity. Please try again.')
    } finally {
      setIsLoading(false)
    }
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
        ) : step === 2 ? (
          <>
            <h2 className="text-4xl font-bold italic mb-4">IDENTITY RECOVERY</h2>
            <p className="text-gray-400 mb-8 text-lg">
              Let's secure your command identity for progress tracking.
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-purple-400 text-sm font-mono uppercase tracking-widest mb-2">
                  Full Name
                </label>
                <input 
                  autoFocus
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name..."
                  className="w-full bg-transparent border-b-2 border-purple-500 p-4 text-xl focus:outline-none placeholder:text-gray-700 font-mono"
                />
              </div>
              
              <div>
                <label className="block text-purple-400 text-sm font-mono uppercase tracking-widest mb-2">
                  Call Sign (Display Name)
                </label>
                <input 
                  value={callSign}
                  onChange={(e) => setCallSign(e.target.value)}
                  placeholder="Enter your call sign..."
                  className="w-full bg-transparent border-b-2 border-purple-500 p-4 text-xl focus:outline-none placeholder:text-gray-700 font-mono"
                />
              </div>
              
              <div>
                <label className="block text-purple-400 text-sm font-mono uppercase tracking-widest mb-2">
                  Email
                </label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full bg-transparent border-b-2 border-purple-500 p-4 text-xl focus:outline-none placeholder:text-gray-700 font-mono"
                />
              </div>
            </div>
            
            <button 
              onClick={handleNext}
              disabled={!fullName.trim() || !callSign.trim() || !email.trim()}
              className="px-12 py-4 bg-purple-600 text-white rounded-full font-bold tracking-widest hover:scale-110 transition-all disabled:opacity-30"
            >
              CONTINUE
            </button>
          </>
        ) : (
          <>
            <h2 className="text-4xl font-bold italic mb-4">CONFIRM IDENTITY</h2>
            <div className="bg-black/60 p-6 rounded-2xl border border-purple-500/30 space-y-4">
              <div className="text-left">
                <p className="text-purple-400 text-sm font-mono uppercase tracking-widest">Full Name</p>
                <p className="text-white text-xl font-mono">{fullName}</p>
              </div>
              <div className="text-left">
                <p className="text-purple-400 text-sm font-mono uppercase tracking-widest">Call Sign</p>
                <p className="text-white text-xl font-mono">{callSign}</p>
              </div>
              <div className="text-left">
                <p className="text-purple-400 text-sm font-mono uppercase tracking-widest">Email</p>
                <p className="text-white text-xl font-mono">{email}</p>
              </div>
            </div>
            
            <button 
              onClick={handleIdentitySubmit}
              disabled={isLoading}
              className="px-12 py-4 bg-white text-black rounded-full font-black tracking-widest hover:scale-110 transition-all disabled:opacity-30"
            >
              {isLoading ? 'SAVING...' : 'CONFIRM IDENTITY'}
            </button>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default Initiation