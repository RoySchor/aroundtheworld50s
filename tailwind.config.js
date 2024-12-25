/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cursive: ['"Dancing Script"', 'cursive'],
        scope: ['"Dosis Variable"', 'sans-serif'],
      },
      colors: {
        tan: '#ccbca5'
      }
    },
  },
  plugins: [],
}

