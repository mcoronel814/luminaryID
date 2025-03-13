/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
      extend: {
        colors: {
          midnight: {
            500: '#2563eb', // Adjust to match Midnight's brand color
            600: '#1d4ed8',
            700: '#1e40af',
          },
        },
      },
    },
    plugins: [],
  }