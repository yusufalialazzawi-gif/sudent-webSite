/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          // Al-Majd Royal Navy & Sapphire Blue (from logo calligraphy & cap)
          navy: {
            50: '#f0f4fa',
            100: '#e0e9f6',
            200: '#c5d5ee',
            300: '#9bb9e2',
            400: '#6995d2',
            500: '#4374c0',
            600: '#2b58a7',
            700: '#214486',
            800: '#1a367c', // Exact Al-Majd Primary Royal Blue
            900: '#112352',
            950: '#0a1533',
          },
          // Al-Majd Majestic Metallic Gold (from logo wings & circular crest)
          amber: {
            50: '#fdfbf5',
            100: '#faf5e6',
            200: '#f5e8c3',
            300: '#eed697',
            400: '#e5c06a',
            500: '#c89d3c', // Exact Al-Majd Metallic Gold
            600: '#b6892e',
            700: '#966d24',
            800: '#7a5621',
            900: '#64461e',
            950: '#38250c',
          },
          gold: {
            50: '#fdfbf5',
            100: '#faf5e6',
            200: '#f5e8c3',
            300: '#eed697',
            400: '#e5c06a',
            500: '#c89d3c', // Exact Al-Majd Metallic Gold
            600: '#b6892e',
            700: '#966d24',
            800: '#7a5621',
            900: '#64461e',
          },
          teal: {
            500: '#0d9488',
            600: '#0f766e',
          },
        },
      },
      fontFamily: {
        sans: ['Cairo', 'Inter', 'system-ui', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 10px 30px -5px rgba(26, 54, 124, 0.08), 0 4px 6px -2px rgba(26, 54, 124, 0.04)',
        glow: '0 0 25px rgba(200, 157, 60, 0.35)',
        'glow-gold': '0 0 25px rgba(200, 157, 60, 0.4)',
      },
    },
  },
  plugins: [],
};
