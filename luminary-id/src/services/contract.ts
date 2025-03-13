import { walletStore } from '../stores/wallet';
import { get } from 'svelte/store';
import { contractStore } from '../stores/contract';
import { randomBytes } from '../lib/utils';
import { 
  deployContract, 
  findDeployedContract,
  Contract 
} from '@midnight-ntwrk/midnight-js-contracts';
import { setNetworkId, NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';

// Import the actual compiled contract files using the correct path
import { 
  Contract as LuminaryContract,
  VERIFICATION_STATUS
} from '../../contract/src/managed/luminary-id/contract';

// Import witnesses from the witnesses.ts file
import { witnesses } from '../../contract/src/witnesses';

// Import the private state helper
import { createLuminaryIDPrivateState } from '../lib/privateState';

// Create contract instance
const luminaryContractInstance = new LuminaryContract(witnesses);

// Configure providers
const configureProviders = async (walletState) => {
  // Set network ID to TestNet
  setNetworkId(NetworkId.TestNet);
  
  try {
    // Get service URIs from Lace wallet
    const serviceConfig = await window.midnight.lace.serviceUriConfig();
    
    return {
      privateStateProvider: levelPrivateStateProvider({
        privateStateStoreName: 'luminaryIDPrivateState',
      }),
      publicDataProvider: indexerPublicDataProvider(
        serviceConfig.indexerUri,
        serviceConfig.indexerWsUri
      ),
      zkConfigProvider: new NodeZkConfigProvider('luminary-id'),
      proofProvider: httpClientProofProvider(serviceConfig.proverServerUri),
      walletProvider: {
        coinPublicKey: walletState.coinPublicKey,
        balanceTx: async (tx, newCoins) => {
          return walletState.api.balanceAndProveTransaction(tx, newCoins);
        }
      },
      midnightProvider: {
        submitTx: async (tx) => {
          return walletState.api.submitTransaction(tx);
        }
      }
    };
  } catch (error) {
    console.error('Error configuring providers:', error);
    throw error;
  }
};

// Service for interacting with the LuminaryID contract
export const contractService = {
  // Deploy a new contract instance
  deployContract: async (age: number) => {
    try {
      const walletState = get(walletStore);
      
      if (!walletState.isConnected || !walletState.api) {
        throw new Error('Wallet not connected');
      }
      
      // Generate a random secret key for the user's identity
      const secretKey = randomBytes(32);
      
      // Create an initial private state with the user's age and secret key
      const initialPrivateState = createLuminaryIDPrivateState(age, secretKey);
      
      // Configure providers
      const providers = await configureProviders(walletState);
      
      // Deploy contract
      const deployedContract = await deployContract(providers, {
        contract: luminaryContractInstance as any,
        privateStateKey: 'luminaryIDPrivateState',
        initialPrivateState
      });
      
      // Update contract store with new contract address
      contractStore.setContract(deployedContract.contractAddress, initialPrivateState);
      
      return deployedContract.finalizedDeployTxData.txHash;
    } catch (error) {
      console.error('Failed to deploy contract:', error);
      throw error;
    }
  },
  
  // Verify the user's age against a minimum age requirement
  verifyAge: async (minAge: number) => {
    try {
      const walletState = get(walletStore);
      const contractState = get(contractStore);
      
      if (!walletState.isConnected || !walletState.api) {
        throw new Error('Wallet not connected');
      }
      
      if (!contractState.address) {
        throw new Error('No contract deployed');
      }
      
      // Configure providers
      const providers = await configureProviders(walletState);
      
      // Find deployed contract
      const deployedContract = await findDeployedContract(providers, {
        contractAddress: contractState.address,
        contract: luminaryContractInstance as any,
        privateStateKey: 'luminaryIDPrivateState',
        initialPrivateState: contractState.privateState
      });
      
      // Call verify_age circuit
      const txData = await deployedContract.callTx.verify_age(BigInt(minAge));
      
      return txData.txHash;
    } catch (error) {
      console.error('Failed to verify age:', error);
      throw error;
    }
  },
  
  // Check if the user is verified
  checkVerification: async () => {
    try {
      const walletState = get(walletStore);
      const contractState = get(contractStore);
      
      if (!walletState.isConnected || !walletState.api) {
        throw new Error('Wallet not connected');
      }
      
      if (!contractState.address) {
        throw new Error('No contract deployed');
      }
      
      // Configure providers
      const providers = await configureProviders(walletState);
      
      // Find deployed contract
      const deployedContract = await findDeployedContract(providers, {
        contractAddress: contractState.address,
        contract: luminaryContractInstance as any,
        privateStateKey: 'luminaryIDPrivateState',
        initialPrivateState: contractState.privateState
      });
      
      // Call is_verified circuit
      const result = await deployedContract.callTx.is_verified();
      
      return result.result;
    } catch (error) {
      console.error('Failed to check verification:', error);
      throw error;
    }
  }
};