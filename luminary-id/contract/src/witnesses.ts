import { WitnessContext } from '@midnight-ntwrk/midnight-js-types';
import { Ledger } from '../managed/luminary-id/contract';

// Define the private state structure
export type LuminaryIDPrivateState = {
  readonly age: number;
  readonly secretKey: Uint8Array;
};

// Helper function to create private state
export const createLuminaryIDPrivateState = (age: number, secretKey: Uint8Array) => ({
  age,
  secretKey,
});

// Implement witnesses
export const witnesses = {
  get_user_age: ({ privateState }: WitnessContext<Ledger, LuminaryIDPrivateState>): [LuminaryIDPrivateState, bigint] => [
    privateState,
    BigInt(privateState.age),
  ],
  
  get_secret_key: ({ privateState }: WitnessContext<Ledger, LuminaryIDPrivateState>): [LuminaryIDPrivateState, Uint8Array] => [
    privateState,
    privateState.secretKey,
  ],
};