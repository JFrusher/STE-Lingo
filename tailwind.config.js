/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#22c55e', dark: '#16a34a' },
        danger: { DEFAULT: '#ef4444', dark: '#dc2626' },
        accent: { DEFAULT: '#3b82f6', dark: '#2563eb' },
        warning: { DEFAULT: '#f59e0b', dark: '#d97706' },
      },
      borderRadius: {
        card: '1rem',
      },
      boxShadow: {
        // Duolingo-style solid "ledge" under buttons and cards
        btn: '0 4px 0 0 rgb(0 0 0 / 0.2)',
        'btn-pressed': '0 1px 0 0 rgb(0 0 0 / 0.2)',
        card: '0 2px 0 0 #e5e7eb',
      },
    },
  },
  plugins: [],
}
