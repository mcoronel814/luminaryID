<script lang="ts">
    import { walletStore, isWalletConnected } from '../stores/wallet';
    
    function handleConnect() {
      walletStore.connect();
    }
    
    function handleDisconnect() {
      walletStore.disconnect();
    }
  </script>
  
  <div class="bg-white shadow-md rounded-lg p-4 mb-6">
    <h2 class="text-xl font-bold mb-4">Wallet Connection</h2>
    
    {#if $walletStore.error}
      <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <p>{$walletStore.error}</p>
      </div>
    {/if}
    
    {#if $isWalletConnected}
      <div class="flex flex-col space-y-2">
        <div class="flex items-center">
          <span class="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
          <span class="font-medium">Connected</span>
        </div>
        
        <div class="text-sm text-gray-600 break-all">
          <p><span class="font-medium">Address:</span> {$walletStore.address}</p>
        </div>
        
        <button 
          class="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          on:click={handleDisconnect}
        >
          Disconnect
        </button>
      </div>
    {:else}
      <div class="flex flex-col space-y-2">
        <div class="flex items-center">
          <span class="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
          <span class="font-medium">Disconnected</span>
        </div>
        
        <button 
          class="mt-4 bg-midnight-500 hover:bg-midnight-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          on:click={handleConnect}
        >
          Connect Lace Wallet
        </button>
      </div>
    {/if}
  </div>