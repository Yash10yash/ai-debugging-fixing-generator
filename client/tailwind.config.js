/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#ffffff',
          dark: '#f5f5f5',
          gray: '#e8e8e8',
          'gray-light': '#f0f0f0',
          red: '#22c55e',
          'red-dark': '#16a34a',
          'red-darker': '#15803d',
          'red-light': '#4ade80',
          'red-glow': 'rgba(34, 197, 94, 0.6)',
          green: '#22c55e',
          'green-dark': '#16a34a',
        },
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#840c24',
          800: '#580818',
          900: '#2c040c',
        },
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
        'red-gradient': 'linear-gradient(135deg, #ff1744 0%, #dc143c 50%, #b01030 100%)',
        'red-glow': 'radial-gradient(circle, rgba(255, 23, 68, 0.4) 0%, transparent 70%)',
        'green-glow': 'radial-gradient(circle, rgba(0, 255, 65, 0.2) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
}

