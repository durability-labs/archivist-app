import { ArchivistLogLevel } from "@durability-labs/archivist-sdk-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArchivistSdk } from "../../sdk/archivist";
import "./LogLevel.css";
import {
  Button,
  Select,
  Toast,
} from "@durability-labs/archivist-app-components";
import { Promises } from "../../utils/promises";
import LogsIcon from "../../assets/icons/logs.svg?react";
import SaveIcon from "../../assets/icons/save.svg?react";

export function LogLevel() {
  const queryClient = useQueryClient();
  const [level, setLevel] = useState<ArchivistLogLevel>("DEBUG");
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (level: ArchivistLogLevel) =>
      ArchivistSdk.debug()
        .setLogLevel(level)
        .then((s) => Promises.rejectOnError(s)),
    onSuccess: () => {
      setToast({
        message: "The log level has been updated successfully.",
        time: Date.now(),
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["debug"] });
    },
    onError: (error) => {
      setToast({
        message: "Error when trying to update: " + error.message,
        time: Date.now(),
        variant: "error",
      });
    },
  });
  const [toast, setToast] = useState({
    time: 0,
    message: "",
    variant: "success" as "success" | "error",
  });

  function onChange(e: React.FormEvent<HTMLSelectElement>) {
    const value = e.currentTarget.value;
    if (value) {
      setLevel(value as ArchivistLogLevel);
    }
  }

  const onClick = () => {
    mutateAsync(level);
  };

  const levels = [
    ["DEBUG", "Debug"],
    ["TRACE", "Trace"],
    ["INFO", "Info"],
    ["NOTICE", "Notice"],
    ["WARN", "Warn"],
    ["ERROR", "Error"],
    ["FATAL", "Fatal"],
  ] satisfies [string, string][];

  return (
    <div className="log-level">
      <div>
        <Select
          id="level"
          label=""
          options={levels}
          value={level}
          onChange={onChange}></Select>
        <LogsIcon width={20}></LogsIcon>
      </div>

      <Button
        variant="outline"
        label="Save"
        Icon={SaveIcon}
        fetching={isPending}
        size="small"
        onClick={onClick}></Button>
      <Toast
        message={toast.message}
        time={toast.time}
        variant={toast.variant}
      />
    </div>
  );
}
