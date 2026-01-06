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
          black: '#000000',
          dark: '#0a0a0a',
          gray: '#1a1a1a',
          'gray-light': '#2a2a2a',
          red: '#ff1744',
          'red-dark': '#dc143c',
          'red-darker': '#b01030',
          'red-light': '#ff4569',
          'red-glow': 'rgba(255, 23, 68, 0.6)',
          green: '#00ff41',
          'green-dark': '#00cc33',
        },
        primary: {
          50: '#ffe5ea',
          100: '#ffb3c1',
          200: '#ff8098',
          300: '#ff4d6f',
          400: '#ff1a46',
          500: '#dc143c',
          600: '#b01030',
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

