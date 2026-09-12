/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          50: "#f0f5f1",
          100: "#dbe8de",
          600: "#2f5d3f",
          700: "#254a32",
          800: "#1c3a27",
          900: "#142a1c",
        },
      },
    },
  },
  plugins: [],
}
