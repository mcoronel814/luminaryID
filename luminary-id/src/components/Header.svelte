<script lang="ts">
    import { wallet } from '../lib/store';
    import { connectToWallet } from '../lib/midnight';
    
    async function handleConnect() {
      try {
        const api = await connectToWallet();
        const state = await api.state();
        
        wallet.set({
          connected: true,
          address: state.address,
          api
        });
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    }
  </script>
  
  <header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-2xl font-bold text-primary-600">LuminaryID</h1>
          </div>
        </div>
        <div>
          {#if $wallet.connected}
            <div class="flex items-center">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <span class="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                Connected
              </span>
              <span class="ml-4 text-sm text-gray-500 truncate max-w-[200px]" title={$wallet.address}>
                {$wallet.address}
              </span>
            </div>
          {:else}
            <button 
              on:click={handleConnect}
              class="btn btn-primary"
            >
              Connect Wallet
            </button>
          {/if}
        </div>
      </div>
    </div>
  </header>