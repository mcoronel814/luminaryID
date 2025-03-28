import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
// Remove or comment out the old import:
// import nodePolyfills from 'vite-plugin-node-stdlib-browser';
// Import the new plugin:
import { nodePolyfills } from 'vite-plugin-node-polyfills';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    // Use the new plugin
    nodePolyfills({
        // Options (optional):
        // Whether to polyfill `global`.
        // global: true,
        // Whether to polyfill `Buffer`.
        // buffer: true,
        // Whether to polyfill `process`.
        // process: true,
        // You can add specific modules to include/exclude if needed
        // include: [],
        // exclude: [],
    })
  ],
  // optimizeDeps might still be needed depending on other dependencies
  optimizeDeps: {
    esbuildOptions: {
        define: {
            global: 'globalThis'
        }
    }
  }
})