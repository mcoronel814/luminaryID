<script>
    import { connectToWallet } from '../lib/midnight';
    import { wallet } from '../lib/store';
    
    async function connect() {
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
  
  <div class="card">
    <div class="text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">Connect Wallet</h3>
      <p class="mt-1 text-sm text-gray-500">
        Connect your Midnight Lace wallet to start managing your digital identities.
      </p>
      <div class="mt-6">
        <button
          type="button"
          on:click={connect}
          class="btn btn-primary w-full"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  </div>