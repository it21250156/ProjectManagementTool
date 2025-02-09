const flowbite = require("flowbite/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js", // Add Flowbite's content paths
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbite, // Use the Flowbite plugin
  ],
};
