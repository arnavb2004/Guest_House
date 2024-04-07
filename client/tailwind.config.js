/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    screens: {
      'lg': {'max': '1024px'},
    },
    extend: {
      zIndex: {
        '100': '100',
      }
    },
  },
  plugins: [],
};
