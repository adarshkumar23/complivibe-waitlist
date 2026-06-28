import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#5B5FE3',
          teal: '#6EE7B7',
        },
        ink: {
          DEFAULT: '#0F0F1A',
          secondary: '#6B7280',
        },
        risk: {
          high: '#EF4444',
          medium: '#F59E0B',
          low: '#10B981',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        hero: ['72px', { lineHeight: '1.05', letterSpacing: '-2px' }],
        section: ['48px', { lineHeight: '1.1', letterSpacing: '-1px' }],
      },
      letterSpacing: {
        eyebrow: '3px',
      },
      borderRadius: {
        glass: '24px',
      },
      backdropBlur: {
        glass: '20px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(91, 95, 227, 0.08), inset 0 1px 0 rgba(255,255,255,0.5)',
        cta: '0 4px 24px rgba(91,95,227,0.35)',
        ctaHover: '0 8px 32px rgba(91,95,227,0.5)',
      },
      keyframes: {
        meshShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-8px)' },
          '40%, 80%': { transform: 'translateX(8px)' },
        },
        pulseRisk: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0.5)' },
          '50%': { boxShadow: '0 0 0 16px rgba(239,68,68,0)' },
        },
      },
      animation: {
        mesh: 'meshShift 18s ease infinite',
        floaty: 'floaty 6s ease-in-out infinite',
        shake: 'shake 0.4s ease-in-out',
        pulseRisk: 'pulseRisk 1.6s ease-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
