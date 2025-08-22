import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button, Input, Toast } from "@durability-labs/archivist-app-components";
import { ArchivistSdk } from "../../sdk/archivist";

export function ArchivistUrlSettings() {
  const queryClient = useQueryClient();
  const [url, setUrl] = useState(ArchivistSdk.url);
  const [isInvalid, setIsInvalid] = useState(false);
  const [toast, setToast] = useState({ time: 0, message: "" });
  const { mutateAsync } = useMutation({
    mutationFn: (url: string) => ArchivistSdk.updateURL(url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spr"] });

      setToast({ message: "Settings saved successfully.", time: Date.now() });
    },
  });

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const element = e.currentTarget;
    const value = element.value;

    setUrl(value);
    setIsInvalid(!element.checkValidity());
  };

  const onClick = () => {
    if (isInvalid === false) {
      mutateAsync(url);
    }
  };

  return (
    <>
      <div className="settings-input">
        <Input
          id="url"
          label="Archivist node URL"
          onChange={onChange}
          value={url}
          isInvalid={isInvalid}
          helper={isInvalid ? "The URL is not valid" : "Enter a valid URL"}
          type="url"></Input>
      </div>
      <Button
        className="settings-url-button"
        disabled={isInvalid}
        variant="primary"
        label="Save changes"
        onClick={onClick}></Button>
      <Toast message={toast.message} time={toast.time} variant="success" />
    </>
  );
}
