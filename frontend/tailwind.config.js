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
        // Premium color palette
        'premium-dark': '#0f172a',
        'premium-darker': '#0c1221',
        'premium-darkest': '#080d1d',
        'premium-gray': '#1e293b',
        'premium-gray-light': '#334155',
        'premium-blue': '#3b82f6',
        'premium-blue-dark': '#2563eb',
        'premium-purple': '#8b5cf6',
        'premium-purple-dark': '#7c3aed',
        'premium-indigo': '#6366f1',
        'premium-indigo-dark': '#4f46e5',
        'premium-cyan': '#06b6d4',
        'premium-cyan-dark': '#0891b2',
        'premium-green': '#10b981',
        'premium-green-dark': '#059669',
        'premium-amber': '#f59e0b',
        'premium-amber-dark': '#d97706',
        'premium-rose': '#f43f5e',
        'premium-rose-dark': '#e11d48',
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
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}