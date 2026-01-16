import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { Activity, Target, Zap, RefreshCw, AlertTriangle } from 'lucide-react'

const TacticalAnalyticsDashboard = () => {
  const [frictionData, setFrictionData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSector, setSelectedSector] = useState(null)

  // Fetch global friction analytics data
  const fetchFrictionData = async () => {
    try {
      const { data, error } = await supabase
        .from('global_friction_analytics')
        .select('*')
        .order('avg_friction_level', { ascending: false })

      if (error) {
        console.error('Error fetching friction data:', error)
        setLoading(false)
        return
      }

      setFrictionData(data || [])
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch friction data:', err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFrictionData()
  }, [])

  const handleSectorClick = (sector) => {
    setSelectedSector(sector)
  }

  const getResolutionRate = (resolved, total) => {
    if (total === 0) return 0
    return Math.round((resolved / total) * 100)
  }

  const getFrictionColor = (level) => {
    if (level >= 5) return 'border-orange-400 shadow-orange-400/50 animate-pulse'
    if (level >= 3) return 'border-yellow-400 shadow-yellow-400/30'
    return 'border-green-400'
  }

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 p-6">
      {/* Header */}
      <div className="mb-8 border border-green-400/30 rounded-lg p-4 bg-black/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-orange-400" />
            <h1 className="text-2xl font-bold text-orange-400 font-mono">
              GLOBAL FRICTION MONITOR
            </h1>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 text-sm font-mono">LIVE</span>
            </div>
          </div>
          
          <button
            onClick={fetchFrictionData}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black rounded-lg font-semibold transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="font-mono">REFRESH</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-orange-400 font-mono">SCANNING SECTORS...</div>
        </div>
      )}

      {/* Sector Cards Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {frictionData.map((sector, index) => (
            <div
              key={sector.concept_id}
              onClick={() => handleSectorClick(sector)}
              className={`
                relative border rounded-lg p-4 bg-black/50 cursor-pointer transition-all duration-200 hover:bg-black/70
                ${getFrictionColor(sector.avg_friction_level)}
                ${selectedSector?.concept_id === sector.concept_id ? 'ring-2 ring-orange-400' : ''}
              `}
            >
              {/* High Friction Alert */}
              {sector.avg_friction_level > 4 && (
                <div className="absolute -top-2 -right-2">
                  <AlertTriangle className="w-6 h-6 text-orange-400 animate-pulse" />
                </div>
              )}

              {/* Sector Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-bold text-orange-400 font-mono">
                    SECTOR: {sector.concept_id.toUpperCase()}
                  </h3>
                </div>
                <div className="text-xs text-gray-400 font-mono">
                  ID: {sector.concept_id}
                </div>
              </div>

              {/* Friction Gauge */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-400 font-mono">FRICTION LEVEL</span>
                  <span className={`font-mono font-bold ${
                    sector.avg_friction_level >= 5 ? 'text-red-400' : 
                    sector.avg_friction_level >= 3 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {sector.avg_friction_level.toFixed(1)}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`
                      h-full transition-all duration-300
                      ${sector.avg_friction_level >= 5 ? 'bg-red-500' : 
                       sector.avg_friction_level >= 3 ? 'bg-yellow-500' : 'bg-green-500'}
                    `}
                    style={{ width: `${Math.min((sector.avg_friction_level / 10) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Resolution Metrics */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 font-mono">RESOLUTION RATE</span>
                  <span className="text-green-400 font-mono font-bold">
                    {getResolutionRate(sector.resolved_count, sector.total_interventions)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${getResolutionRate(sector.resolved_count, sector.total_interventions)}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-black/50 rounded p-2 border border-green-400/30">
                  <div className="text-gray-400 font-mono">RESOLVED</div>
                  <div className="text-green-400 font-bold font-mono">{sector.resolved_count}</div>
                </div>
                <div className="bg-black/50 rounded p-2 border border-green-400/30">
                  <div className="text-gray-400 font-mono">INTERVENTIONS</div>
                  <div className="text-orange-400 font-bold font-mono">{sector.total_interventions}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sector Detail Modal */}
      {selectedSector && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6">
          <div className="bg-gray-800 border border-orange-400 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-orange-400 font-mono flex items-center space-x-2">
                <Target className="w-6 h-6" />
                SECTOR ANALYSIS: {selectedSector.concept_id}
              </h2>
              <button
                onClick={() => setSelectedSector(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Most Effective Socratic Questions */}
              <div className="bg-black/50 rounded-lg p-4 border border-orange-400/30">
                <h3 className="text-lg font-bold text-orange-400 mb-3 font-mono flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  MOST EFFECTIVE SOCRATIC QUESTIONS
                </h3>
                <div className="space-y-2">
                  {selectedSector.effective_questions?.map((question, index) => (
                    <div key={index} className="bg-gray-900/50 rounded p-3 border border-green-400/20">
                      <div className="text-sm text-gray-300 mb-1">
                        Question {index + 1}
                      </div>
                      <div className="text-green-400 font-mono">
                        "{question}"
                      </div>
                    </div>
                  )) || (
                    <div className="text-gray-400 text-sm font-mono">
                      No effective questions recorded yet...
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/50 rounded-lg p-4 border border-green-400/30">
                  <h4 className="text-orange-400 font-bold mb-2 font-mono">PERFORMANCE METRICS</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Avg Friction:</span>
                      <span className="text-orange-400 font-mono">{selectedSector.avg_friction_level.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Peak Friction:</span>
                      <span className="text-red-400 font-mono">{selectedSector.peak_friction_level || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Warriors:</span>
                      <span className="text-green-400 font-mono">{selectedSector.total_warriors || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/50 rounded-lg p-4 border border-green-400/30">
                  <h4 className="text-orange-400 font-bold mb-2 font-mono">INTERVENTION STATS</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Success Rate:</span>
                      <span className="text-green-400 font-mono">
                        {getResolutionRate(selectedSector.resolved_count, selectedSector.total_interventions)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Avg Response:</span>
                      <span className="text-yellow-400 font-mono">{selectedSector.avg_response_time || 'N/A'}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Updated:</span>
                      <span className="text-blue-400 font-mono">
                        {new Date(selectedSector.last_updated).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TacticalAnalyticsDashboard
