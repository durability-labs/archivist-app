import { AvailabilityComponentProps } from "./types";
import { useEffect } from "react";
import { ErrorPlaceholder } from "../ErrorPlaceholder/ErrorPlaceholder";

export function AvailabilityError({
  dispatch,
  error,
}: AvailabilityComponentProps) {
  useEffect(() => {
    dispatch({
      type: "toggle-next",
      isNextEnable: false,
    });

    dispatch({
      type: "toggle-back",
      isBackEnable: true,
    });
  }, [dispatch]);

  return (
    <ErrorPlaceholder
      subtitle="Error when trying to create availability."
      error={error}
    />
  );
}
