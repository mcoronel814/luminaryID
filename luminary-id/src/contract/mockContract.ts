// Define the return type for our verifications
export type VerifiedStatus = {
  isVerified: boolean;
  timestamp: string;
  type: string; // To tell apart age, education, and medical
};

// Existing age verification
export const mockProveOver18 = (age: bigint): VerifiedStatus => {
  const isVerified = age >= 18n;
  const timestamp = new Date().toISOString();
  return { isVerified, timestamp, type: 'Age' };
};

// New education verification
export const mockHasMastersDegree = (hasDegree: boolean): VerifiedStatus => {
  const isVerified = hasDegree;
  const timestamp = new Date().toISOString();
  return { isVerified, timestamp, type: 'Education' };
};

// New medical verification
export const mockHasVaccination = (hasVaccination: boolean): VerifiedStatus => {
  const isVerified = hasVaccination;
  const timestamp = new Date().toISOString();
  return { isVerified, timestamp, type: 'Medical' };
};