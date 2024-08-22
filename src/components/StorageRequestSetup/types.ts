export type StorageDurabilityStepValue = {
  tolerance: number;
  proofProbability: number;
  nodes: number;
};

export type StoragePriceStepValue = {
  reward: number;
  collateral: number;
  expiration: number;
};

export type StorageAvailabilityUnit =
  | "days"
  | "months"
  | "years"
  | "minutes"
  | "hours";

export type StorageAvailabilityValue = {
  value: number;
  unit: StorageAvailabilityUnit;
};
