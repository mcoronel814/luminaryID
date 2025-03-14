export type VerifiedStatus = {
  type?: string;
  isVerified: boolean;
  timestamp: string;
};

export function mockProveOver18(age: bigint): VerifiedStatus {
  const isVerified = age >= 18n;
  return {
    isVerified,
    timestamp: new Date().toLocaleString(),
  };
}

export function mockHasMastersDegree(hasDegree: boolean): VerifiedStatus {
  return {
    isVerified: hasDegree,
    timestamp: new Date().toLocaleString(),
  };
}

export function mockHasVaccination(hasVaccination: boolean): VerifiedStatus {
  return {
    isVerified: hasVaccination,
    timestamp: new Date().toLocaleString(),
  };
}