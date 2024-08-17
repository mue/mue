const { light } = require('@mui/material/styles/createPalette');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        modal: {
          light: 'rgba(255, 255, 255, .85)',
          dark: 'rgba(14, 16, 19, .85)',
        },
        'modal-content': {
          light: 'rgba(255, 255, 255, .95)',
          dark: 'rgba(14, 16, 19, .95)',
        },
        background: {
          light: 'rgba(255, 255, 255, 0.7)',
          dark: 'rgba(0, 0, 0, 0.7)',
        },
        brand: {
          orange: '#FF5C25',
          red: '#D21A11',
          pink: '#FF456E',
        },
      },
      width: {
        modal: 'clamp(60vw, 1400px, 90vw)',
      },
      borderRadius: {
        DEFAULT: '12px',
      },
      borderColor: {
        modal: 'rgba(14, 16, 19, 0.3)', // Define your custom border color
      },
      textShadow: {
        sm: '0 1px 4px var(--tw-shadow-color)',
        DEFAULT: '0 2px 8px var(--tw-shadow-color)',
        lg: '0 8px 24px var(--tw-shadow-color)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') },
      );
    }),
  ],
};
