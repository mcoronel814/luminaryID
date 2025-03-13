<script lang="ts">
    import { onMount } from 'svelte';
    import { contractService } from '../services/contract';
    import { isWalletConnected } from '../stores/wallet';
    import { contractStore } from '../stores/contract';
    import { navigate } from 'svelte-routing';
    
    let minAge: number = 18;
    let isSubmitting = false;
    let error: string | null = null;
    let success: string | null = null;
    let verificationResult: boolean | null = null;
    
    $: isDisabled = !$isWalletConnected || !$contractStore.address || minAge <= 0 || isSubmitting;
    
    // Check if contract is deployed
    onMount(() => {
      if (!$contractStore.address && $isWalletConnected) {
        // Not registered yet, redirect to register
        navigate('/register');
      }
    });
    
    async function handleSubmit() {
      if (isDisabled) return;
      
      isSubmitting = true;
      error = null;
      success = null;
      verificationResult = null;
      
      try {
        // Call contract to verify age
        const txHash = await contractService.verifyAge(minAge);
        
        // Check verification result
        const result = await contractService.checkVerification();
        verificationResult = result;
        
        if (verificationResult) {
          success = `Successfully verified! You are at least ${minAge} years old.`;
          contractStore.setVerified(true);
        } else {
          error = `Verification failed. You are not at least ${minAge} years old.`;
        }
      } catch (err) {
        error = err.message || 'Failed to verify age';
      } finally {
        isSubmitting = false;
      }
    }
  </script>
  
  <div class="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
    <h1 class="text-2xl font-bold mb-6">Verify Your Age</h1>
    
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
        <p>Please connect your wallet to verify your age.</p>
      </div>
    {:else if !$contractStore.address}
      <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
        <p>You need to register your identity first.</p>
        <button 
          class="mt-2 text-sm font-medium text-yellow-800 underline"
          on:click={() => navigate('/register')}
        >
          Go to Registration
        </button>
      </div>
    {:else}
      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div>
          <label for="minAge" class="block text-sm font-medium text-gray-700">Minimum Age Requirement</label>
          <input
            type="number"
            id="minAge"
            bind:value={minAge}
            min="1"
            max="120"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-midnight-500 focus:ring focus:ring-midnight-500 focus:ring-opacity-50"
            required
          />
          <p class="mt-1 text-sm text-gray-500">
            Verify that you are at least this age without revealing your actual age.
          </p>
        </div>
        
        <div>
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-midnight-600 hover:bg-midnight-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-midnight-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDisabled}
          >
            {isSubmitting ? 'Verifying...' : 'Verify Age'}
          </button>
        </div>
        
        {#if verificationResult !== null}
          <div class={`p-4 border-l-4 rounded-md ${verificationResult ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'}`}>
            <div class="flex">
              <div class="flex-shrink-0">
                {#if verificationResult}
                  <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                {:else}
                  <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                {/if}
              </div>
              <div class="ml-3">
                <p class="text-sm">
                  {verificationResult 
                    ? `Verification successful! Your age meets the requirement of at least ${minAge} years old.` 
                    : `Verification failed. Your age does not meet the requirement of at least ${minAge} years old.`}
                </p>
              </div>
            </div>
          </div>
        {/if}
      </form>
    {/if}
  </div>