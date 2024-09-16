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

export type AvailabilityUnit =
  | "days"
  | "months"
  | "years"
  | "minutes"
  | "hours";

export type StorageRequestCriteria = {
  availability: number;
  availabilityUnit: AvailabilityUnit;
  tolerance: number;
  proofProbability: number;
  nodes: number;
  reward: number;
  collateral: number;
  expiration: number;
};
