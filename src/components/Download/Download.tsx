import { Button, Input } from "@durability-labs/archivist-app-components";
import "./Download.css";
import { ChangeEvent, useState } from "react";
import { ArchivistSdk } from "../../sdk/archivist";

export function Download() {
  const [cid, setCid] = useState("");
  const onDownload = () => {
    const url = ArchivistSdk.url() + "/api/archivist/v1/data/";
    window.open(url + cid + "/network/stream", "_target");
  };

  const onCidChange = (e: ChangeEvent<HTMLInputElement>) =>
    setCid(e.currentTarget.value);

  return (
    <main className="row gap download">
      <Input
        id="cid"
        placeholder="CID"
        inputClassName="download-input"
        variant={"medium"}
        autoComplete="off"
        value={cid}
        onChange={onCidChange}></Input>
      <Button label="Download" onClick={onDownload} variant="outline"></Button>
    </main>
  );
}
