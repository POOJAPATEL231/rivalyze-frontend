/** Rivalyze tokens — from the v9_2 design law. Do not invent colors. */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#090B14', bg2: '#0C0F1C', panel: '#11152A', panel2: '#161B36', panel3: '#1C2247',
        ink: '#EBEDF7', inkDim: '#9AA3C2', inkFaint: '#5E6890',
        teal: '#24CDB6', violet: '#8E7CF7', gold: '#F2C572', rose: '#F4789C',
        line: 'rgba(166,178,224,.14)'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      borderRadius: { card: '14px', el: '10px' }
    }
  },
  plugins: []
}
