/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        bg2: 'var(--bg2)',
        surface: 'var(--surface)',
        surface2: 'var(--surface2)',
        border: 'var(--border)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        dim: 'var(--dim)',
        teal: 'var(--teal)',
        indigo: 'var(--indigo)',
        violet: 'var(--violet)',
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        grad: 'var(--grad)',
      },
      boxShadow: {
        card: 'var(--shadow)',
      },
    },
  },
  plugins: [],
};
