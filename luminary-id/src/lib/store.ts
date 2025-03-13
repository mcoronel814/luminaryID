import { writable } from 'svelte/store';

// Store for wallet connection status
export const wallet = writable<{
  connected: boolean;
  address: string | null;
  api: any | null;
}>({
  connected: false,
  address: null,
  api: null,
});

// Store for contract instance
export const contract = writable<any | null>(null);

// Store for identities
export const identities = writable<{
  [key: string]: {
    hash: string;
    attributes: Array<{
      name: string;
      value: string;
      isPublic: boolean;
    }>;
    isActive: boolean;
  };
}>({});

// Store for error messages
export const errorMessage = writable<string | null>(null);

// Store for success messages
export const successMessage = writable<string | null>(null);

// Store for loading state
export const loading = writable<boolean>(false);