import {
  Placeholder,
  StepperAction,
} from "@codex-storage/marketplace-ui-components";
import { ErrorIcon } from "../ErrorIcon/ErrorIcon";
import { Dispatch, useEffect } from "react";

type Props = {
  error: Error;
  dispatch: Dispatch<StepperAction>;
};

export function AvailabilityError({ dispatch, error }: Props) {
  useEffect(() => {
    dispatch({
      isNextEnable: false,
      type: "toggle-next",
    });
  }, [dispatch]);

  return (
    <Placeholder
      Icon={<ErrorIcon />}
      title="Error"
      subtitle={"Got an error when trying to create the availability."}
      message={error.message}></Placeholder>
  );
}
