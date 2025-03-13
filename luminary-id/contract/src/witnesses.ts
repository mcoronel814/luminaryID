import { Bytes } from '@midnight-ntwrk/midnight-js-types';

// Define the private state type for our contract
export type IdentityPrivateState = {
  readonly secretKey: Uint8Array;
  readonly privateAttributes: Map<string, Map<string, string>>; // Maps identity hash to attribute name to value
};

// Create a function to initialize the private state
export const createIdentityPrivateState = (secretKey: Uint8Array): IdentityPrivateState => ({
  secretKey,
  privateAttributes: new Map()
});

// Function to store a private attribute
export const storePrivateAttribute = (
  state: IdentityPrivateState,
  identityHash: string,
  name: string,
  value: string
): IdentityPrivateState => {
  const newPrivateAttributes = new Map(state.privateAttributes);
  
  if (!newPrivateAttributes.has(identityHash)) {
    newPrivateAttributes.set(identityHash, new Map());
  }
  
  const identityAttributes = new Map(newPrivateAttributes.get(identityHash));
  identityAttributes.set(name, value);
  newPrivateAttributes.set(identityHash, identityAttributes);
  
  return {
    ...state,
    privateAttributes: newPrivateAttributes
  };
};

// Implementation of witness functions required by the contract
export const witnesses = {
  local_secret_key: ({ privateState }: { privateState: IdentityPrivateState }): [IdentityPrivateState, Uint8Array] => [
    privateState,
    privateState.secretKey
  ]
};