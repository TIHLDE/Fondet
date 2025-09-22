/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base colors
        background: 'hsl(217, 62%, 8%)',
        foreground: 'hsl(0, 0%, 100%)',
        border: 'hsl(217, 62%, 20%)',
        input: 'hsl(217, 62%, 20%)',
        ring: 'hsl(0, 0%, 100%)',
        
        // Component colors
        primary: {
          DEFAULT: 'hsl(217, 62%, 32%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        secondary: {
          DEFAULT: 'hsl(217, 62%, 15%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        card: {
          DEFAULT: 'hsl(217, 62%, 12%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        
        // Accent and Muted
        muted: {
          DEFAULT: 'hsl(217, 62%, 15%)',
          foreground: 'hsl(0, 0%, 85%)',
        },
        accent: {
          DEFAULT: 'hsl(217, 62%, 15%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        
        // Sidebar colors
        sidebar: {
          background: 'hsl(217, 62%, 6%)',
          foreground: 'hsl(0, 0%, 95%)',
          primary: 'hsl(217, 62%, 32%)',
          accent: 'hsl(217, 62%, 12%)',
        },
        
        // Status colors
        destructive: {
          DEFAULT: 'hsl(0, 84.2%, 60.2%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        'destructive-dark': 'hsl(0, 62.8%, 30.6%)',
        
        // Gradient colors
        'gradient-primary': {
          start: '#1C458A',
          middle: '#0F2027',
          end: '#1A365D',
        },
        'gradient-secondary': {
          start: '#1C458A',
          end: '#2C5282',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #1C458A 0%, #0F2027 50%, #1A365D 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #1C458A 0%, #2C5282 100%)',
      },
    },
  },
  plugins: [],
}

