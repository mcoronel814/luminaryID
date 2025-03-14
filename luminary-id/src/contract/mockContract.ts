// src/contract/mockContract.ts
export type VerifiedStatus = {
    isVerified: boolean;
  };
  
  export const mockProveOver18 = (age: bigint): VerifiedStatus => {
    return { isVerified: age >= 18n };
  };