import { CircleCheck } from "lucide-react";
import { useEffect } from "react";

type Props = {
  onChangeNextState: (value: "enable" | "disable") => void;
};

// TODO define style in placeholder component
export function StorageRequestDone({ onChangeNextState }: Props) {
  useEffect(() => {
    onChangeNextState("enable");
  }, [onChangeNextState]);

  return (
    <div className="emptyPlaceholder" style={{ margin: "auto" }}>
      <div
        style={{
          marginBottom: "1rem",
          color: "var(--codex-color-primary)",
        }}>
        <CircleCheck size="4rem" />
      </div>
      <b className="emptyPlaceholder-title">Your request is being processed.</b>
      <div className="emptyPlaceholder-message">
        Processing your request may take some time. Once completed, it will
        appear in your purchase list. You can safely close this dialog.
      </div>
    </div>
  );
}
