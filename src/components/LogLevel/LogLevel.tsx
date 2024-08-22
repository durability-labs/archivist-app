import { CodexLogLevel } from "@codex/sdk-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { ErrorBoundaryContext } from "../../contexts/ErrorBoundaryContext";
import { CodexSdk } from "../../sdk/codex";
import "./LogLevel.css";
import { Button, Card, Select, Toast } from "@codex/marketplace-ui-components";
import { CircleCheck } from "lucide-react";

export function LogLevel() {
  const queryClient = useQueryClient();
  const [level, setLevel] = useState<CodexLogLevel>("DEBUG");
  const report = useContext(ErrorBoundaryContext);
  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationKey: ["debug"],
    mutationFn: (level: CodexLogLevel) =>
      CodexSdk.debug().then((debug) => debug.setLogLevel(level)),
    onSuccess: () => {
      setToast({
        message: "The log level has been updated successfully.",
        time: Date.now(),
      });
      queryClient.invalidateQueries({ queryKey: ["debug"] });
    },
  });
  const [toast, setToast] = useState({ time: 0, message: "" });

  if (isError) {
    // TODO remove this
    report(new Error(error.message));
    return "";
  }

  function onChange(e: React.FormEvent<HTMLSelectElement>) {
    const value = e.currentTarget.value;
    if (value) {
      setLevel(value as CodexLogLevel);
    }
  }

  const onClick = () => {
    mutateAsync(level);
  };

  const levels = [
    ["DEBUG", "DEBUG"],
    ["TRACE", "TRACE"],
    ["INFO", "INFO"],
    ["NOTICE", "NOTICE"],
    ["WARN", "WARN"],
    ["ERROR", "ERROR"],
    ["FATAL", "FATAL"],
  ] satisfies [string, string][];

  const Check = () => (
    <CircleCheck
      size="1.25rem"
      fill="var(--codex-color-primary)"
      stroke="var(--codex-background-light)"></CircleCheck>
  );

  return (
    <Card className="logLevel" title="Debug">
      <Select
        className="logLevel-select"
        id="level"
        label="Log level"
        options={levels}
        onChange={onChange}></Select>
      <Button
        variant="primary"
        label="Save changes"
        fetching={isPending}
        onClick={onClick}></Button>
      <Toast message={toast.message} time={toast.time} Icon={Check} />
    </Card>
  );
}
