/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif"', 'Georgia', 'serif'],
        sans:  ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono:  ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      colors: {
        // RGB-channel variables allow opacity modifiers like /[0.06] to work correctly.
        ink: {
          50:  'rgb(var(--ink-50-rgb)  / <alpha-value>)',
          100: 'rgb(var(--ink-100-rgb) / <alpha-value>)',
          200: 'rgb(var(--ink-200-rgb) / <alpha-value>)',
          400: 'rgb(var(--ink-400-rgb) / <alpha-value>)',
          500: 'rgb(var(--ink-400-rgb) / <alpha-value>)',
          600: 'rgb(var(--ink-600-rgb) / <alpha-value>)',
          800: 'rgb(var(--ink-800-rgb) / <alpha-value>)',
          900: 'rgb(var(--ink-900-rgb) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent-rgb)   / <alpha-value>)',
          light:   'rgb(var(--accent-l-rgb) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};
