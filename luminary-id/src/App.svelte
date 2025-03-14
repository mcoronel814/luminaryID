<!-- src/App.svelte -->
<script lang="ts">
  import { mockProveOver18 } from './contract/mockContract';

  let walletConnected = false;
  let userPk = 'MockPublicKey123';
  let isVerified = false;
  let proving = false;
  let ageInput = '';

  function connectWallet() { walletConnected = true; }

  async function proveOver18() {
    if (!ageInput) { alert('Please enter your age.'); return; }
    const ageNum = BigInt(ageInput);
    proving = true;
    setTimeout(() => {
      const result = mockProveOver18(ageNum);
      isVerified = result.isVerified;
      proving = false;
      alert(isVerified ? 'Proof successful! You are over 18.' : 'Proof failed. You must be at least 18.');
    }, 2000);
  }
</script>

<main class="min-h-screen flex items-center justify-center p-4">
  <div class="cyber-card max-w-md w-full space-y-6">
    <h1 class="text-3xl font-bold text-center">LuminaryID</h1>
    {#if !walletConnected}
      <button class="cyber-button w-full" on:click={connectWallet}>Connect Wallet</button>
    {:else}
      <p class="text-center">Wallet connected: {userPk}</p>
      {#if isVerified}
        <p class="text-center text-cyberBlue text-xl">✅ Verified: Over 18</p>
      {:else}
        <div class="space-y-4">
          <input type="number" placeholder="Enter your age" class="cyber-input w-full" bind:value={ageInput} />
          <button class="cyber-button w-full" on:click={proveOver18} disabled={proving}>
            {#if proving}Proving...{:else}Prove I am over 18{/if}
          </button>
        </div>
      {/if}
    {/if}
  </div>
</main>