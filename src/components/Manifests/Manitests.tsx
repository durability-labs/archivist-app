import { CodexDataContent } from "@codex/sdk-js";
import { useQuery } from "@tanstack/react-query";
import {
  Copy,
  Download,
  DownloadIcon,
  ReceiptText,
  Star,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { CodexSdk } from "../../sdk/codex";
import { attributes } from "../../utils/attributes.ts";
import { BrowserStorage } from "../../utils/browser-storage.ts";
import { PrettyBytes } from "../../utils/bytes";
import { Dates } from "../../utils/dates.ts";
import "./Manitests.css";
import {
  COPY_DURATION,
  ICON_SIZE,
  SIDE_DURATION,
} from "../../utils/constants.ts";
import {
  Button,
  ButtonIcon,
  WebFileIcon,
} from "@codex/marketplace-ui-components";

type StarIconProps = {
  favorites: string;
  cid: string;
};

function StarIcon({ favorites, cid }: StarIconProps) {
  if (favorites.includes(cid)) {
    return (
      <Star size={ICON_SIZE} className="manifest-favorite manifest-star" />
    );
  }

  return <Star size={ICON_SIZE} className="manifest-star" />;
}

export function Manifests() {
  const { data } = useQuery({
    queryFn: () => CodexSdk.data().then((data) => data.cids()),
    queryKey: ["cids"],
    // refetchOnWindowFocus: false,
    // refetchOnMount: false,
  });
  const cid = useRef<string | null>("");
  const [expanded, setExpanded] = useState(false);

  const onClose = () => {
    setExpanded(false);

    setTimeout(() => {
      cid.current = "";
    }, SIDE_DURATION);
  };

  const onDetails = (id: string) => {
    // router.navigate({
    //   to: "/dashboard/about",
    //   params: data?.data.content.find((c) => c.cid === cid) || {},
    //   state: data?.data.content.find((c) => c.cid === cid) || true,
    // });

    cid.current = id;
    setExpanded(true);
  };

  const onToggleFavorite = (cid: string) =>
    BrowserStorage.toggle("favorites", cid);

  if (data?.error) {
    // TODO error
    return "";
  }

  const details = data?.data.content.find((c) => c.cid === cid.current);

  const url = import.meta.env.VITE_CODEX_API_URL + "/api/codex/v1/data/";
  const favorites = BrowserStorage.values("favorites");

  return (
    <>
      {data?.data.content.map((c) => (
        <div className="manifest" key={c.cid}>
          <div className="manifest-content">
            <div className="manifest-icon">
              <WebFileIcon type={c.manifest.mimetype} />
            </div>
            <div className="manifest-data">
              <div>
                <b>{c.manifest.filename}</b>
                <div>
                  <small className="manifest-meta">
                    {PrettyBytes(c.manifest.datasetSize)} -{" "}
                    {Dates.format(c.manifest.uploadedAt).toString()} - ...
                    {c.cid.slice(-5)}
                  </small>
                </div>
              </div>
              <div className="manifest-actions">
                <ButtonIcon
                  variant="small"
                  onClick={() => window.open(url + c.cid, "_blank")}
                  Icon={() => <Download size={ICON_SIZE} />}></ButtonIcon>

                <ButtonIcon
                  variant="small"
                  onClick={() => onToggleFavorite(c.cid)}
                  Icon={() => (
                    <StarIcon favorites={favorites} cid={c.cid} />
                  )}></ButtonIcon>

                <ButtonIcon
                  variant="small"
                  onClick={() => onDetails(c.cid)}
                  Icon={() => <ReceiptText size={ICON_SIZE} />}></ButtonIcon>
              </div>
            </div>
          </div>
        </div>
      ))}

      <ManifestDetails
        onClose={onClose}
        details={details}
        expanded={expanded}
      />
    </>
  );
}

type ManifestDetailsProps = {
  details: CodexDataContent | undefined;
  onClose: () => void;
  expanded: boolean;
};

function ManifestDetails({ onClose, details, expanded }: ManifestDetailsProps) {
  const attr = attributes({ "aria-expanded": expanded });
  const url = import.meta.env.VITE_CODEX_API_URL + "/api/codex/v1/data/";

  const Icon = () => <X size={ICON_SIZE} onClick={onClose} />;

  const onDownload = () => window.open(url + details?.cid, "_target");

  return (
    <>
      <div
        className="manifest-backdrop backdrop"
        onClick={onClose}
        {...attr}></div>

      <div className="manifest-details" {...attr}>
        {details && (
          <>
            <div className="manifest-detailsHeader">
              <b className="manifest-detailsHeaderTitle">File details</b>
              <ButtonIcon variant="small" Icon={Icon}></ButtonIcon>
            </div>

            <div className="manifest-detailsBody">
              <div className="manifest-detailsGrid">
                <p className="text-secondary">CID:</p>
                <p className="manifest-detailsGridColumn">{details.cid}</p>
              </div>

              <div className="manifest-detailsGrid">
                <p className="text-secondary">File name:</p>
                <p className="manifest-detailsGridColumn">
                  {details.manifest.filename}
                </p>
              </div>

              <div className="manifest-detailsGrid">
                <p className="text-secondary">Date:</p>
                <p className="manifest-detailsGridColumn">
                  {Dates.format(details.manifest.uploadedAt).toString()}
                </p>
              </div>

              <div className="manifest-detailsGrid">
                <p className="text-secondary">Mimetype:</p>
                <p className="manifest-detailsGridColumn">
                  {details.manifest.mimetype}
                </p>
              </div>

              <div className="manifest-detailsGrid">
                <p className="text-secondary">Size:</p>
                <p className="manifest-detailsGridColumn">
                  {PrettyBytes(details.manifest.datasetSize)}
                </p>
              </div>

              <div className="manifest-detailsGrid">
                <p className="text-secondary">Protected:</p>
                <p className="manifest-detailsGridColumn">
                  {details.manifest.protected ? "Yes" : "No"}
                </p>
              </div>

              <div className="manifest-detailsActions">
                <CopyButton cid={details.cid} />

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

type CopyButtonProps = {
  cid: string;
};

function CopyButton({ cid }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<number | null>(null);

  const onCopy = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    navigator.clipboard.writeText(cid);

    setCopied(true);

    timeout.current = setTimeout(() => {
      setCopied(false);
    }, COPY_DURATION);
  };

  const label = copied ? "Copied !" : "Copy CID";

  const Icon = () => <Copy size={ICON_SIZE} />;

  return (
    <Button
      label={label}
      variant="outline"
      onClick={onCopy}
      Icon={Icon}></Button>
  );
}
