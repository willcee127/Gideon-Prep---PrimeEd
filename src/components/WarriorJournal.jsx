import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNeuro } from '../context/NeuroProvider'
import { supabase } from '../supabase'

const WarriorJournal = () => {
  const { 
    triggerIdentityStrike,
    isInVerveMode,
    isInAuraMode,
    isInForgeMode,
    showIdentityMirror,
    identityMirrorMessage
  } = useNeuro()

  const [isJournalOpen, setIsJournalOpen] = useState(false)
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const journalRef = useRef(null)

  // Load journal entries from Supabase
  useEffect(() => {
    const loadJournalEntries = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from('warrior_journal')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('Error loading journal:', error)
          return
        }

        setEntries(data || [])
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading journal:', error)
        setIsLoading(false)
      }
    }

    loadJournalEntries()
  }, [])

  // Auto-save entries when they change
  const saveJournalEntry = async (type, content) => {
    try {
      const { error } = await supabase
        .from('warrior_journal')
        .insert({
          type,
          content,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error saving journal entry:', error)
      } else {
        const { data } = await supabase
          .from('warrior_journal')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (data) {
          setEntries(data)
        }
      }
    } catch (error) {
      console.error('Error saving journal entry:', error)
    }
  }

  // Get warrior title based on progress
  const getWarriorTitle = () => {
    const totalEntries = entries.length
    if (totalEntries >= 50) return 'Legendary Warrior'
    if (totalEntries >= 30) return 'Elite Warrior'
    if (totalEntries >= 20) return 'Advanced Warrior'
    if (totalEntries >= 10) return 'Skilled Warrior'
    if (totalEntries >= 5) return 'Rising Warrior'
    return 'Novice Warrior'
  }

  // Check for Guardian of Logic title (Node 10 completion)
  const checkGuardianTitle = () => {
    const hasNode10Entry = entries.some(entry => 
      entry.content.includes('Complex Problem Solving') || 
      entry.content.includes('Guardian of Logic')
    )
    if (hasNode10Entry) {
      return 'Maria, Guardian of Logic'
    }
    return `Maria, ${getWarriorTitle()}` 
  }

  // Check if title should have gold glow
  const shouldGlow = () => {
    return entries.some(entry => 
      entry.content.includes('Complex Problem Solving') || 
      entry.content.includes('Guardian of Logic')
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <>
      {/* Journal Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsJournalOpen(!isJournalOpen)}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${
          isInVerveMode ? 'bg-linen-100 text-gray-800' :
          isInAuraMode ? 'bg-blue-900 text-blue-100' :
          isInForgeMode ? 'bg-yellow-600 text-yellow-100' :
          'bg-gray-800 text-gray-100'
        }`}
        style={{
          border: `2px solid ${
            isInVerveMode ? '#D4AF37' :
            isInAuraMode ? '#00008B' :
            isInForgeMode ? '#D4AF37' :
            '#4B5563'
          }`,
          backdropFilter: 'blur(8px)'
        }}
      >
        <div className="flex items-center space-x-2">
          <span className="text-2xl">📜</span>
          <span className="text-sm font-semibold">Journal</span>
        </div>
      </motion.button>

      {/* Journal Panel */}
      <AnimatePresence>
        {isJournalOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-0 right-0 h-full w-80 max-w-md bg-linen-50 backdrop-blur-xl border-l-2 border-l-linen-100 shadow-2xl z-40 overflow-hidden"
            style={{ fontFamily: 'Georgia, serif' }}
            ref={journalRef}
          >
            {/* Header */}
            <div className="bg-linen-100 border-b border-linen-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <span className="mr-2">⚔️</span>
                  Warrior Journal
                </h2>
                <button
                  onClick={() => setIsJournalOpen(false)}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  ✕
                </button>
              </div>
              
              <div className="text-center mt-4 mb-2">
                <div className={`text-xl font-serif text-gray-800 mb-1 ${shouldGlow() ? 'prime-ed-glow' : ''}`}>
                  {checkGuardianTitle()}
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-widest">
                  The Ledger of Valor
                </div>
              </div>

              {showIdentityMirror && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-yellow-50 border border-yellow-600 p-4 mt-4 text-center"
                >
                  <div className="text-lg font-bold text-yellow-800">
                    ⚔️ Identity Mirror
                  </div>
                  <div className="text-gray-800 text-sm italic">
                    {identityMirrorMessage}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Journal Entries List */}
            <div className="h-[calc(100vh-250px)] overflow-y-auto space-y-4 p-4">
              {isLoading ? (
                <div className="text-center text-gray-600 pt-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-yellow-600 mx-auto mb-4"></div>
                  Loading your journey...
                </div>
              ) : entries.length === 0 ? (
                <div className="text-center text-gray-600 pt-10">
                  <div className="text-6xl mb-4">📜</div>
                  <div className="text-lg">Your journal is empty</div>
                  <div className="text-sm text-gray-500">Begin your journey to record your valor.</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-linen-200 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">
                            {entry.type === 'victory' ? '🏆' : entry.type === 'valor' ? '⚔️' : '🎯'}
                          </span>
                          <span className="text-xs font-bold uppercase text-gray-400">
                            {entry.type}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400">
                          {formatDate(entry.created_at)}
                        </span>
                      </div>
                      <div className="text-gray-800 text-sm leading-relaxed">
                        {entry.content}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default WarriorJournal
