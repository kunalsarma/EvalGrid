/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'oklch(1 0 0)',
        primary: 'oklch(0.205 0 0)',
        secondary: 'oklch(0.97 0 0)',
        accent: 'oklch(0.97 0 0)',
      }
    },
  },
  plugins: [],
}
