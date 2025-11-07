/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primaria: "#FFA2B9",      
        secundaria: "#FFC2D1",    
        background: "#ffbff3ff"
      },
    },
  },
  plugins: [],
}