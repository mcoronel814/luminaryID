import './app.css';
import { mount } from 'svelte';
import App from './App.svelte'

// Add a null check for the target element
const target = document.getElementById("app");
if (!target) {
  throw new Error("Could not find element with id 'app'");
}

const app = mount(App, { target });

export default app;