/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Pastel & Gradient Colors
        primary: {
          50: '#FFF7FB',
          100: '#FFE4F4',
          200: '#FFC9E9',
          300: '#FFADDE',
          400: '#FF9CE3',
          500: '#E879C0',
          600: '#D1569D',
          700: '#BA337A',
        },
        secondary: {
          50: '#F8F4FF',
          100: '#E9DDFF',
          200: '#D4BCFF',
          300: '#BF9AFF',
          400: '#9B6BFF',
          500: '#7E4FD9',
          600: '#6133B3',
          700: '#44178D',
        },
        pastel: {
          pink: '#FFF7FB',
          lavender: '#F8F4FF',
          teal: '#A7F3D0',
          sky: '#C7D2FE',
          peach: '#FFDAB9',
          mint: '#E0F2F1',
        },
        dark: {
          bg: '#1D0F2E',
          card: '#2A1A40',
          lighter: '#3D2B56',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'Nunito', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 8px 30px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 20px rgba(255, 156, 227, 0.3)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF9CE3 0%, #9B6BFF 100%)',
        'gradient-primary-hover': 'linear-gradient(135deg, #E879C0 0%, #7E4FD9 100%)',
      },
    },
  },
  plugins: [],
}
