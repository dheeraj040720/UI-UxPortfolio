/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        canvas: 'var(--bg-primary)',
        surface: 'var(--bg-surface)',
        subtle: 'var(--bg-subtle)',
        ink: 'var(--text-primary)',
        slate: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        accent: {
          DEFAULT: 'var(--accent-primary)',
          hover: 'var(--accent-hover)',
          soft: 'var(--accent-soft)',
          ink: 'var(--accent-text)',
        },
        line: 'var(--border-subtle)',
      },
      maxWidth: {
        container: '70rem',
        prose: '45rem',
      },
    },
  },
  plugins: [],
};
