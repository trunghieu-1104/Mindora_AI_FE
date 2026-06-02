/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   '#C9A227',
        secondary: '#1B3A5C',
        accent:    '#E8B830',
        bg:        '#F5F0E6',
        'text-main': '#1B2A3A',
        'text-sub':  '#4A6380',
        warning:   '#E8961A',
        danger:    '#D94F4F',
        'primary-light':   '#F0D878',
        'primary-dark':    '#A07D18',
        'secondary-light': '#2A5888',
        'secondary-dark':  '#0F2235',
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
