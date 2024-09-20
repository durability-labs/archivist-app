import {
  SpaceAllocation,
  StepperAction,
} from "@codex-storage/marketplace-ui-components";
import { Dispatch, useEffect } from "react";
import "./AvailabilityForm.css";
import { CodexNodeSpace } from "@codex-storage/sdk-js";
import { UIAvailability } from "./types";
import { GB, TB } from "../../utils/constants";
import "./AvailabilityConfirm.css";

type Props = {
  dispatch: Dispatch<StepperAction>;
  space: CodexNodeSpace;
  availability: UIAvailability;
  enableNext?: boolean;
};

export function AvailabilityConfirm({
  availability,
  dispatch,
  space,
  enableNext = true,
}: Props) {
  useEffect(() => {
    if (enableNext) {
      dispatch({ type: "toggle-next", isNextEnable: true });
    }
  }, [dispatch, enableNext]);

  const unit = availability.totalSizeUnit === "gb" ? GB : TB;
  const { quotaMaxBytes, quotaReservedBytes } = space;
  const size = availability.totalSize * unit;
  const isUpdating = !!availability.id;
  const allocated = isUpdating ? quotaReservedBytes - size : quotaReservedBytes;
  const remaining = quotaMaxBytes - allocated - size;

  const spaceData = [
    {
      title: "Space allocated",
      size: allocated,
    },
    {
      title: "New space allocation",
      size: size,
    },
    {
      title: "Remaining space",
      size: remaining < 0 ? 0 : remaining,
    },
  ];

  return (
    <>
      <b className="availabilitConfirm-title">Node space allocation</b>

      <SpaceAllocation data={spaceData} />
    </>
  );
}
