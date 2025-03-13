<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import { onMount } from "svelte";
  import Header from "./components/Header.svelte";
  import Footer from "./components/Footer.svelte";
  import Home from "./routes/Home.svelte";
  import Register from "./routes/Register.svelte";
  import Verify from "./routes/Verify.svelte";
  import Dashboard from "./routes/Dashboard.svelte";
  import { walletStore } from "./stores/wallet";
  import WalletConnection from "./components/WalletConnection.svelte";

  let isLoading = true;

  onMount(async () => {
    // Initialize wallet store
    await walletStore.init();
    isLoading = false;
  });
</script>

<Header />

{#if isLoading}
  <div class="flex justify-center items-center h-screen">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-midnight-500"></div>
  </div>
{:else}
  <main class="container mx-auto p-4 min-h-screen">
    <WalletConnection />
    
    <Router>
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/verify" component={Verify} />
      <Route path="/dashboard" component={Dashboard} />
    </Router>
  </main>
{/if}

<Footer />