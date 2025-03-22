/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        akimat: {
          blue: "#4052B4", // Main blue color from the Akimat website
          "light-blue": "#5163C5", // Slightly lighter blue for hover states
          "dark-blue": "#364399", // Darker blue for active states
          "gray-bg": "#f5f5f5", // Light gray background
          "text-dark": "#333333", // Dark text color
          "text-medium": "#555555", // Medium text color
        },
      },
      fontFamily: {
        akimat: ["Arial", "sans-serif"], // Similar font to the government website
      },
    },
  },
  plugins: [],
};
