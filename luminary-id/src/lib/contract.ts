import { findDeployedContract, deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { Bytes } from '@midnight-ntwrk/midnight-js-types';
import { createIdentityPrivateState, witnesses } from '../../contract/src/witnesses';

// Contract instance
import { Contract } from '../../contract/src/managed/identity/contract';

// Type for Identity Attribute
export type IdentityAttribute = {
  name: string;
  value: string;
  isPublic: boolean;
};

// Identity interface
export interface Identity {
  hash: string;
  attributes: IdentityAttribute[];
  isActive: boolean;
}

// Initialize a contract connection
export async function initializeContract(walletApi: any, contractAddress?: string) {
  try {
    // Get service URIs from wallet
    const state = await walletApi.state();
    const walletAddress = state.address;
    
    // Configure providers
    const providers = {
      privateStateProvider: levelPrivateStateProvider({
        privateStateStoreName: 'luminaryIdentityPrivateState'
      }),
      publicDataProvider: indexerPublicDataProvider(
        'https://indexer.testnet-02.midnight.network/api/v1/graphql',
        'wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws'
      ),
      zkConfigProvider: new NodeZkConfigProvider('../../contract/src/managed/identity/keys'),
      proofProvider: httpClientProofProvider('http://localhost:6300'),
      walletProvider: {
        coinPublicKey: state.coinPublicKey,
        balanceTx: walletApi.balanceAndProveTransaction
      },
      midnightProvider: {
        submitTx: walletApi.submitTransaction
      }
    };

    const contract = new Contract(witnesses);
    
    // Create a random secret key for the identity privateState
    const secretKey = crypto.getRandomValues(new Uint8Array(32));
    const initialPrivateState = createIdentityPrivateState(secretKey);

    if (contractAddress) {
      // Find existing contract
      return await findDeployedContract(providers, {
        contractAddress,
        contract,
        privateStateKey: 'identityPrivateState',
        initialPrivateState
      });
    } else {
      // Deploy new contract
      return await deployContract(providers, {
        contract,
        privateStateKey: 'identityPrivateState',
        initialPrivateState
      });
    }
  } catch (error) {
    console.error('Failed to initialize contract:', error);
    throw error;
  }
}

// Create a new identity
export async function createIdentity(contract: any, attributes: IdentityAttribute[]) {
  try {
    // Convert attributes to format expected by contract
    const attributesForContract = attributes.map(attr => ({
      name: new TextEncoder().encode(attr.name.padEnd(32, '\0')),
      value: new TextEncoder().encode(attr.value.padEnd(64, '\0')),
      isPublic: attr.isPublic
    }));
    
    // Fill the array to length 10 with empty attributes
    while (attributesForContract.length < 10) {
      attributesForContract.push({
        name: new TextEncoder().encode(''.padEnd(32, '\0')),
        value: new TextEncoder().encode(''.padEnd(64, '\0')),
        isPublic: false
      });
    }
    
    // Call the contract function
    const tx = await contract.callTx.createIdentity(attributesForContract);
    return tx.public.result; // The identity hash
  } catch (error) {
    console.error('Failed to create identity:', error);
    throw error;
  }
}

// Update an identity
export async function updateIdentity(contract: any, identityHash: string, attributes: IdentityAttribute[]) {
  try {
    // Convert attributes to format expected by contract
    const attributesForContract = attributes.map(attr => ({
      name: new TextEncoder().encode(attr.name.padEnd(32, '\0')),
      value: new TextEncoder().encode(attr.value.padEnd(64, '\0')),
      isPublic: attr.isPublic
    }));
    
    // Fill the array to length 10 with empty attributes
    while (attributesForContract.length < 10) {
      attributesForContract.push({
        name: new TextEncoder().encode(''.padEnd(32, '\0')),
        value: new TextEncoder().encode(''.padEnd(64, '\0')),
        isPublic: false
      });
    }
    
    // Call the contract function
    const tx = await contract.callTx.updateIdentity(
      new TextEncoder().encode(identityHash),
      attributesForContract
    );
    return tx;
  } catch (error) {
    console.error('Failed to update identity:', error);
    throw error;
  }
}

// Revoke an identity
export async function revokeIdentity(contract: any, identityHash: string) {
  try {
    const tx = await contract.callTx.revokeIdentity(
      new TextEncoder().encode(identityHash)
    );
    return tx;
  } catch (error) {
    console.error('Failed to revoke identity:', error);
    throw error;
  }
}

// Verify an identity
export async function verifyIdentity(contract: any, identityHash: string) {
  try {
    const tx = await contract.callTx.verifyIdentity(
      new TextEncoder().encode(identityHash)
    );
    return tx.public.result; // Boolean indicating if identity is valid
  } catch (error) {
    console.error('Failed to verify identity:', error);
    return false;
  }
}

// Get a public attribute
export async function getPublicAttribute(contract: any, identityHash: string, attributeName: string) {
  try {
    const tx = await contract.callTx.getPublicAttribute(
      new TextEncoder().encode(identityHash),
      new TextEncoder().encode(attributeName.padEnd(32, '\0'))
    );
    
    // Check if attribute exists and is valid
    if (tx.public.result.is_some) {
      return new TextDecoder().decode(tx.public.result.value).trim();
    }
    return null;
  } catch (error) {
    console.error('Failed to get public attribute:', error);
    return null;
  }
}