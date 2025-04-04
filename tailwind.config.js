/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        dancing: ['"Dancing Script"', 'cursive'],
        scope: ['"Dosis Variable"', 'sans-serif'],
        inter: ['"Inter Variable"', 'sans-serif'],
        caveat: ['"Caveat Variable"', 'cursive'],
        kalam: ['"Kalam"', 'cursive'],
        grandstander: ['"Grandstander Variable"', 'system-ui'],
        playpensands: ['"Playpen Sans Variable"', 'cursive'],
      },
      colors: {
        tan: '#ccbca5'
      }
    },
  },
  plugins: [],
}

