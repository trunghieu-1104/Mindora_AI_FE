/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   '#1E4E79', // Elegant deep navy blue (logo/mascot blue)
        secondary: '#C9A227', // Warm brass/gold (logo brain + bell accent)
        accent:    '#6FA3D0', // Soft sky-blue accent
        bg:        '#FAF6EC', // Warm ivory background (logo backdrop tone)
        'text-main': '#16233D', // Deep navy main text
        'text-sub':  '#6B7686', // Muted warm slate subtext
        warning:   '#F59E0B',
        danger:    '#DC2626',
        'primary-light':   '#D6E6F2', // Soft powder blue
        'primary-dark':    '#123152', // Darker navy blue
        'secondary-light': '#F0E2B0', // Soft pale gold
        'secondary-dark':  '#16283F', // Deep navy (dark surfaces)
        'soft-green':      '#D6E6F2', // Pastel blue (kept for compatibility)
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body:    ['Nunito', 'sans-serif'],
        ui:      ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2.5rem',
      },
      boxShadow: {
        soft:   '0 4px 24px rgba(27,58,92,0.14)',
        card:   '0 2px 12px rgba(27,58,92,0.09)',
        bubble: '0 2px 8px rgba(27,58,92,0.11)',
      },
      animation: {
        'fade-up':    'fadeUp 0.4s ease-out',
        'fade-in':    'fadeIn 0.3s ease-out',
        'scale-in':   'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'breathe':    'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.15)' },
        },
      },
    },
  },
  plugins: [],
}
