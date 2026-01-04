/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0a0a0f', // Deeper, richer
          panel: '#13141b',   // Subtle purple tint
          surface: '#1a1b26', // Cooler tone
        },
        primary: {
          DEFAULT: '#7c3aed', // Vivid purple
          hover: '#6d28d9',
          light: '#a78bfa',   // Bright lavender
        },
        secondary: {
          DEFAULT: '#3b82f6', // Electric blue
          hover: '#2563eb',
        },
        accent: {
          text: '#c4b5fd',    // Soft purple
        }
      },
      fontFamily: {
        robotic: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'slide-in': 'slideIn 300ms cubic-bezier(0.2, 0.0, 0.2, 1) forwards',
        'slide-out': 'slideOut 200ms cubic-bezier(0.2, 0.0, 0.2, 1) forwards',
        'fade-in': 'fadeIn 200ms ease-out forwards',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.2)' },
        }
      }
    },
  },
  plugins: [],
};
