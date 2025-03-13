<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    export let existingAddress: string = '';
    
    const dispatch = createEventDispatcher();
    
    let deployType: 'new' | 'existing' = 'new';
    let contractAddress = existingAddress;
    
    function handleSubmit() {
      if (deployType === 'existing' && !contractAddress.trim()) {
        alert('Please enter a contract address.');
        return;
      }
      
      dispatch('deploy', {
        deployType,
        contractAddress: deployType === 'existing' ? contractAddress : null
      });
    }
  </script>
  
  <div class="card">
    <h2 class="text-xl font-semibold mb-4">Initialize Identity Contract</h2>
    
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Contract Options</label>
        <div class="space-y-2">
          <div class="flex items-center">
            <input 
              type="radio" 
              id="deploy-new" 
              bind:group={deployType} 
              value="new"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <label for="deploy-new" class="ml-2 block text-sm text-gray-700">
              Deploy a new identity contract
            </label>
          </div>
          <div class="flex items-center">
            <input 
              type="radio" 
              id="use-existing" 
              bind:group={deployType} 
              value="existing"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <label for="use-existing" class="ml-2 block text-sm text-gray-700">
              Use an existing contract
            </label>
          </div>
        </div>
      </div>
      
      {#if deployType === 'existing'}
        <div>
          <label for="contract-address" class="block text-sm font-medium text-gray-700 mb-1">
            Contract Address
          </label>
          <input 
            type="text" 
            id="contract-address" 
            bind:value={contractAddress}
            class="input w-full"
            placeholder="Enter contract address"
          />
        </div>
      {/if}
      
      <div class="flex justify-end">
        <button type="submit" class="btn btn-primary">
          {deployType === 'new' ? 'Deploy Contract' : 'Connect to Contract'}
        </button>
      </div>
    </form>
  </div>