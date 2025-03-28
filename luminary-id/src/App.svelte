<script lang="ts">
  // Removed unused onMount import
  import type { DAppConnectorWalletAPI, DAppConnectorWalletState, ServiceUriConfig } from '@midnight-ntwrk/dapp-connector-api';
  import { sha256 } from '@noble/hashes/sha256';
  import { bytesToHex as toHex } from '@noble/hashes/utils';

  // --- Mock Data Types ---
  type MockIdentityData = {
      dobCommitment: string;
      countryCommitment: string;
  };
  type MockLedgerState = Map<string, MockIdentityData>;
  type MockNonceStore = Map<string, string>; // Key: `${pubId}-${attributeName}`

  // --- Component State ---
  let walletApi: DAppConnectorWalletAPI | null = null;
  let walletState: DAppConnectorWalletState | null = null;
  let serviceUris: ServiceUriConfig | null = null;
  let connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error' = 'disconnected';
  let errorMessage: string | null = null;
  let userSecretKeyInput: string = '';
  let userPublicId: string | null = null;
  let appStatus: string = ''; // General status/feedback message

  // Loading states for actions
  let isConnecting: boolean = false;
  let isRegistering: boolean = false;
  let isUpdating: boolean = false; // Can be generic or specific per button if needed
  let isProving: boolean = false;

  // Mock Ledger & Nonce Store
  let mockLedger: MockLedgerState = new Map();
  let mockNonceStore: MockNonceStore = new Map();

  // Input fields
  let dobInput: string = '';
  let countryInput: string = '';
  let attributeToProve: 'dob' | 'country' = 'dob';
  let valueToProve: string = '';

  // Reactive calculation for button disabling during any operation
  $: isBusy = isConnecting || isRegistering || isUpdating || isProving;

  // --- Mock Functions ---
  // mockEnableWallet, mockGetServiceUris, mockDerivePublicId, mockPersistentCommit, mockGenerateNonce
  // remain the same...
  const mockEnableWallet = async (): Promise<DAppConnectorWalletAPI> => { /* ... (implementation unchanged) ... */
    console.log("Mock: Requesting wallet connection...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Mock: Wallet connected!");
    return { /* ... mock API object ... */
        state: async () => {
            console.log("Mock: Fetching wallet state..."); await new Promise(resolve => setTimeout(resolve, 300));
            const mockState: DAppConnectorWalletState = { address: '...', coinPublicKey: '...', encryptionPublicKey: '...'};
            walletState = mockState; return mockState;
        },
        balanceAndProveTransaction: async (tx: any, newCoins?: any) => {
            console.log("Mock: Balancing and proving transaction...", tx); await new Promise(resolve => setTimeout(resolve, 2000));
            if (Math.random() < 0.1) { throw new Error("Mock proof generation failed!"); }
            console.log("Mock: Transaction balanced and proven."); return { ...tx, mockProof: '...' };
        },
        submitTransaction: async (tx: any) => {
            console.log("Mock: Submitting transaction...", tx); await new Promise(resolve => setTimeout(resolve, 1500));
             if (Math.random() < 0.1) { throw new Error("Mock transaction submission failed!"); }
            console.log("Mock: Transaction submitted successfully!"); return `mock-tx-id-${Date.now()}`;
        },
        balanceTransaction: async (tx: any, newCoins?: any) => { throw new Error("balanceTransaction deprecated"); },
        proveTransaction: async (recipe: any) => { throw new Error("proveTransaction deprecated"); },
    };
   };
  const mockGetServiceUris = async (): Promise<ServiceUriConfig> => { /* ... (implementation unchanged) ... */
      console.log("Mock: Fetching service URIs..."); await new Promise(resolve => setTimeout(resolve, 200));
      const mockUris: ServiceUriConfig = { indexerUri: '...', indexerWsUri: '...', proverServerUri: '...', substrateNodeUri: '...' };
      serviceUris = mockUris; return mockUris;
   };
  const mockDerivePublicId = (secretKey: string): string => { /* ... (implementation unchanged) ... */
      const hash = sha256(`LuminaryID:pubId:${secretKey}`); return toHex(hash);
   };
  const mockPersistentCommit = (value: string, nonce: string): string => { /* ... (implementation unchanged) ... */
      console.log(`Mock Commit: Hashing value="${value}" with nonce="${nonce}"`); const hash = sha256(`${value}-${nonce}`); return toHex(hash);
   };
  const mockGenerateNonce = (): string => { /* ... (implementation unchanged) ... */
      return toHex(crypto.getRandomValues(new Uint8Array(32)));
   };


  // --- Event Handlers ---
  const handleConnectWallet = async () => {
    isConnecting = true; // Set loading state
    connectionStatus = 'connecting';
    errorMessage = null;
    appStatus = '';
    try {
      const api = await mockEnableWallet();
      walletApi = api;
      await walletApi.state();
      await mockGetServiceUris();
      connectionStatus = 'connected';
    } catch (error) {
      console.error("Connection failed:", error);
      errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet.';
      connectionStatus = 'error';
      walletApi = null; walletState = null; serviceUris = null;
    } finally {
        isConnecting = false; // Clear loading state
    }
   };

  const handleRegister = async () => {
      if (!walletApi || !userSecretKeyInput || !dobInput || !countryInput) {
          appStatus = 'Error: Missing inputs.'; return;
      };
      isRegistering = true; // Set loading state
      appStatus = 'Registering...';
      try {
          // ... (logic from previous step remains the same) ...
          const currentPubId = mockDerivePublicId(userSecretKeyInput);
          userPublicId = currentPubId;
          if (mockLedger.has(currentPubId)) { throw new Error(`Identity already registered (Mock ID: ${currentPubId}).`); }
          const dobValue = dobInput; const countryValue = countryInput;
          const dobNonce = mockGenerateNonce(); const countryNonce = mockGenerateNonce();
          mockNonceStore.set(`${currentPubId}-dob`, dobNonce);
          mockNonceStore.set(`${currentPubId}-country`, countryNonce);
          mockNonceStore = mockNonceStore;
          const dobCommit = mockPersistentCommit(dobValue, dobNonce);
          const countryCommit = mockPersistentCommit(countryValue, countryNonce);
          const newData: MockIdentityData = { dobCommitment: dobCommit, countryCommitment: countryCommit };
          const mockTx = { type: 'registerIdentityCall', derivedPubId: currentPubId, identityDataToStore: newData };
          const balancedProvenTx = await walletApi.balanceAndProveTransaction(mockTx);
          const txId = await walletApi.submitTransaction(balancedProvenTx);
          mockLedger.set(currentPubId, newData); mockLedger = mockLedger;
          appStatus = `Success! Registered Identity. Mock Tx ID: ${txId}`; // More explicit success
          console.log("Mock Register: Updated mock ledger:", mockLedger);
          console.log("Mock Register: Updated mock nonce store:", mockNonceStore);
      } catch (error) {
          console.error("Mock Registration failed:", error);
          appStatus = error instanceof Error ? `Error: ${error.message}` : 'Registration failed.';
      } finally {
          isRegistering = false; // Clear loading state
      }
  };

   const handleUpdateAttribute = async (attributeName: 'dob' | 'country') => {
       if (!walletApi || !userSecretKeyInput) {
            appStatus = 'Error: Please enter secret key first.'; return;
       }
       const currentPubId = mockDerivePublicId(userSecretKeyInput);
       userPublicId = currentPubId;
       const newValue = attributeName === 'country' ? countryInput : dobInput;
       if (!newValue) {
           appStatus = `Error: Please enter the new value for ${attributeName}.`; return;
       }

       isUpdating = true; // Set loading state
       console.log(`Mock Update: Attribute ${attributeName} for ${currentPubId} to new value "${newValue}"`);
       appStatus = `Updating ${attributeName}...`;

       try {
           if (!mockLedger.has(currentPubId)) { throw new Error(`Identity not found (Mock ID: ${currentPubId}).`); }
           // ... (rest of update logic: generate nonce, store nonce, commit, build tx, submit) ...
           const newNonce = mockGenerateNonce();
           mockNonceStore.set(`${currentPubId}-${attributeName}`, newNonce); mockNonceStore = mockNonceStore;
           const newCommit = mockPersistentCommit(newValue, newNonce);
           const currentData = mockLedger.get(currentPubId)!;
           let updatedData: MockIdentityData = {...currentData};
           if (attributeName === 'dob') { updatedData.dobCommitment = newCommit; }
           else if (attributeName === 'country') { updatedData.countryCommitment = newCommit; }
           const mockTx = { type: 'updateAttributeCall', derivedPubId: currentPubId, attributeName, updatedData };
           const balancedProvenTx = await walletApi.balanceAndProveTransaction(mockTx);
           const txId = await walletApi.submitTransaction(balancedProvenTx);
           mockLedger.set(currentPubId, updatedData); mockLedger = mockLedger;
           appStatus = `Success! Updated ${attributeName}. Mock Tx ID: ${txId}`; // More explicit success
           console.log("Mock Update: Updated mock ledger:", mockLedger);
           console.log("Mock Update: Updated mock nonce store:", mockNonceStore);

       } catch (error) {
            console.error("Mock Update failed:", error);
            appStatus = error instanceof Error ? `Error: ${error.message}` : 'Update failed.';
       } finally {
           isUpdating = false; // Clear loading state
       }
   };

   const handleProveAttribute = async () => {
       if (!walletApi || !userSecretKeyInput) {
            appStatus = 'Error: Please enter secret key first.'; return;
       }
       if (!valueToProve) {
           appStatus = `Error: Please enter the value to prove ${attributeToProve} equals.`; return;
       }
       const currentPubId = mockDerivePublicId(userSecretKeyInput);
       userPublicId = currentPubId;

       isProving = true; // Set loading state
       console.log(`Mock Prove: Attribute ${attributeToProve} == ${valueToProve} for ${currentPubId}`);
       appStatus = `Generating proof for ${attributeToProve}...`;

       let proofResult: boolean | undefined = undefined; // To store result

       try {
           // ... (rest of proof logic: check existence, get commitment, get value/nonce, check commitment, check value) ...
           if (!mockLedger.has(currentPubId)) { throw new Error(`Identity not found (Mock ID: ${currentPubId}).`); }
           const currentData = mockLedger.get(currentPubId)!;
           const expectedCommitment = attributeToProve === 'dob' ? currentData.dobCommitment : currentData.countryCommitment;
           if (!expectedCommitment) { throw new Error(`Commitment for ${attributeToProve} not found.`); }
           const actualValue = attributeToProve === 'dob' ? dobInput : countryInput; // Assumes UI holds original
           const nonceKey = `${currentPubId}-${attributeToProve}`;
           const actualNonce = mockNonceStore.get(nonceKey);
           if (!actualNonce) { throw new Error(`Mock Error: Cannot retrieve original nonce for ${attributeToProve} (key: ${nonceKey}).`); }
           const calculatedCommitment = mockPersistentCommit(actualValue, actualNonce);
           const commitmentCheck = (calculatedCommitment === expectedCommitment);
           const valueCheck = (actualValue === valueToProve);
           proofResult = commitmentCheck && valueCheck; // Store result
           console.log(`Mock Prove: Commitment Check: ${commitmentCheck}, Value Check: ${valueCheck}, Final Proof Result: ${proofResult}`);
           if (!commitmentCheck) { console.error("Mock Prove Error: Calculated commit != stored commit."); }

           // Simulate transaction
           const mockTx = { type: 'proveAttributeCall', derivedPubId: currentPubId, attributeName: attributeToProve, valueProven: valueToProve, proofResult };
           const balancedProvenTx = await walletApi.balanceAndProveTransaction(mockTx); // Includes mock proof time
           const txId = await walletApi.submitTransaction(balancedProvenTx);

           appStatus = `Success! Proof submitted (Mock Tx ID: ${txId}). Verified: ${proofResult}`;
           valueToProve = ''; // Clear input on success

       } catch(error) {
           console.error("Mock Prove failed:", error);
           appStatus = error instanceof Error ? `Error: ${error.message}` : `Proof generation failed.`;
           // Don't clear valueToProve on error
       } finally {
           isProving = false; // Clear loading state
       }
   };

