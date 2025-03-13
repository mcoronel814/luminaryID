import { writable } from 'svelte/store';

interface ContractState {
  address: string | null;
  privateState: any | null;
  isVerified: boolean;
}

// Create contract store
const createContractStore = () => {
  const { subscribe, set, update } = writable<ContractState>({
    address: null,
    privateState: null,
    isVerified: false
  });

  return {
    subscribe,
    
    // Set contract address and initial private state
    setContract: (address: string, privateState: any) => {
      set({
        address,
        privateState,
        isVerified: false
      });
    },
    
    // Update verification status
    setVerified: (isVerified: boolean) => {
      update(state => ({ ...state, isVerified }));
    },
    
    // Clear contract state
    clear: () => {
      set({
        address: null,
        privateState: null,
        isVerified: false
      });
    }
  };
};

export const contractStore = createContractStore();