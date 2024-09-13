import {
  ButtonIcon,
  Button,
  Sheets,
} from "@codex-storage/marketplace-ui-components";
import { CodexDataContent } from "@codex-storage/sdk-js";
import { PrettyBytes } from "../../utils/bytes";
import { ICON_SIZE } from "../../utils/constants";
import { Dates } from "../../utils/dates";
import { CidCopyButton } from "./CidCopyButton";
import "./FileDetails.css";
import { DownloadIcon, X } from "lucide-react";

type Props = {
  details: CodexDataContent | undefined;
  onClose: () => void;
  expanded: boolean;
};

export function FileDetails({ onClose, details, expanded }: Props) {
  const url = import.meta.env.VITE_CODEX_API_URL + "/api/codex/v1/data/";

  const Icon = () => <X size={ICON_SIZE} onClick={onClose} />;

  const onDownload = () => window.open(url + details?.cid, "_target");

  return (
    <Sheets open={expanded} onClose={onClose}>
      <>
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
                <p className="fileDetails-gridColumn">
                  {details.manifest.filename}
                </p>
              </div>

              <div className="fileDetails-grid">
                <p className="text-secondary">Date:</p>
                <p className="fileDetails-gridColumn">
                  {Dates.format(details.manifest.uploadedAt).toString()}
                </p>
              </div>

              <div className="fileDetails-grid">
                <p className="text-secondary">Mimetype:</p>
                <p className="fileDetails-gridColumn">
                  {details.manifest.mimetype}
                </p>
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
      </>
    </Sheets>
  );
}
