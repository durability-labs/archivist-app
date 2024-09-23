import {
  Placeholder,
  StepperAction,
} from "@codex-storage/marketplace-ui-components";
import { Dispatch, useEffect } from "react";
import { SuccessIcon } from "../SuccessIcon/SuccessIcon";

type Props = {
  dispatch: Dispatch<StepperAction>;
};

export function AvailabilitySuccess({ dispatch }: Props) {
  useEffect(() => {
    dispatch({
      isNextEnable: true,
      type: "toggle-next",
    });
  }, [dispatch]);

  return (
    <Placeholder
      Icon={<SuccessIcon />}
      title="Success"
      message="The new availability will appear in your availability list. You can safely close this dialog."></Placeholder>
  );
}
