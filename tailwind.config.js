/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      accent: {
        light: 'rgb(var(--system-accent-light) / <alpha-value>)',
        main: 'rgb(var(--accent-main) / <alpha-value>)',
        dark: 'rgb(var(--system-accent-dark) / <alpha-value>)',
      },
      slider: 'rgb(var(--slider-track) / <alpha-value>)',

      text: {
        primary: 'rgb(var(--text-primary) / <alpha-value>)',
      },

      transparent: 'transparent'
    },
  },
  plugins: [],
}
