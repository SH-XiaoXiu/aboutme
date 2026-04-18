/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif"', 'Georgia', 'serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f8f6f1',
          100: '#efeae0',
          200: '#ddd5c5',
          400: '#8a8478',
          600: '#4a463f',
          800: '#222018',
          900: '#14130e',
        },
        accent: {
          DEFAULT: '#7d6540',
          light: '#a08160',
        },
      },
    },
  },
  plugins: [],
};
