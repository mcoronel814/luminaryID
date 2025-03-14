// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{svelte,html,js,ts}'],
    theme: {
      extend: {
        colors: {
          cyberGray: { 900: '#1a1a1a', 800: '#2a2a2a', 700: '#3a3a3a', 600: '#4a4a4a' },
          cyberBlue: '#00f2ea',
        },
        fontFamily: { cyber: ['"Exo 2"', 'sans-serif'] },
        boxShadow: { cyber: '0 0 15px rgba(0, 242, 234, 0.5)' },
        backgroundImage: { 'metal-gradient': 'linear-gradient(135deg, #2a2a2a 0%, #4a4a4a 100%)' },
      },
    },
    plugins: [],
  };