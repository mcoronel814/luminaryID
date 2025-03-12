<script lang="ts">
    // Define props in Svelte 5 style
    const props = $props<{
        connectedAccount: string | null;
        api: any;
        walletDetected: boolean;
    }>();
    
    // Use $state for reactivity in Svelte 5
    let verificationAttributes = $state([
        { id: 'age', label: 'Age (>18)', selected: false },
        { id: 'country', label: 'Country (US Resident)', selected: false },
        { id: 'kyc', label: 'KYC Verified', selected: false }
    ]);
    
    let verificationResult = $state(null);
    let isVerifying = $state(false);
    let errorMessage = $state(null);
    
    async function generateProof() {
        if (!props.connectedAccount || !props.api) {
            errorMessage = 'Please connect your wallet first';
            return;
        }
        
        const selectedAttributes = verificationAttributes
            .filter(attr => attr.selected)
            .map(attr => attr.id);
            
        if (selectedAttributes.length === 0) {
            errorMessage = 'Please select at least one attribute to verify';
            return;
        }
        
        isVerifying = true;
        errorMessage = null;
        verificationResult = null;
        
        try {
            // Simulate generating a proof
            await new Promise(resolve => setTimeout(resolve, 1500));
            verificationResult = 'Verification successful! The proof was generated and verified without revealing your private data.';
        } catch (err) {
            errorMessage = 'Failed to generate proof: ' + (err instanceof Error ? err.message : String(err));
        } finally {
            isVerifying = false;
        }
    }
</script>

<div class="max-w-md mx-auto">
    <h2 class="text-xl font-medium mb-4">Verify Attributes</h2>
    
    {#if !props.walletDetected}
        <p class="text-yellow-400">Midnight Lace wallet extension not detected. Please install it to use this application.</p>
    {:else if props.connectedAccount}
        <div class="space-y-6">
            <div class="bg-gray-800 p-4 rounded-lg">
                <h3 class="text-lg mb-3">Select attributes to verify:</h3>
                
                <div class="space-y-2">
                    {#each verificationAttributes as attribute}
                        <label class="flex items-center space-x-2">
                            <input 
                                type="checkbox" 
                                bind:checked={attribute.selected} 
                                class="form-checkbox h-5 w-5 text-blue-600" 
                            />
                            <span>{attribute.label}</span>
                        </label>
                    {/each}
                </div>
            </div>
            
            <button 
                onclick={generateProof} 
                class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50" 
                disabled={isVerifying}
            >
                {isVerifying ? 'Generating proof...' : 'Generate Zero-Knowledge Proof'}
            </button>
            
            {#if verificationResult}
                <div class="bg-green-800/30 border border-green-600 p-4 rounded-lg">
                    <p class="text-green-400">{verificationResult}</p>
                </div>
            {/if}
            
            {#if errorMessage}
                <p class="text-red-400">{errorMessage}</p>
            {/if}
        </div>
    {:else}
        <p class="text-yellow-400">Please connect your wallet to verify attributes</p>
    {/if}
</div>