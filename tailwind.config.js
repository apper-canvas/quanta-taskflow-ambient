/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B47E0',
        'primary-hover': '#8B7FE8',
        accent: '#FFB74D',
        surface: '#FFFFFF',
        background: '#F7F9FC',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 0.4s ease-out',
        'fade-out': 'fade-out 0.4s ease-out 0.4s forwards',
        'scale-up': 'scale-up 0.2s ease-out'
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 20%, 53%, 80%, 100%': { transform: 'scale(1)' },
          '40%, 43%': { transform: 'scale(1.15)' },
          '70%': { transform: 'scale(1.08)' }
        },
        'fade-out': {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(-20px)' }
        },
        'scale-up': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}