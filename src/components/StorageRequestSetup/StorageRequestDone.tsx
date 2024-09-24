import { Placeholder } from "@codex-storage/marketplace-ui-components";
import { CircleCheck } from "lucide-react";
import "./StorageRequestDone.css";
import { StorageRequestComponentProps } from "./types";
import { useEffect } from "react";

// TODO rename
export function StorageRequestDone({ dispatch }: StorageRequestComponentProps) {
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
      Icon={<CircleCheck size="4rem" className="storageRequestDone-icon" />}
      className="storageRequestDone"
      title="Your request is being processed."
      message=" Processing your request may take some time. Once completed, it will
        appear in your purchase list. You can safely close this dialog."></Placeholder>
  );
}
