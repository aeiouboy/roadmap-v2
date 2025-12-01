/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors from the original roadmap
        'order': {
          light: '#e0f2fe',
          DEFAULT: '#0ea5e9',
          dark: '#0369a1',
        },
        'validation': {
          light: '#f0fdf4',
          DEFAULT: '#10b981',
          dark: '#047857',
        },
        'inventory': {
          light: '#fef3c7',
          DEFAULT: '#f59e0b',
          dark: '#d97706',
        },
        'payment': {
          light: '#ede9fe',
          DEFAULT: '#8b5cf6',
          dark: '#6d28d9',
        },
        'orchestration': {
          light: '#fce7f3',
          DEFAULT: '#ec4899',
          dark: '#be185d',
        },
        'notification': {
          light: '#dbeafe',
          DEFAULT: '#3b82f6',
          dark: '#1e40af',
        },
        'ui': {
          light: '#fee2e2',
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
        },
        'reporting': {
          light: '#e0e7ff',
          DEFAULT: '#6366f1',
          dark: '#4338ca',
        },
        'exceptional': {
          light: '#fef9c3',
          DEFAULT: '#eab308',
          dark: '#a16207',
        },
      },
    },
  },
  plugins: [],
}
