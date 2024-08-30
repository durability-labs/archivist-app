import { Placeholder } from "@codex/marketplace-ui-components";
import { CircleCheck } from "lucide-react";
import { useEffect } from "react";
import "./StorageRequestDone.css";

type Props = {
  onChangeNextState: (value: "enable" | "disable") => void;
};

export function StorageRequestDone({ onChangeNextState }: Props) {
  useEffect(() => {
    onChangeNextState("enable");
  }, [onChangeNextState]);

  return (
    <Placeholder
      Icon={<CircleCheck size="4rem" className="storageRequestDone-icon" />}
      className="storageRequestDone"
      title="Your request is being processed."
      message=" Processing your request may take some time. Once completed, it will
        appear in your purchase list. You can safely close this dialog."></Placeholder>
  );
}
