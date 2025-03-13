<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Identity } from '../lib/contract';
    
    export let identity: Identity;
    
    const dispatch = createEventDispatcher();
    
    // Filter out which attributes to show based on privacy 
    $: publicAttributes = identity.attributes.filter(attr => attr.isPublic);
    $: privateAttributes = identity.attributes.filter(attr => !attr.isPublic);
    
    function handleUpdate() {
      dispatch('update', { identity });
    }
    
    function handleRevoke() {
      if (confirm('Are you sure you want to revoke this identity? This action cannot be undone.')) {
        dispatch('revoke', { identityHash: identity.hash });
      }
    }
  </script>
  
  <div class="card {!identity.isActive ? 'bg-gray-100' : ''}">
    {#if !identity.isActive}
      <div class="absolute top-3 right-3 px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800">
        Revoked
      </div>
    {/if}
    
    <h3 class="text-lg font-medium text-gray-900 mb-2">Identity</h3>
    <p class="text-sm font-mono text-gray-500 break-all mb-4">{identity.hash}</p>
    
    {#if publicAttributes.length > 0}
      <div class="mb-4">
        <h4 class="text-sm font-semibold text-gray-700 mb-2">Public Attributes</h4>
        <div class="bg-blue-50 p-3 rounded-md">
          <ul class="space-y-2">
            {#each publicAttributes as attr}
              <li class="flex justify-between">
                <span class="text-sm text-gray-600 font-medium">{attr.name}:</span>
                <span class="text-sm text-gray-800">{attr.value}</span>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}
  
  {#if privateAttributes.length > 0}
    <div class="mb-4">
      <h4 class="text-sm font-semibold text-gray-700 mb-2">Private Attributes</h4>
      <div class="bg-purple-50 p-3 rounded-md">
        <ul class="space-y-2">
          {#each privateAttributes as attr}
            <li class="flex justify-between">
              <span class="text-sm text-gray-600 font-medium">{attr.name}:</span>
              <span class="text-sm text-gray-800">{attr.value}</span>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}
  
  <div class="flex justify-end space-x-2 mt-4">
    {#if identity.isActive}
      <button 
        on:click={handleUpdate}
        class="btn btn-outline"
      >
        Update
      </button>
      <button 
        on:click={handleRevoke}
        class="btn bg-red-600 hover:bg-red-700 text-white"
      >
        Revoke
      </button>
    {/if}
  </div>
</div>