import { StorageRequestComponentProps } from "./types";
import { useEffect } from "react";
import { ErrorPlaceholder } from "../ErrorPlaceholder/ErrorPlaceholder";

export function StorageRequestError({
  dispatch,
  error,
}: StorageRequestComponentProps) {
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
      subtitle="Error when trying to create storage request."
      error={error}
    />
  );
}
