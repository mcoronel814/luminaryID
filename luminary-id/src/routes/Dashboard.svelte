<script lang="ts">
    import { onMount } from 'svelte';
    import { contractService } from '../services/contract';
    import { isWalletConnected } from '../stores/wallet';
    import { contractStore } from '../stores/contract';
    import { navigate } from 'svelte-routing';
    
    let isLoading = true;
    let error: string | null = null;
    
    // Check contract status
    onMount(async () => {
      if (!$isWalletConnected) {
        isLoading = false;
        return;
      }
      
      if (!$contractStore.address) {
        // Not registered yet, redirect to register
        navigate('/register');
        return;
      }
      
      try {
        // Check verification status
        const result = await contractService.checkVerification();
        contractStore.setVerified(result);
        isLoading = false;
      } catch (err) {
        error = (err as Error).message || 'Failed to load verification status';
        isLoading = false;
      }
    });
  </script>
  
  <div class="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
    <h1 class="text-2xl font-bold mb-6">Your Identity Dashboard</h1>
    
    {#if error}
      <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <p>{error}</p>
      </div>
    {/if}
    
    {#if !$isWalletConnected}
      <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
        <p>Please connect your wallet to view your dashboard.</p>
      </div>
    {:else if isLoading}
      <div class="flex justify-center items-center h-32">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-midnight-500"></div>
      </div>
    {:else}
      <div class="space-y-6">
        <div class="bg-gray-50 rounded-lg p-4">
          <h2 class="text-lg font-medium mb-2">Identity Status</h2>
          <div class="flex items-center mt-2">
            <span class={`inline-block w-3 h-3 rounded-full ${$contractStore.address ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
            <span class="font-medium">{$contractStore.address ? 'Registered' : 'Not Registered'}</span>
          </div>
          
          {#if $contractStore.address}
            <p class="text-sm text-gray-600 mt-2 break-all">
              <span class="font-medium">Contract Address:</span> {$contractStore.address}
            </p>
          {/if}
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4">
          <h2 class="text-lg font-medium mb-2">Age Verification</h2>
          <div class="flex items-center mt-2">
            <span class={`inline-block w-3 h-3 rounded-full ${$contractStore.isVerified ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></span>
            <span class="font-medium">{$contractStore.isVerified ? 'Verified' : 'Not Verified'}</span>
          </div>
          
          {#if !$contractStore.isVerified}
            <button 
              class="mt-4 bg-midnight-500 hover:bg-midnight-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              on:click={() => navigate('/verify')}
            >
              Go to Verification
            </button>
          {/if}
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4">
          <h2 class="text-lg font-medium mb-2">Privacy Benefits</h2>
          <ul class="list-disc list-inside text-gray-600 space-y-1">
            <li>Your actual age is never stored on the blockchain</li>
            <li>Age verification is performed through zero-knowledge proofs</li>
            <li>Only the verification result is publicly visible</li>
            <li>You control your identity data</li>
          </ul>
        </div>
      </div>
    {/if}
  </div>