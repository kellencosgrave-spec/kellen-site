// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'ui-sans-serif',
          'system-ui',
          'Apple Color Emoji',
          'Segoe UI Emoji',
        ],
      },
      container: { center: true, padding: '1.25rem' },
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
    },
  },
  plugins: [],
}

