import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  // Remove the runes configuration since Svelte 4 doesn't support it
  preprocess: vitePreprocess()
};