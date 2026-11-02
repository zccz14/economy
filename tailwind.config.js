/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#080d17',
        panel: '#0f1726',
        panel2: '#131d2f',
        line: '#1e2a40',
        ink: '#e8eefc',
        sub: '#94a6c7',
        dim: '#63748f',
        accent: '#3b82f6',
        tech: '#2f6fdb',
        demand: '#c8822b',
        mat: '#35946e',
        util: '#7a5cc4',
        cons: '#c4527f',
        ind: '#4a8fa8',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
