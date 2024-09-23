export type UIAvailability = {
  id?: string;
  totalSize: number;
  duration: number;
  durationUnit: "hours" | "days" | "months";
  minPrice: number;
  maxCollateral: number;
  totalSizeUnit: "gb" | "tb";
};
