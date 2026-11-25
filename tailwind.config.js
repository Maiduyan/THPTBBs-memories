/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        school: {
          50: '#eef4ff',
          100: '#dbe6ff',
          200: '#bed2ff',
          300: '#91b4ff',
          400: '#5d8bfc',
          500: '#3763f4',
          600: '#2144e0',
          700: '#1c35b5',
          800: '#1a2f8f',
          900: '#0f2059',
          950: '#091536',
        },
        gold: {
          50: '#fff9e6',
          100: '#fef0c3',
          200: '#fddf85',
          300: '#fbc847',
          400: '#f9b01f',
          500: '#e8930b',
          600: '#c76d06',
          700: '#a54c09',
          800: '#863b0f',
          900: '#713112',
        },
        paper: {
          50: '#fffdf8',
          100: '#fbf7ee',
          200: '#f5ecda',
          300: '#ecdcbd',
          400: '#dfc79a',
        },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
        display: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      boxShadow: {
        float: '0 18px 45px -18px rgba(9, 21, 54, 0.55)',
        pop: '0 10px 30px -8px rgba(9, 21, 54, 0.45)',
        inset: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.65)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.94) translateY(14px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'float-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'glow-ring': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(251, 200, 71, 0.55)' },
          '50%': { boxShadow: '0 0 0 10px rgba(251, 200, 71, 0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out both',
        'slide-up': 'slide-up 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pop-in': 'pop-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) both',
        'float-soft': 'float-soft 3s ease-in-out infinite',
        'glow-ring': 'glow-ring 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
