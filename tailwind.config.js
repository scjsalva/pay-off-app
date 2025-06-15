/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f59e0b', // amber-500
          hover: '#d97706',   // amber-600
          light: '#fbbf24',   // amber-400
          dark: '#b45309'     // amber-700
        }
      }
    },
  },
  plugins: [],
} 
