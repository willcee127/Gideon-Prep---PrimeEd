import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fetchIntelMapping } from '../services/syncService'
import TacticalExtraction from './TacticalExtraction'

const MissionTarmac = ({ problemId, onExtractionComplete, callSign }) => {
  const [showExtraction, setShowExtraction] = useState(false)
  const [intelMapping, setIntelMapping] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch intel mapping when problem changes
  useEffect(() => {
    const fetchMapping = async () => {
      if (!problemId) {
        setIntelMapping(null)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const { data, error } = await fetchIntelMapping(problemId)
        
        if (error) {
          console.error('Intel mapping fetch error:', error)
          setError('Failed to load intel mapping')
          // Set default mapping for fallback
          setIntelMapping({
            video_id: 'default',
            recovery_concept_id: 'addition'
          })
        } else if (data) {
          setIntelMapping(data)
        } else {
          // No mapping found, set default
          console.log('No intel mapping found for problem:', problemId)
          setIntelMapping({
            video_id: 'default',
            recovery_concept_id: 'addition'
          })
        }
      } catch (error) {
        console.error('Intel mapping error:', error)
        setError('Error loading intel')
        setIntelMapping({
          video_id: 'default',
          recovery_concept_id: 'addition'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMapping()
  }, [problemId])

  const handleExtractionStart = () => {
    setShowExtraction(true)
  }

  const handleExtractionComplete = () => {
    setShowExtraction(false)
    onExtractionComplete?.()
  }

  return (
    <div className="mission-tarmac">
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-4">
          <div className="text-red-400 text-sm">
            {error}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-400">Loading intel...</div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-black/50 rounded-lg p-4 border border-lavender-500/20">
            <div className="text-lavender-400 text-sm mb-2">
              Current Problem: {problemId || 'None selected'}
            </div>
            {intelMapping && (
              <div className="text-gray-300 text-xs">
                Recovery Concept: {intelMapping.recovery_concept_id || 'addition'}
              </div>
            )}
          </div>

          <button
            onClick={handleExtractionStart}
            disabled={!intelMapping || showExtraction}
            className="px-6 py-3 bg-lavender-600 hover:bg-lavender-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg text-white font-bold transition-all"
          >
            {showExtraction ? 'Extraction in Progress...' : 'Start Tactical Extraction'}
          </button>

          {showExtraction && intelMapping && (
            <TacticalExtraction
              conceptId={intelMapping.recovery_concept_id || 'addition'}
              onReady={handleExtractionComplete}
              isVisible={showExtraction}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default MissionTarmac
