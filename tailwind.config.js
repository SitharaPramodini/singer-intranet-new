const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content(),],
  theme: {
    extend: {},
  },
  plugins: [flowbite.plugin(),],
}




// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js", // Add this line
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'), // Add this line
  ],
}
