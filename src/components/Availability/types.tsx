import {
  StepperAction,
  StepperState,
} from "@durability-labs/archivist-app-components";
import {
  ArchivistAvailability,
  ArchivistNodeSpace,
  ArchivistReservation,
} from "@durability-labs/archivist-sdk-js";
import { Dispatch } from "react";

export type AvailabilityState = {
  id?: string;
  totalSize: number;
  duration: number;
  durationUnit: "hours" | "days" | "months";
  minPricePerBytePerSecond: number;
  totalCollateral: number;
  totalSizeUnit: "gb" | "tb";
  name?: string;
};

export type AvailabilityComponentProps = {
  dispatch: Dispatch<StepperAction>;
  state: StepperState;
  space: ArchivistNodeSpace;
  onAvailabilityChange: (data: Partial<AvailabilityState>) => void;
  availability: AvailabilityState;
  error: Error | null;
  editAvailabilityValue?: number;
};

export type AvailabilityWithSlots = ArchivistAvailability & {
  name: string;
  slots: ArchivistReservation[];
};
