import { useQuery } from "@tanstack/react-query";
import { CodexSdk } from "../../sdk/codex";
import "./StorageRequestFileChooser.css";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { WebStorage } from "../../utils/web-storage";
import { classnames } from "../../utils/classnames";
import {
  Dropdown,
  DropdownOption,
  Upload,
  WebFileIcon,
} from "@codex/marketplace-ui-components";

type Props = {
  onToggleNext: (enable: boolean) => void;
};

export function StorageRequestFileChooser({ onToggleNext }: Props) {
  const { data } = useQuery({
    queryFn: () => CodexSdk.data().then((data) => data.cids()),
    queryKey: ["cids"],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  const [cid, setCid] = useState("");
  const cache = useRef("");

  useEffect(() => {
    WebStorage.get<string>("storage-request-step-1").then((val) => {
      cache.current = val || "";

      setCid(val || "");
      onToggleNext(!!val);
    });

    return () => {
      WebStorage.set("storage-request-step-1", cache.current || "");
    };
  }, [onToggleNext]);

  if (data?.error) {
    // TODO error
    return "";
  }

  const onSelected = (o: DropdownOption) => {
    onToggleNext(!!o.subtitle);
    setCid(o.subtitle || "");
    cache.current = o.subtitle || "";
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    onToggleNext(!!e.currentTarget.value);
    setCid(e.currentTarget.value);
    cache.current = e.currentTarget.value;
  };

  const onSuccess = (data: string) => {
    onToggleNext(true);
    setCid(data);
    cache.current = data;
  };

  const onDelete = () => {
    setCid("");
    onToggleNext(false);
  };

  const options =
    data?.data.content.map((c) => {
      return {
        Icon: () => <WebFileIcon type={c.manifest.mimetype} size={24} />,
        title: c.manifest.filename,
        subtitle: c.cid,
      };
    }) || [];

  return (
    <>
      <span className="storageRequest-title">Choose a CID</span>

      <label className="label" htmlFor="cid">
        CID
      </label>

      <Dropdown
        placeholder="Select or type your CID"
        onChange={onChange}
        value={cid}
        options={options}
        onSelected={onSelected}
        className={classnames(
          ["storageRequestFileChooser-dropdown"],
          ["storageRequestFileChooser-dropdown-success", !!cid]
        )}
      />

      <div className="storageRequestFileChooser-separator">
        <hr className="storageRequestFileChooser-hr" />
        <span className="storageRequestFileChooser-or">OR</span>
        <hr className="storageRequestFileChooser-hr" />
      </div>

      <span className="storageRequest-title">
        <div>
          <span>Upload a file</span>
        </div>
        <span className="input-helper-text text-secondary">
          The CID will be automatically copied after your upload.
        </span>
      </span>

      <Upload
        onSuccess={onSuccess}
        editable={false}
        onDeleteItem={onDelete}
        provider={() =>
          CodexSdk.data().then((data) => data.upload.bind(CodexSdk))
        }
        useWorker={false}
      />
    </>
  );
}
