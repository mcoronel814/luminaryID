<script lang="ts">
    import { onMount } from 'svelte';
    import { contractService } from '../services/contract';
    import { isWalletConnected } from '../stores/wallet';
    import { contractStore } from '../stores/contract';
    import { navigate } from 'svelte-routing';
    
    let age: number = 18;
    let isSubmitting = false;
    let error: string | null = null;
    let success: string | null = null;
    
    $: isDisabled = !$isWalletConnected || age <= 0 || isSubmitting;
    
    // Check if already registered
    onMount(() => {
      if ($contractStore.address) {
        // Already registered, redirect to dashboard
        navigate('/dashboard');
      }
    });
    
    async function handleSubmit() {
      if (isDisabled) return;
      
      isSubmitting = true;
      error = null;
      success = null;
      
      try {
        // Deploy the contract with user's age
        const txHash = await contractService.deployContract(age);
        success = `Successfully registered! Transaction hash: ${txHash}`;
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } catch (err) {
        error = err.message || 'Failed to register identity';
      } finally {
        isSubmitting = false;
      }
    }
  </script>
  
  <div class="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
    <h1 class="text-2xl font-bold mb-6">Register Your Identity</h1>
    
    {#if error}
      <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <p>{error}</p>
      </div>
    {/if}
    
    {#if success}
      <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
        <p>{success}</p>
      </div>
    {/if}
    
    {#if !$isWalletConnected}
      <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
        <p>Please connect your wallet to register.</p>
      </div>
    {:else}
      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div>
          <label for="age" class="block text-sm font-medium text-gray-700">Your Age</label>
          <input
            type="number"
            id="age"
            bind:value={age}
            min="1"
            max="120"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-midnight-500 focus:ring focus:ring-midnight-500 focus:ring-opacity-50"
            required
          />
          <p class="mt-1 text-sm text-gray-500">
            Your actual age will be kept private. Only age verification results will be stored on the blockchain.
          </p>
        </div>
        
        <div>
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-midnight-600 hover:bg-midnight-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-midnight-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDisabled}
          >
            {isSubmitting ? 'Registering...' : 'Register Identity'}
          </button>
        </div>
      </form>
    {/if}
  </div>