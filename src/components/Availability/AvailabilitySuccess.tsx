import { Placeholder } from "@codex-storage/marketplace-ui-components";
import { SuccessIcon } from "../SuccessIcon/SuccessIcon";
import { AvailabilityComponentProps } from "./types";
import { useEffect } from "react";

export function AvailabilitySuccess({ dispatch }: AvailabilityComponentProps) {
  useEffect(() => {
    dispatch({
      type: "toggle-next",
      isNextEnable: true,
    });

    dispatch({
      type: "toggle-back",
      isBackEnable: false,
    });
  }, [dispatch]);

  return (
    <Placeholder
      Icon={<SuccessIcon />}
      title="Success"
      message="The new availability will appear in your availability list. You can safely close this dialog."></Placeholder>
  );
}
