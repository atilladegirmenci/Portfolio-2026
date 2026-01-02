/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          base: "#121212",      // Ana Arka Plan: Spotify Koyu Grisi
          card: "#181818",      // Kartlar: Bir tık daha açık gri (derinlik için)
          secondary: "#282828", // İkincil/Hover renkleri
          muted: "#b3b3b3",     // Silik yazılar
          accent: "#7e22ce",    // Vurgu: Daha koyu, tok bir mor
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'scroll-left': 'scroll-left 40s linear infinite',
        'scroll-right': 'scroll-right 40s linear infinite',
      },
      keyframes: {
        'scroll-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'scroll-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}