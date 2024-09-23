import { StepperAction } from "@codex-storage/marketplace-ui-components";
import { Dispatch, useEffect } from "react";
import "./AvailabilityForm.css";
import { CodexNodeSpace } from "@codex-storage/sdk-js";
import { UIAvailability } from "./types";
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
