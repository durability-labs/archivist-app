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
import { Info } from "lucide-react";
import { AvailabilitySpaceAllocation } from "./AvailabilitySpaceAllocation";

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
      <AvailabilitySpaceAllocation availability={availability} space={space} />

      <div className="availabilitConfirm-bottom">
        <div className="availabilitConfirm-iconContainer">
          <Info className="availabilitConfirm-icon" />
        </div>

        <div>
          <b className="availabilitConfirm-subtitle">
            Confirm your new availability
          </b>

          <p className="availabilitConfirm-message">
            By clicking 'Next', you will establish a new availability based on
            the space allocation specified above. Do you want to confirm ?
          </p>
        </div>
      </div>
    </>
  );
}
