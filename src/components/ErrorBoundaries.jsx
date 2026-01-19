import React from 'react'

class StatusReportErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('StatusReport Error Boundary caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })
    
    // Log error to monitoring service (in production)
    if (import.meta.env.MODE === 'production') {
      // TODO: Send to error monitoring service
      console.warn('Error logged to monitoring service')
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI - minimal status display
      return (
        <div className="fixed top-4 right-4 z-40">
          <div className="bg-black/80 backdrop-blur-sm border border-red-500/50 rounded-lg p-3 text-white text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Status Report Offline</span>
            </div>
            <div className="mt-1 text-gray-400">
              {this.props.callSign || 'WARRIOR'} • Level {this.props.aiSupportLevel || '?'}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

class CapstoneCertificateErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('CapstoneCertificate Error Boundary caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })
    
    // Log error to monitoring service (in production)
    if (import.meta.env.MODE === 'production') {
      // TODO: Send to error monitoring service
      console.warn('Certificate error logged to monitoring service')
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI - simple certificate notification
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-orange-400 rounded-lg p-6 max-w-md mx-4">
            <div className="text-center space-y-4">
              <div className="text-4xl">🏆</div>
              <h3 className="text-xl font-bold text-orange-800" style={{ fontFamily: 'Orbitron, monospace' }}>
                Certificate Available
              </h3>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                Congratulations on achieving GED Ready status! Your certificate is ready but encountered a display issue.
              </p>
              <button
                onClick={this.props.onClose}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Generic Error Boundary for other components
class GenericErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Generic Error Boundary caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed top-4 left-4 z-50">
          <div className="bg-red-900/90 backdrop-blur-sm border border-red-500 rounded-lg p-3 text-white text-xs max-w-xs">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>System Error</span>
            </div>
            <div className="mt-1 text-red-200">
              {this.props.fallbackMessage || 'An unexpected error occurred'}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export { StatusReportErrorBoundary, CapstoneCertificateErrorBoundary, GenericErrorBoundary }
