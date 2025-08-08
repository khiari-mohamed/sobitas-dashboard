/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Include everything in app router
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#22A6B3',
        sidebar: '#2a3042',
        background: '#f5f6fa',
        textMuted: '#6c757d',
      },
    },
  },
  plugins: [],
}
