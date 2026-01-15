import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../utils/supabaseClient'

const MissionDebrief = ({ isOpen, onClose, sectorName, onDebriefComplete }) => {
  const [frictionRating, setFrictionRating] = useState(3)
  const [warriorNotes, setWarriorNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const callSign = localStorage.getItem('gideon_call_sign') || 'anonymous'
      
      // Save to warrior_feedback table
      const { error } = await supabase
        .from('warrior_feedback')
        .insert({
          call_sign: callSign,
          sector_name: sectorName,
          friction_rating: frictionRating,
          warrior_notes: warriorNotes,
          created_at: new Date()
        })

      if (!error) {
        // Clear form
        setFrictionRating(3)
        setWarriorNotes('')
        
        // Notify parent component
        if (onDebriefComplete) {
          onDebriefComplete({ frictionRating, warriorNotes })
        }
        
        onClose()
      } else {
        console.error('Failed to submit debrief:', error)
      }
    } catch (error) {
      console.error('Debrief submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-yellow-500/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
          >
            <div className="text-center space-y-6">
              {/* Mission Complete Icon */}
              <div className="w-16 h-16 mx-auto bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                SECTOR CLEARED
              </h3>
              
              <p className="text-gray-300 text-sm">
                Mission Debrief: {sectorName}
              </p>

              {/* Friction Rating */}
              <div className="text-left">
                <label className="block text-yellow-400 font-semibold mb-3">
                  FRICTION RATING (1-5)
                </label>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400">Low</span>
                  <span className="text-xs text-gray-400">High</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFrictionRating(rating)}
                      className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                        frictionRating === rating
                          ? 'bg-yellow-500 text-black'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>

              {/* Warrior Notes */}
              <div className="text-left">
                <label className="block text-yellow-400 font-semibold mb-3">
                  WARRIOR NOTES
                </label>
                <textarea
                  value={warriorNotes}
                  onChange={(e) => setWarriorNotes(e.target.value)}
                  placeholder="Direct message to Commander: What was challenging? What helped you succeed?"
                  className="w-full h-24 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                  maxLength={500}
                />
                <div className="text-right mt-1">
                  <span className="text-xs text-gray-500">
                    {warriorNotes.length}/500
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
                  disabled={isSubmitting}
                >
                  Skip
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-bold transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Debrief'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MissionDebrief
