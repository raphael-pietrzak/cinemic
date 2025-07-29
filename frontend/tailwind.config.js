/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out'
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.perspective-1000': {
          'perspective': '1000px'
        },
        '.transform-style-preserve-3d': {
          'transform-style': 'preserve-3d'
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden'
        },
        '.rotate-y-180': {
          'transform': 'rotateY(180deg)'
        }
      })
    }
  ],
}

