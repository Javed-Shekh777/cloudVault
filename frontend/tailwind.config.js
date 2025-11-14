/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9ecff",
          200: "#bddaff",
          300: "#92c2ff",
          400: "#66a6ff",
          500: "#3b86ff", // primary
          600: "#2f68d6",
          700: "#254fb0",
          800: "#1d3e8c",
          900: "#172f6b",
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
