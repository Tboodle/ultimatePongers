module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        'bti-orange': {
          100: '#FFE5D5',
          200: '#FFC7A9',
          400: '#FFBB9C',
          600: '#FE9A6A',
          800: '#FE7839',
          1000: '#9b1911',
        },
        'bti-red-orange': '#FF2000',
        'bti-dark': {
          600: '#696969',
          800: '#2C2C2C',
        },
        'background-gray': '#f2f2f2',
        gold: '#FFD700',
        silver: '#C0C0C0',
        bronze: '#CD7F32',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
