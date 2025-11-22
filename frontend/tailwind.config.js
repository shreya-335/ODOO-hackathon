/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "odoo-purple": "#714B67",
        "odoo-light": "#E4D8F5",
        "odoo-dark": "#4B2E44",
        plum: "#875A7B",
        lavender: "#D4BBDD",
      },
    },
  },
  plugins: [],
}
