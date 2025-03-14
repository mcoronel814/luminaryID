// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{svelte,html,js,ts}'],
  theme: {
    extend: {
      colors: {
        cyberGray: { 900: '#1a1a1a', 800: '#2a2a2a', 700: '#3a3a3a', 600: '#4a4a4a' },
        cyberBlue: '#00f2ea',
        cyberPurple: '#7c3aed',
        cyberPink: '#ff007f',
      },
      fontFamily: { orbitron: ['Orbitron', 'sans-serif'] },
      boxShadow: { cyber: '0 0 15px rgba(0, 242, 234, 0.5)' },
      backgroundImage: { 'grid-pattern': 'linear-gradient(to right, #00f2ea 1px, transparent 1px), linear-gradient(to bottom, #00f2ea 1px, transparent 1px)' },
    },
  },
  plugins: [],
};