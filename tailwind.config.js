/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      accent: {
        light: 'rgb(var(--accent-light) / <alpha-value>)',
        main: 'rgb(var(--accent-main) / <alpha-value>)',
        dark: 'rgb(var(--accent-dark) / <alpha-value>)',
      },
      slider: 'rgb(var(--slider-track) / <alpha-value>)',
      text: {
        primary: 'rgb(var(--text-primary) / <alpha-value>)',
      },
      background: {
        tray: 'var(--tray-background)',
        trayBorder: 'var(--tray-border)',
      },
      action: {
        hover: 'var(--action-hover)'
      },
      icon: {
        main: 'var(--icon-color)',
        hover: 'var(--icon-hover-color)',
      },

      transparent: 'transparent'
    },
  },
  plugins: [],
}
