/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'monaco-bg': '#1e1e1e',
        'monaco-sidebar': '#252526',
        'monaco-border': '#3e3e42',
        'monaco-text': '#cccccc',
        'monaco-text-secondary': '#969696',
        'monaco-accent': '#007acc',
        'monaco-hover': '#2a2d2e',
        'monaco-selection': '#094771',
      },
      fontFamily: {
        'mono': ['Cascadia Code', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}