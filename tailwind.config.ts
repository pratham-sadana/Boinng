import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        boinng: {
          bg: '#FFFEFA',
          black: '#000000',
          yellow: '#FCB116',
          blue: '#1354e5',
          pink: '#D70F59',
          purple: '#8B1DFF',
          red: '#ff2e2e',
          green: '#95DB1B',
          orange: '#F98608',
        }
      },
      fontFamily: {
        display: ['Roketto', 'sans-serif'],
        body: ['Gilroy', 'sans-serif'],
      },
      boxShadow: {
        solid: '4px 4px 0 #000000',
        'solid-yellow': '4px 4px 0 #FCB116',
        'solid-blue': '4px 4px 0 #1354e5',
        'solid-pink': '4px 4px 0 #D70F59',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      }
    },
  },
  plugins: [],
}
export default config
