// Asset Preloading Utility
class AssetPreloader {
  constructor() {
    this.loadedAssets = new Set()
    this.loadingPromises = new Map()
  }

  // Preload SVG assets as data URLs
  async preloadSVGs() {
    const svgAssets = {
      verveShield: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L4 7V12C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 12V7L12 2Z" 
                stroke="#E6E6FA" strokeWidth="2" fill="none"/>
          <path d="M12 8L14 10L12 12L10 10L12 8Z" fill="#E6E6FA"/>
        </svg>
      `,
      auraBolt: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" 
                stroke="#7DF9FF" strokeWidth="2" fill="none"/>
          <circle cx="12" cy="12" r="2" fill="#7DF9FF" />
        </svg>
      `,
      forgeHammer: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3L7 7L3 11L7 15L3 19L7 23L11 19L15 23L19 19L23 23L19 19L23 15L19 11L23 7L19 3L15 7L11 3L7 7L3 3Z" 
                stroke="#FF8C00" strokeWidth="2" fill="none"/>
          <rect x="10" y="10" width="4" height="4" fill="#FF8C00" />
        </svg>
      `,
      forgeHammerSeal: `
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3L7 7L3 11L7 15L3 19L7 23L11 19L15 23L19 19L23 23L19 19L23 15L19 11L23 7L19 3L15 7L11 3L7 7L3 3Z" 
                stroke="#FF8C00" strokeWidth="1.5" fill="none" opacity="0.8"/>
          <rect x="10" y="10" width="4" height="4" fill="#FF8C00" opacity="0.6"/>
          <circle cx="12" cy="12" r="8" stroke="#FF8C00" strokeWidth="0.5" fill="none" opacity="0.4"/>
        </svg>
      `
    }

    const promises = Object.entries(svgAssets).map(async ([key, svgString]) => {
      if (this.loadedAssets.has(key)) return

      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      
      // Preload by creating an image
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          this.loadedAssets.add(key)
          URL.revokeObjectURL(url) // Clean up
          resolve(key)
        }
        img.onerror = reject
        img.src = url
      })
    })

    await Promise.all(promises)
    console.log('SVG assets preloaded:', Array.from(this.loadedAssets))
  }

  // Preload fonts with different weights
  async preloadFonts() {
    const fonts = [
      { family: 'Orbitron', weight: '400', style: 'normal' },
      { family: 'Orbitron', weight: '700', style: 'normal' },
      { family: 'Orbitron', weight: '900', style: 'normal' },
      { family: 'Inter', weight: '400', style: 'normal' },
      { family: 'Inter', weight: '600', style: 'normal' }
    ]

    const fontPromises = fonts.map(font => {
      const key = `${font.family}-${font.weight}-${font.style}`
      if (this.loadedAssets.has(key)) return Promise.resolve(key)

      return new Promise((resolve, reject) => {
        const fontFace = new FontFace(
          font.family,
          `url(https://fonts.gstatic.com/s/${font.family.toLowerCase()}/v${this.getRandomVersion()}.woff2) format('woff2')`,
          { weight: font.weight, style: font.style }
        )

        fontFace.load()
          .then(() => {
            document.fonts.add(fontFace)
            this.loadedAssets.add(key)
            resolve(key)
          })
          .catch(reject)
      })
    })

    await Promise.all(fontPromises)
    console.log('Fonts preloaded:', Array.from(this.loadedAssets).filter(f => f.includes('Orbitron') || f.includes('Inter')))
  }

  // Get random font version for cache busting
  getRandomVersion() {
    return Math.floor(Math.random() * 20) + 1
  }

  // Initialize all preloading
  async initialize() {
    try {
      await Promise.all([
        this.preloadSVGs(),
        this.preloadFonts()
      ])
      console.log('Asset preloading completed successfully')
    } catch (error) {
      console.error('Asset preloading failed:', error)
    }
  }

  // Check if asset is loaded
  isLoaded(assetKey) {
    return this.loadedAssets.has(assetKey)
  }

  // Get loading status
  getLoadingStatus() {
    return {
      totalAssets: this.loadedAssets.size,
      loadedAssets: Array.from(this.loadedAssets)
    }
  }
}

// Create singleton instance
const assetPreloader = new AssetPreloader()

export default assetPreloader
