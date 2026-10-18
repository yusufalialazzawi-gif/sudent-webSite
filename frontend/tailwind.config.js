/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          navy: {
            50: '#f0f4f9',
            100: '#dde6f2',
            200: '#c1d2e7',
            300: '#97b6d7',
            400: '#6794c4',
            500: '#4676b0',
            600: '#345e94',
            700: '#2c4b78',
            800: '#1b2f4f',
            900: '#0f1d33',
            950: '#0a1322',
          },
          amber: {
            50: '#fff8f1',
            100: '#feeedb',
            200: '#fcd9b5',
            300: '#fabd83',
            400: '#f6964a',
            500: '#f37721', // Sora reference accent
            600: '#e45d15',
            700: '#bd4513',
            800: '#963717',
            900: '#7a2f16',
          },
          gold: {
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
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
        premium: '0 10px 30px -5px rgba(15, 29, 51, 0.08), 0 4px 6px -2px rgba(15, 29, 51, 0.04)',
        glow: '0 0 25px rgba(243, 119, 33, 0.25)',
      },
    },
  },
  plugins: [],
};
