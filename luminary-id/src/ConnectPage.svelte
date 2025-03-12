<script lang="ts">
    // Define component props in Svelte 5 style using $props()
    const props = $props<{
        connectedAccount: string | null;
        api: any;
        walletDetected: boolean;
        updateAccount: (account: string | null) => void;
        updateApi: (api: any) => void;
    }>();

    // Use $state for reactive variables in Svelte 5
    let errorMessage = $state(null);
    let isConnecting = $state(false);

    async function connectWallet() {
        if (isConnecting) return;
        
        isConnecting = true;
        errorMessage = null;
        
        try {
            if (!props.walletDetected || !window.midnight || !window.midnight.lace) {
                throw new Error('Midnight wallet not detected. Please install the Midnight Lace extension.');
            }
            
            // Request access to the wallet
            const newApi = await window.midnight.lace.enable();
            
            // Get the wallet state
            const state = await newApi.state();
            const newAccount = state.address;
            
            // Update parent state via callbacks
            props.updateAccount(newAccount);
            props.updateApi(newApi);
            
            // Store connection state
            localStorage.setItem('lastConnected', 'true');
            
            console.log('Connected to wallet:', newAccount);
        } catch (err) {
            errorMessage = 'Failed to connect wallet: ' + (err instanceof Error ? err.message : String(err));
        } finally {
            isConnecting = false;
        }
    }
    
    async function disconnectWallet() {
        try {
            // Update parent state via callbacks
            props.updateAccount(null);
            props.updateApi(null);
            
            localStorage.removeItem('lastConnected');
        } catch (err) {
            errorMessage = 'Failed to disconnect wallet: ' + (err instanceof Error ? err.message : String(err));
        }
    }
</script>

<div class="max-w-md mx-auto">
    <h2 class="text-xl font-medium mb-4">Connect to Midnight Lace Wallet</h2>
    
    {#if !props.walletDetected}
        <div class="bg-yellow-800/30 border border-yellow-600 p-4 rounded-lg mb-4">
            <p class="text-yellow-400">Midnight Lace wallet extension not detected. Please install it to use this application.</p>
        </div>
    {:else if props.connectedAccount}
        <div class="space-y-4">
            <p class="text-green-400">Connected: {props.connectedAccount}</p>
            <button 
                onclick={disconnectWallet} 
                class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
                Disconnect Wallet
            </button>
        </div>
    {:else}
        <button 
            onclick={connectWallet} 
            class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50" 
            disabled={isConnecting}
        >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
    {/if}
    
    {#if errorMessage}
        <p class="text-red-400 mt-2">{errorMessage}</p>
    {/if}
</div>