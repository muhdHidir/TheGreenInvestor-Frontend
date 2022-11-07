/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        darkGreen: {
          50: "#245A44",
        },
        gold: {
          50: "#CFB53B",
        },
        silver: {
          50: "#808080",
        },
        bronze: {
          50: "#CD7F32",
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
};
