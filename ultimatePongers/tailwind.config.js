module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        'bti-orange': {
          400: "#FFBB9C",
          600: "#FE9A6A",
          800: "#FE7839",
          1000: '#FE5607'
        },
        'bti-dark': '#2C2C2C',
        'background-gray': '#f2f2f2',
        'gold': '#FFD700',
        'silver': '#C0C0C0',
        'bronze': '#CD7F32'
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
