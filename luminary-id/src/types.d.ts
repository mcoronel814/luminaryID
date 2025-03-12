declare global {
    interface Window {
      midnight?: {
        lace?: {
          name: string;
          apiVersion: string;
          enable(): Promise<any>;
          isEnabled(): Promise<boolean>;
          serviceUriConfig(): Promise<any>;
        };
        [walletName: string]: {
          name: string;
          apiVersion: string;
          enable(): Promise<any>;
          isEnabled(): Promise<boolean>;
          serviceUriConfig(): Promise<any>;
        };
      };
    }
  }
  
  export {};