</script>

<main class="container mx-auto p-4 font-sans bg-gray-900 text-gray-100 min-h-screen">
  <header class="mb-8">
    <h1 class="text-4xl font-bold text-center text-purple-400">LuminaryID PoC</h1>
    <p class="text-center text-gray-400">Privacy-Preserving Identity on Mocked Midnight</p>
    {#if appStatus}
        <p class="text-center mt-4 p-3 rounded text-sm shadow"
           class:bg-green-800={appStatus.startsWith('Success')}
           class:text-green-200={appStatus.startsWith('Success')}
           class:bg-red-800={appStatus.startsWith('Error')}
           class:text-red-200={appStatus.startsWith('Error')}
           class:bg-blue-800={!appStatus.startsWith('Success') && !appStatus.startsWith('Error')}
           class:text-blue-200={!appStatus.startsWith('Success') && !appStatus.startsWith('Error')}
           >
           {#if isBusy} <span class="inline-block animate-spin mr-2">⏳</span> {/if} {appStatus}
        </p>
    {/if}
  </header>

  <section class="mb-6 p-4 bg-gray-800 rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold mb-3 text-purple-300">Wallet Connection</h2>
    {#if connectionStatus === 'disconnected'}
      <button on:click={handleConnectWallet} disabled={isBusy} class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed">
        {#if isConnecting}Connecting...{:else}Connect Mock Wallet{/if}
      </button>
    {:else if connectionStatus === 'connecting'}
      <p class="text-yellow-400"><span class="inline-block animate-spin mr-2">⏳</span> Connecting...</p>
    {:else if connectionStatus === 'connected' && walletState}
      <p class="text-green-400">Wallet Connected!</p>
      <div class="mt-2 text-sm bg-gray-700 p-2 rounded">
        <p>Address: <span class="font-mono break-all">{walletState.address}</span></p>
        {#if serviceUris} <p class="mt-1">Node: <span class="font-mono">{serviceUris.substrateNodeUri}</span></p> {/if}
      </div>
    {:else if connectionStatus === 'error'}
      <p class="text-red-500">Connection Error: {errorMessage}</p>
      <button on:click={handleConnectWallet} disabled={isBusy} class="mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed">
         {#if isConnecting}Connecting...{:else}Retry Connection{/if}
      </button>
    {/if}
  </section>

  {#if connectionStatus === 'connected'}
    <section class="mb-6 p-4 bg-gray-800 rounded-lg shadow-md">
       <h2 class="text-2xl font-semibold mb-3 text-purple-300">Identity Management</h2>
       <div class="mb-4">
         <label for="secretKey" class="block text-sm font-medium text-gray-300 mb-1">Enter Mock Secret Key (e.g., 'mysecret'):</label>
         <input type="password" id="secretKey" bind:value={userSecretKeyInput} class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-purple-500 focus:border-purple-500">
         {#if userSecretKeyInput} <p class="text-xs text-gray-400 mt-1">Mock Public ID: <span class="font-mono break-all">{mockDerivePublicId(userSecretKeyInput)}</span></p> {/if}
       </div>
       <div class="mb-4 p-3 border border-gray-700 rounded">
          <h3 class="text-lg font-medium mb-2 text-purple-200">Register / View Current Values</h3>
          <p class="text-xs text-gray-400 mb-2">Enter values here to register OR to use them for generating proofs later.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div> <label for="dob" class="block text-sm font-medium text-gray-300 mb-1">Date of Birth (YYYYMMDD):</label> <input type="text" id="dob" bind:value={dobInput} class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"> </div>
              <div> <label for="country" class="block text-sm font-medium text-gray-300 mb-1">Country (e.g., US):</label> <input type="text" id="country" bind:value={countryInput} class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"> </div>
          </div>
          <button on:click={handleRegister} disabled={isBusy || !userSecretKeyInput || !dobInput || !countryInput} class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed">
            {#if isRegistering}Registering...{:else}Register Identity (Mock){/if}
          </button>
       </div>
       <div class="mb-4 p-3 border border-gray-700 rounded">
          <h3 class="text-lg font-medium mb-2 text-purple-200">Update Attribute</h3>
          <p class="text-xs text-gray-400 mb-2">Enter the new value in the fields above first.</p>
          <div class="flex gap-4">
              <button on:click={() => handleUpdateAttribute('dob')} disabled={isBusy || !userSecretKeyInput || !dobInput} class="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                 {#if isUpdating}Updating...{:else}Update DOB (Mock){/if}
              </button>
              <button on:click={() => handleUpdateAttribute('country')} disabled={isBusy || !userSecretKeyInput || !countryInput} class="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                 {#if isUpdating}Updating...{:else}Update Country (Mock){/if}
              </button>
          </div>
       </div>
       <div class="mb-4 p-3 border border-gray-700 rounded">
          <h3 class="text-lg font-medium mb-2 text-purple-200">Prove Attribute Value</h3>
           <p class="text-xs text-gray-400 mb-2">Assumes values entered above are the ones currently committed on the mock ledger.</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div> <label for="proveAttr" class="block text-sm font-medium text-gray-300 mb-1">Attribute:</label> <select id="proveAttr" bind:value={attributeToProve} class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"> <option value="dob">Date of Birth</option> <option value="country">Country</option> </select> </div>
              <div> <label for="proveValue" class="block text-sm font-medium text-gray-300 mb-1">Value It Equals:</label> <input type="text" id="proveValue" bind:value={valueToProve} class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"> </div>
              <div> <button on:click={handleProveAttribute} disabled={isBusy || !userSecretKeyInput || !valueToProve} class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 md:mt-6 disabled:cursor-not-allowed">
                 {#if isProving}Proving...{:else}Generate Proof (Mock){/if}
               </button> </div>
          </div>
       </div>
       <div class="mt-6 p-4 bg-gray-700 rounded"> /* ... (Ledger Display unchanged) ... */ </div>
        <div class="mt-6 p-4 bg-gray-600 rounded"> /* ... (Nonce Store Display unchanged) ... */ </div>
    </section>
  {/if}
</main>