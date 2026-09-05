/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        surface: {
          DEFAULT: '#FFFFFF',
          card: '#FFFFFF',
          hover: '#F1F5F9',
          border: '#E2E8F0',
          muted: '#F8FAFC'
        },
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#4F46E5',
          600: '#4338CA',
          700: '#3730A3',
          accent: '#0284C7'
        },
        severity: {
          significant: '#DC2626',
          significantGlow: 'rgba(220, 38, 38, 0.08)',
          watch: '#D97706',
          watchGlow: 'rgba(217, 119, 6, 0.08)',
          normal: '#059669',
          normalGlow: 'rgba(5, 150, 105, 0.08)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
