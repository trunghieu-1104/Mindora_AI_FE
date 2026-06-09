/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   '#C97B3A', // Terracotta primary
        secondary: '#B07D58', // Sand/Clay secondary
        accent:    '#E8A06A', // Peach accent
        bg:        '#FDFBF7', // Warm cream background
        'text-main': '#2E1C16', // Dark brown main text
        'text-sub':  '#8C736C', // Muted brown subtext
        warning:   '#E8961A',
        danger:    '#D94F4F',
        'primary-light':   '#F7D6C0', // Light peach
        'primary-dark':    '#A65E27', // Dark terracotta
        'secondary-light': '#E6B58F', // Sand light
        'secondary-dark':  '#1A0F0D', // Very dark brown
        'soft-green':      '#E2F0D9', // Pastel mint/green
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
