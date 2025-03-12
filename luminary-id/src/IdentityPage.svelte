<script lang="ts">
    import { onMount } from 'svelte';
    
    // Define props in Svelte 5 style
    const props = $props<{
        connectedAccount: string | null;
        api: any;
        walletDetected: boolean;
    }>();

    // Use $state for reactivity in Svelte 5
    let credentials = $state('');
    let storedCredentials = $state(null);
    let errorMessage = $state(null);
    let isLoading = $state(false);
    let contractAddress = $state(''); // You'll need to set this to your deployed contract address

    function validateCredentials(input) {
        if (!input.trim()) {
            return "Credentials cannot be empty";
        }
        
        if (input.length < 3) {
            return "Credentials must be at least 3 characters long";
        }
        
        return null; // No errors
    }

    async function setCredentials() {
        if (!props.connectedAccount || !props.api) {
            errorMessage = 'Please connect your wallet first';
            return;
        }
        
        // Validate input
        const validationError = validateCredentials(credentials);
        if (validationError) {
            errorMessage = validationError;
            return;
        }
        
        isLoading = true;
        errorMessage = null;
        
        try {
            // For now, simulate a transaction
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Transaction would be sent with credentials:', credentials);
            
            credentials = ''; // Clear input on success
        } catch (err) {
            errorMessage = 'Failed to set credentials: ' + (err instanceof Error ? err.message : String(err));
        } finally {
            isLoading = false;
        }
    }

    async function viewCredentials() {
        if (!props.connectedAccount || !props.api) {
            errorMessage = 'Please connect your wallet first';
            return;
        }
        
        isLoading = true;
        errorMessage = null;
        
        try {
            // Simulate retrieving credentials
            await new Promise(resolve => setTimeout(resolve, 800));
            storedCredentials = "Placeholder credential (replace with contract call)";
        } catch (err) {
            errorMessage = 'Failed to view credentials: ' + (err instanceof Error ? err.message : String(err));
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="max-w-md mx-auto">
    <h2 class="text-xl font-medium mb-4">Manage Identity</h2>
    
    {#if !props.walletDetected}
        <p class="text-yellow-400">Midnight Lace wallet extension not detected. Please install it to use this application.</p>
    {:else if props.connectedAccount}
        <div class="space-y-4">
            <div>
                <label for="credentials" class="block text-sm font-medium mb-1">Credentials</label>
                <input id="credentials" type="text" bind:value={credentials} class="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button 
                onclick={setCredentials} 
                class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50" 
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : 'Set Credentials'}
            </button>
            <button 
                onclick={viewCredentials} 
                class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50" 
                disabled={isLoading}
            >
                {isLoading ? 'Loading...' : 'View Credentials'}
            </button>
            {#if storedCredentials}
                <p class="text-green-400">Stored Credentials: {storedCredentials}</p>
            {/if}
        </div>
    {:else}
        <p class="text-yellow-400">Please connect your wallet to manage identity</p>
    {/if}
    
    {#if errorMessage}
        <p class="text-red-400 mt-2">{errorMessage}</p>
    {/if}
</div>