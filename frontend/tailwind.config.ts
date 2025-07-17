import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './pages/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        garden: {
          light: '#e3f2dc', // very light sage
          DEFAULT: '#5bb583', // sage green
          dark: '#286447', // dark sage
        },
        earth: {
          light: '#faf9f6', // warm white
          DEFAULT: '#b8a583', // warm beige
          dark: '#635847', // dark earth
        },
        sky: {
          light: '#e0f0ff', // very light blue
          DEFAULT: '#36a3ff', // sky blue
          dark: '#003666', // dark sky
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config 