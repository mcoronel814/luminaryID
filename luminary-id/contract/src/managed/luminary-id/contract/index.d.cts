import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum VERIFICATION_STATUS { unverified = 0, verified = 1 }

export type Witnesses<T> = {
  get_user_age(context: __compactRuntime.WitnessContext<Ledger, T>): [T, bigint];
  get_secret_key(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
}

export type ImpureCircuits<T> = {
  verify_age(context: __compactRuntime.CircuitContext<T>, min_age_0: bigint): __compactRuntime.CircuitResults<T, []>;
  is_verified(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, boolean>;
}

export type PureCircuits = {
  create_verification_token(sk_0: Uint8Array, instance_0: Uint8Array): Uint8Array;
}

export type Circuits<T> = {
  verify_age(context: __compactRuntime.CircuitContext<T>, min_age_0: bigint): __compactRuntime.CircuitResults<T, []>;
  create_verification_token(context: __compactRuntime.CircuitContext<T>,
                            sk_0: Uint8Array,
                            instance_0: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
  is_verified(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, boolean>;
}

export type Ledger = {
  readonly status: VERIFICATION_STATUS;
  readonly verifierToken: Uint8Array;
  readonly instance: bigint;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<T, W extends Witnesses<T> = Witnesses<T>> {
  witnesses: W;
  circuits: Circuits<T>;
  impureCircuits: ImpureCircuits<T>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<T>): __compactRuntime.ConstructorResult<T>;
}

export declare function ledger(state: __compactRuntime.StateValue): Ledger;
export declare const pureCircuits: PureCircuits;
