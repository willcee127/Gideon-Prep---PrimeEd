/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'spectral-lavender': '#9333ea',
        'spectral-lavender-light': '#a855f7',
        'spectral-lavender-dark': '#7c3aed',
        'linen': {
          '50': '#faf8f3',
          '100': '#f5f0e1',
          '200': '#e8dcc0',
          '300': '#d4c4a0',
          '400': '#c0b080',
          '500': '#ac9c60',
          '600': '#998840',
          '700': '#866620',
          '800': '#734400',
          '900': '#602200',
        },
      },
      backdropBlur: {
        '30': '30px',
      },
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
          '50%': { opacity: 0.6, transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}
