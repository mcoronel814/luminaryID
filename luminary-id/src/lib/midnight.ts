import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { NetworkId } from '@midnight-ntwrk/midnight-js-types';
import type { DAppConnectorAPI } from '@midnight-ntwrk/dapp-connector-api';

// Declare window augmentation for TypeScript
declare global {
  interface Window {
    midnight: {
      [key: string]: DAppConnectorAPI;
    };
  }
}

// Set network ID for Testnet
export function initializeMidnight() {
  setNetworkId(NetworkId.TestNet);
}

// Connect to the Midnight Lace wallet
export async function connectToWallet(): Promise<any> {
  try {
    // Find the Lace wallet extension
    const walletKeys = Object.keys(window.midnight || {});
    if (walletKeys.length === 0) {
      throw new Error('No Midnight-compatible wallet found. Please install Lace wallet.');
    }

    // Use the first available wallet (usually Lace)
    const walletKey = walletKeys[0];
    const wallet = window.midnight[walletKey];

    // Request access to the wallet
    const api = await wallet.enable();
    
    return api;
  } catch (error) {
    console.error('Failed to connect to wallet:', error);
    throw error;
  }
}

// Check if wallet is already connected
export async function isWalletConnected(): Promise<boolean> {
  try {
    const walletKeys = Object.keys(window.midnight || {});
    if (walletKeys.length === 0) return false;
    
    const walletKey = walletKeys[0];
    return await window.midnight[walletKey].isEnabled();
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return false;
  }
}

// Get service URI configuration
export async function getServiceUriConfig() {
  try {
    const walletKeys = Object.keys(window.midnight || {});
    if (walletKeys.length === 0) return null;
    
    const walletKey = walletKeys[0];
    return await window.midnight[walletKey].serviceUriConfig();
  } catch (error) {
    console.error('Error getting service URI config:', error);
    return null;
  }
}