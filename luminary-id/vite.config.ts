import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [
    tailwindcss(),
    svelte({
      configFile: 'svelte.config.js'
    })
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
      ],
    },
  },
})