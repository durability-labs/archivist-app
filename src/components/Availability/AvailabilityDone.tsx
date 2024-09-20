import {
  Placeholder,
  StepperAction,
} from "@codex-storage/marketplace-ui-components";
import { CircleCheck } from "lucide-react";
import { Dispatch, useEffect } from "react";
import "./AvailabilityDone.css";

type Props = {
  dispatch: Dispatch<StepperAction>;
};

export function AvailabilityDone({ dispatch }: Props) {
  useEffect(() => {
    dispatch({
      isNextEnable: true,
      type: "toggle-next",
    });
  }, [dispatch]);

  return (
    <Placeholder
      Icon={<CircleCheck size="4rem" className="availabilityDone-icon" />}
      className="availabilityDone"
      title="Your availability is created."
      message="The new availability will appear in your availability list. You can safely close this dialog."></Placeholder>
  );
}
