import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button, Input, Toast } from "@codex/marketplace-ui-components";
import { CodexSdk } from "../sdk/codex";

export function CodexUrlSettings() {
  const queryClient = useQueryClient();
  const [url, setUrl] = useState("");
  const [toast, setToast] = useState({ time: 0, message: "" });

  useEffect(() => {
    CodexSdk.url().then((u) => setUrl(u));
  }, []);

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (value) {
      setUrl(value);
    }
  };

  const onClick = () => {
    CodexSdk.updateURL(url).then(() => {
      queryClient.invalidateQueries();
      setToast({ message: "Settigns saved successfully.", time: Date.now() });
    });
  };

  return (
    <>
      <Input
        id="url"
        label="Codex client node URL"
        onChange={onChange}
        value={url}
        className="settings-input"></Input>
      <Button variant="primary" label="Save changes" onClick={onClick}></Button>
      <Toast message={toast.message} time={toast.time} variant="success" />
    </>
  );
}
