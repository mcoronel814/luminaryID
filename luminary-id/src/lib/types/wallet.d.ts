// Type definitions for Lace wallet integration
declare global {
    interface Window {
      midnight?: {
        lace?: {
          apiVersion: string;
          enable: () => Promise<LaceWalletAPI>;
          isEnabled: () => Promise<boolean>;
          name: string;
          serviceUriConfig: () => Promise<ServiceUriConfig>;
        };
      };
    }
  }
  
  interface ServiceUriConfig {
    indexerUri: string;
    indexerWsUri: string;
    proverServerUri: string;
    substrateNodeUri: string;
  }
  
  interface LaceWalletState {
    address: string;
    coinPublicKey: string;
    encryptionPublicKey: string;
  }
  
  interface LaceWalletAPI {
    state: () => Promise<LaceWalletState>;
    balanceAndProveTransaction: (transaction: any, newCoins?: any[]) => Promise<any>;
    submitTransaction: (transaction: any) => Promise<string>;
  }
  
  export {};