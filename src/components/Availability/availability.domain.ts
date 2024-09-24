import { CodexNodeSpace } from "@codex-storage/sdk-js";
import { GB, TB } from "../../utils/constants";
import { AvailabilityState } from "./types";

export const availabilityUnit = (unit: "gb" | "tb") =>
  unit === "gb" ? GB : TB;

export const availabilityMax = (space: CodexNodeSpace, unit: "gb" | "tb") => {
  const bytes = availabilityUnit(unit);
  return space.quotaMaxBytes / bytes - space.quotaReservedBytes / bytes;
};

export const isAvailabilityValid = (
  totalSize: string | number,
  max: number
) => {
  const size = parseFloat(totalSize.toString());

  return size > 0 && size <= max;
};
