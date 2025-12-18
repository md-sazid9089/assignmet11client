/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Slate & Clay Theme
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        clay: {
          50: '#fef6f3',
          100: '#fde9e2',
          200: '#fbd2c5',
          300: '#f7ad98',
          400: '#f1806a',
          500: '#d97757', // Primary clay - muted terracotta
          600: '#b35a44', // Darker clay for hover states
          700: '#8e4636',
          800: '#743a2e',
          900: '#5f3228',
          950: '#341814',
        },
        // Semantic colors using Slate & Clay
        primary: {
          DEFAULT: '#d97757', // Clay 500
          light: '#f1806a',   // Clay 400
          dark: '#b35a44',    // Clay 600
          50: '#fef6f3',
          100: '#fde9e2',
          200: '#fbd2c5',
          300: '#f7ad98',
          400: '#f1806a',
          500: '#d97757',
          600: '#b35a44',
          700: '#8e4636',
          800: '#743a2e',
          900: '#5f3228',
        },
        secondary: {
          DEFAULT: '#475569', // Slate 600
          light: '#64748b',   // Slate 500
          dark: '#334155',    // Slate 700
        },
        // Admin panel specific - darker, more utilitarian slate
        admin: {
          bg: '#0f172a',      // Slate 900
          surface: '#1e293b', // Slate 800
          border: '#334155',  // Slate 700
          text: '#e2e8f0',    // Slate 200
          muted: '#64748b',   // Slate 500
        },
        // User-facing areas - lighter, warmer
        user: {
          bg: '#f8fafc',      // Slate 50
          surface: '#ffffff',
          border: '#e2e8f0',  // Slate 200
          text: '#0f172a',    // Slate 900
          muted: '#64748b',   // Slate 500
        },
      },
      backgroundImage: {
        'slate-gradient': 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        'clay-gradient': 'linear-gradient(135deg, #d97757 0%, #b35a44 100%)',
        'admin-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        'user-gradient': 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      },
      boxShadow: {
        'clay': '0 4px 14px 0 rgba(217, 119, 87, 0.25)',
        'clay-lg': '0 10px 40px 0 rgba(217, 119, 87, 0.35)',
        'slate': '0 4px 14px 0 rgba(30, 41, 59, 0.15)',
        'slate-lg': '0 10px 40px 0 rgba(30, 41, 59, 0.25)',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#d97757",        // Clay 500
          "secondary": "#475569",      // Slate 600
          "accent": "#f1806a",         // Clay 400
          "neutral": "#334155",        // Slate 700
          "base-100": "#ffffff",
          "base-200": "#f8fafc",       // Slate 50
          "base-300": "#e2e8f0",       // Slate 200
          "info": "#64748b",           // Slate 500
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
        dark: {
          "primary": "#d97757",        // Clay 500
          "secondary": "#64748b",      // Slate 500
          "accent": "#f7ad98",         // Clay 300
          "neutral": "#1e293b",        // Slate 800
          "base-100": "#0f172a",       // Slate 900
          "base-200": "#1e293b",       // Slate 800
          "base-300": "#334155",       // Slate 700
          "info": "#94a3b8",           // Slate 400
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
    ],
  },
};
