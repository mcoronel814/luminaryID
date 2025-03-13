<script lang="ts">
  import Header from './components/Header.svelte';
  import IdentityForm from './components/IdentityForm.svelte';
  import IdentityCard from './components/IdentityCard.svelte';
  import Loading from './components/Loading.svelte';
  import Notification from './components/Notification.svelte';
  import ConnectPrompt from './components/ConnectPrompt.svelte';
  import DeployContract from './components/DeployContract.svelte';
  import { onMount } from 'svelte';
  
  import { wallet, contract, identities, errorMessage, successMessage, loading } from './lib/store';
  import { initializeMidnight, isWalletConnected } from './lib/midnight';
  import { initializeContract, createIdentity, updateIdentity, revokeIdentity, type IdentityAttribute } from './lib/contract';
  
  let showCreateForm = false;
  let selectedIdentity: any = null;
  let contractAddress: string | null = null;
  
  onMount(async () => {
    // Initialize Midnight settings
    initializeMidnight();
    
    // Check if wallet is already connected
    try {
      const connected = await isWalletConnected();
      
      if (connected) {
        const api = await window.midnight[Object.keys(window.midnight)[0]].enable();
        const state = await api.state();
        
        wallet.set({
          connected: true,
          address: state.address,
          api
        });
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  });
  
  async function handleDeploy(event: CustomEvent) {
    try {
      loading.set(true);
      
      const { deployType, contractAddress: address } = event.detail;
      
      if (!$wallet.api) {
        throw new Error('Wallet not connected');
      }
      
      const contractInstance = await initializeContract($wallet.api, deployType === 'existing' ? address : undefined);
      contract.set(contractInstance);
      
      if (deployType === 'new') {
        successMessage.set('Contract deployed successfully');
      } else {
        successMessage.set('Connected to existing contract successfully');
      }
      
      // Store contract address
      contractAddress = contractInstance.contractAddress;
      
    } catch (error) {
      console.error('Error deploying contract:', error);
      errorMessage.set(`Failed to initialize contract: ${error.message || 'Unknown error'}`);
    } finally {
      loading.set(false);
    }
  }
  
  async function handleCreateIdentity(event: CustomEvent) {
    try {
      loading.set(true);
      
      const { attributes } = event.detail;
      
      if (!$contract) {
        throw new Error('Contract not initialized');
      }
      
      const identityHash = await createIdentity($contract, attributes);
      
      // Add the identity to our local store
      identities.update(ids => {
        return {
          ...ids,
          [identityHash]: {
            hash: identityHash,
            attributes,
            isActive: true
          }
        };
      });
      
      showCreateForm = false;
      successMessage.set('Identity created successfully');
      
    } catch (error) {
      console.error('Error creating identity:', error);
      errorMessage.set(`Failed to create identity: ${error.message || 'Unknown error'}`);
    } finally {
      loading.set(false);
    }
  }
  
  async function handleUpdateIdentity(event: CustomEvent) {
    try {
      loading.set(true);
      
      const { identityHash, attributes } = event.detail;
      
      if (!$contract) {
        throw new Error('Contract not initialized');
      }
      
      await updateIdentity($contract, identityHash, attributes);
      
      // Update the identity in our local store
      identities.update(ids => {
        return {
          ...ids,
          [identityHash]: {
            hash: identityHash,
            attributes,
            isActive: true
          }
        };
      });
      
      selectedIdentity = null;
      successMessage.set('Identity updated successfully');
      
    } catch (error) {
      console.error('Error updating identity:', error);
      errorMessage.set(`Failed to update identity: ${error.message || 'Unknown error'}`);
    } finally {
      loading.set(false);
    }
  }
  
  async function handleRevokeIdentity(event: CustomEvent) {
    try {
      loading.set(true);
      
      const { identityHash } = event.detail;
      
      if (!$contract) {
        throw new Error('Contract not initialized');
      }
      
      await revokeIdentity($contract, identityHash);
      
      // Update the identity in our local store
      identities.update(ids => {
        const identity = ids[identityHash];
        return {
          ...ids,
          [identityHash]: {
            ...identity,
            isActive: false
          }
        };
      });
      
      successMessage.set('Identity revoked successfully');
      
    } catch (error) {
      console.error('Error revoking identity:', error);
      errorMessage.set(`Failed to revoke identity: ${error.message || 'Unknown error'}`);
    } finally {
      loading.set(false);
    }
  }
  
  function showIdentityUpdateForm(event: CustomEvent) {
    selectedIdentity = event.detail.identity;
  }
</script>

<div class="min-h-screen bg-gray-50">
  <Header />
  
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {#if !$wallet.connected}
      <div class="max-w-md mx-auto">
        <ConnectPrompt />
      </div>
    {:else if !$contract}
      <div class="max-w-md mx-auto">
        <DeployContract 
          existingAddress={contractAddress || ''}
          on:deploy={handleDeploy} 
        />
      </div>
    {:else}
      <div class="mb-6 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">Your Identities</h2>
        <button 
          class="btn btn-primary"
          on:click={() => { showCreateForm = true; selectedIdentity = null; }}
        >
          Create New Identity
        </button>
      </div>
      
      {#if showCreateForm}
        <div class="mb-8">
          <IdentityForm on:submit={handleCreateIdentity} />
        </div>
      {:else if selectedIdentity}
        <div class="mb-8">
          <IdentityForm 
            isUpdate={true} 
            identityHash={selectedIdentity.hash}
            initialAttributes={selectedIdentity.attributes}
            on:submit={handleUpdateIdentity}
          />
        </div>
      {/if}
      
      {#if Object.keys($identities).length === 0}
        <div class="bg-white p-6 rounded-lg shadow text-center">
          <p class="text-gray-500">You don't have any identities yet. Create one to get started!</p>
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each Object.values($identities) as identity}
            <IdentityCard 
              identity={identity} 
              on:update={showIdentityUpdateForm}
              on:revoke={handleRevokeIdentity}
            />
          {/each}
        </div>
      {/if}
    {/if}
  </main>
  
  <Loading />
  <Notification />
</div>