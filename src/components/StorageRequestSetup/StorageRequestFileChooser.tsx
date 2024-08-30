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
} from "@codex-storage/marketplace-ui-components";
import { useData } from "../../hooks/useData";

type Props = {
  onChangeNextState: (value: "enable" | "disable") => void;
};

export function StorageRequestFileChooser({ onChangeNextState }: Props) {
  const files = useData();
  const [cid, setCid] = useState("");
  const cache = useRef("");

  useEffect(() => {
    WebStorage.get<string>("storage-request-step-1").then((val) => {
      cache.current = val || "";

      setCid(val || "");
      onChangeNextState(!val ? "disable" : "enable");
    });

    return () => {
      WebStorage.set("storage-request-step-1", cache.current || "");
    };
  }, [onChangeNextState]);

  const onSelected = (o: DropdownOption) => {
    setCid(o.subtitle || "");
    onChangeNextState(!o.subtitle ? "disable" : "enable");
    cache.current = o.subtitle || "";
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCid(e.currentTarget.value);
    onChangeNextState(!e.currentTarget.value ? "disable" : "enable");
    cache.current = e.currentTarget.value;
  };

  const onSuccess = (data: string, file: File) => {
    WebStorage.set(data, {
      type: file.type,
      name: file.name,
    });

    onChangeNextState("enable");

    setCid(data);
    cache.current = data;
  };

  const onDelete = () => {
    setCid("");
    onChangeNextState("disable");
  };

  const options =
    files.map((f) => {
      return {
        Icon: () => <WebFileIcon type={f.mimetype} size={24} />,
        title: f.name,
        subtitle: f.cid,
      };
    }) || [];

  return (
    <>
      <span className="storageRequest-title">Choose a CID</span>

      <label className="label" htmlFor="cid">
        CID
      </label>

      <Dropdown
        label=""
        id="cid"
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
        provider={() => CodexSdk.data().then((data) => data.upload.bind(data))}
      />
    </>
  );
}
