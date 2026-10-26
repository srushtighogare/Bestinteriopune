/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#F6F2EA',
        paper: '#FBF9F4',
        ink: {
          DEFAULT: '#2A2925',
          2: '#4A4740',
        },
        muted: '#7A756B',
        line: '#E3DCCF',
        sand: '#DCD2C2',
        olive: {
          DEFAULT: '#6B7052',
          soft: '#E6E7DA',
        },
        amber: {
          DEFAULT: '#B58A4C',
          soft: '#F3E8D6',
        },
        rust: {
          DEFAULT: '#A35F4A',
          soft: '#F2E1DA',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '14px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(42, 41, 37, 0.05)',
        'float': '0 8px 30px -4px rgba(42, 41, 37, 0.08)',
      },
    },
  },
  plugins: [],
}
