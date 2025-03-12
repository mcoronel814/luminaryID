<script lang="ts">
    import { onMount } from 'svelte';
    import ConnectPage from './ConnectPage.svelte';
    import IdentityPage from './IdentityPage.svelte';
    import VerifyPage from './VerifyPage.svelte';

    // Use $state for reactivity in Svelte 5
    let currentPage = $state(ConnectPage);
    let connectedAccount = $state(null);
    let api = $state(null);
    let walletDetected = $state(false);

    onMount(async () => {
        // Check if the wallet extension is available
        if (typeof window !== 'undefined' && window.midnight && window.midnight.lace) {
            console.log('Midnight Lace wallet detected');
            walletDetected = true;
            
            // Try to restore connection if previously connected
            if (localStorage.getItem('lastConnected') === 'true') {
                try {
                    const isEnabled = await window.midnight.lace.isEnabled();
                    if (isEnabled) {
                        api = await window.midnight.lace.enable();
                        const state = await api.state();
                        connectedAccount = state.address;
                        console.log('Connection restored:', connectedAccount);
                    } else {
                        localStorage.removeItem('lastConnected');
                    }
                } catch (error) {
                    console.error('Failed to restore connection:', error);
                    localStorage.removeItem('lastConnected');
                }
            }
        } else {
            console.warn('Midnight Lace wallet not detected');
        }
    });

    function setPage(page) {
        currentPage = page;
    }

    // Define these functions that are used in the component template
    function handleUpdateAccount(event) {
        connectedAccount = event.detail;
    }

    function handleUpdateApi(event) {
        api = event.detail;
    }
</script>

<div class="bg-gray-900 text-white min-h-screen font-sans">
    <header class="py-4 px-6 border-b border-gray-700 flex justify-between items-center">
        <h1 class="text-2xl font-semibold tracking-tight">LuminaryID</h1>
        <nav class="flex space-x-6">
            <button 
                onclick={() => setPage(ConnectPage)} 
                class="hover:underline focus:outline-none {currentPage === ConnectPage ? 'font-bold' : ''}"
            >
                Connect
            </button>
            <button 
                onclick={() => setPage(IdentityPage)} 
                class="hover:underline focus:outline-none {currentPage === IdentityPage ? 'font-bold' : ''}"
            >
                Identity
            </button>
            <button 
                onclick={() => setPage(VerifyPage)} 
                class="hover:underline focus:outline-none {currentPage === VerifyPage ? 'font-bold' : ''}"
            >
                Verify
            </button>
        </nav>
    </header>
    <main class="p-6">
        {#if currentPage === ConnectPage}
            <ConnectPage 
                connectedAccount={connectedAccount}
                api={api}
                walletDetected={walletDetected}
                updateAccount={handleUpdateAccount}
                updateApi={handleUpdateApi}
            />
        {:else if currentPage === IdentityPage}
            <IdentityPage 
                connectedAccount={connectedAccount}
                api={api}
                walletDetected={walletDetected}
            />
        {:else if currentPage === VerifyPage}
            <VerifyPage 
                connectedAccount={connectedAccount}
                api={api}
                walletDetected={walletDetected}
            />
        {/if}
    </main>
</div>