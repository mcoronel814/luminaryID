import { writable, derived } from 'svelte/store';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  coinPublicKey: string | null;
  api: any | null;
  error: string | null;
}

// Create wallet store
const createWalletStore = () => {
  const { subscribe, set, update } = writable<WalletState>({
    isConnected: false,
    address: null,
    coinPublicKey: null,
    api: null,
    error: null
  });

  return {
    subscribe,
    
    // Initialize wallet check
    init: async () => {
      try {
        // Check if wallet is available
        if (!window.midnight?.lace) {
          update(state => ({ ...state, error: 'Lace wallet not found. Please install Lace wallet extension.' }));
          return;
        }
        
        // Check if DApp is already authorized
        const isEnabled = await window.midnight.lace.isEnabled();
        if (isEnabled) {
          // Get wallet API
          const api = await window.midnight.lace.enable();
          // Get wallet state
          const state = await api.state();
          
          // Update store
          set({
            isConnected: true,
            address: state.address,
            coinPublicKey: state.coinPublicKey,
            api,
            error: null
          });
        }
      } catch (error) {
        console.error('Failed to initialize wallet connection:', error);
        update(state => ({ ...state, error: 'Failed to initialize wallet connection.' }));
      }
    },
    
    // Connect to wallet
    connect: async () => {
      try {
        if (!window.midnight?.lace) {
          update(state => ({ ...state, error: 'Lace wallet not found. Please install Lace wallet extension.' }));
          return;
        }
        
        // Request wallet permission
        const api = await window.midnight.lace.enable();
        // Get wallet state
        const state = await api.state();
        
        // Update store
        set({
          isConnected: true,
          address: state.address,
          coinPublicKey: state.coinPublicKey,
          api,
          error: null
        });
      } catch (error) {
        console.error('Failed to connect to wallet:', error);
        update(state => ({ ...state, error: 'Failed to connect to wallet.' }));
      }
    },
    
    // Disconnect from wallet (clear state)
    disconnect: () => {
      set({
        isConnected: false,
        address: null,
        coinPublicKey: null,
        api: null,
        error: null
      });
    }
  };
};

export const walletStore = createWalletStore();

// Derived store for connection status
export const isWalletConnected = derived(
  walletStore,
  $wallet => $wallet.isConnected
);