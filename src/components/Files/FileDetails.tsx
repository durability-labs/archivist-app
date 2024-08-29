import { ButtonIcon, Button } from "@codex/marketplace-ui-components";
import { CodexDataContent } from "@codex/sdk-js";
import { X, DownloadIcon } from "lucide-react";
import { attributes } from "../../utils/attributes";
import { PrettyBytes } from "../../utils/bytes";
import { ICON_SIZE } from "../../utils/constants";
import { Dates } from "../../utils/dates";
import { CidCopyButton } from "./CidCopyButton";
import "./FileDetails.css";
import { FileMetadata } from "../../utils/file-storage";

type Props = {
  details: (CodexDataContent & FileMetadata) | undefined;
  onClose: () => void;
  expanded: boolean;
};

export function FileDetails({ onClose, details, expanded }: Props) {
  const attr = attributes({ "aria-expanded": expanded });
  const url = import.meta.env.VITE_CODEX_API_URL + "/api/codex/v1/data/";

  const Icon = () => <X size={ICON_SIZE} onClick={onClose} />;

  const onDownload = () => window.open(url + details?.cid, "_target");

  return (
    <>
      <div
        className="files-backdrop backdrop"
        onClick={onClose}
        {...attr}></div>

      <div className="fileDetails" {...attr}>
        {details && (
          <>
            <div className="fileDetails-header">
              <b className="fileDetails-headerTitle">File details</b>
              <ButtonIcon variant="small" Icon={Icon}></ButtonIcon>
            </div>

            <div className="fileDetails-body">
              <div className="fileDetails-grid">
                <p className="text-secondary">CID:</p>
                <p className="fileDetails-gridColumn">{details.cid}</p>
              </div>

              <div className="fileDetails-grid">
                <p className="text-secondary">File name:</p>
                <p className="fileDetails-gridColumn">{details.name}</p>
              </div>

              <div className="fileDetails-grid">
                <p className="text-secondary">Date:</p>
                <p className="fileDetails-gridColumn">
                  {Dates.format(details.uploadedAt).toString()}
                </p>
              </div>

              <div className="fileDetails-grid">
                <p className="text-secondary">Mimetype:</p>
                <p className="fileDetails-gridColumn">{details.mimetype}</p>
              </div>

              <div className="fileDetails-grid">
                <p className="text-secondary">Size:</p>
                <p className="fileDetails-gridColumn">
                  {PrettyBytes(details.manifest.datasetSize)}
                </p>
              </div>

              <div className="fileDetails-grid">
                <p className="text-secondary">Protected:</p>
                <p className="fileDetails-gridColumn">
                  {details.manifest.protected ? "Yes" : "No"}
                </p>
              </div>

              <div className="fileDetails-actions">
                <CidCopyButton cid={details.cid} />

                <Button
                  Icon={() => <DownloadIcon size={ICON_SIZE} />}
                  label="Download"
                  onClick={onDownload}></Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
