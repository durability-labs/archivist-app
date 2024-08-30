import { Download, FilesIcon, ReceiptText, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PrettyBytes } from "../../utils/bytes.ts";
import { Dates } from "../../utils/dates.ts";
import "./Files.css";
import { ICON_SIZE, SIDE_DURATION } from "../../utils/constants.ts";
import {
  ButtonIcon,
  EmptyPlaceholder,
  WebFileIcon,
} from "@codex-storage/marketplace-ui-components";
import { FileDetails } from "./FileDetails.tsx";
import { classnames } from "../../utils/classnames.ts";
import { FavoriteStorage } from "../../utils/favorite-storage.tsx";
import { useData } from "../../hooks/useData.tsx";

type StarIconProps = {
  isFavorite: boolean;
};

function StarIcon({ isFavorite }: StarIconProps) {
  if (isFavorite) {
    return (
      <Star size={ICON_SIZE} className="files-fileFavorite files-fileStar" />
    );
  }

  return <Star size={ICON_SIZE} className="files-star" />;
}

export function Files() {
  const files = useData();
  const cid = useRef<string | null>("");
  const [expanded, setExpanded] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selected, setSelected] = useState<"all" | "favorites">("all");

  useEffect(() => {
    FavoriteStorage.list().then((cids) => setFavorites(cids));
  }, []);

  const onClose = () => {
    setExpanded(false);

    setTimeout(() => {
      cid.current = "";
    }, SIDE_DURATION);
  };

  const onSelected = () =>
    setSelected(selected === "all" ? "favorites" : "all");

  const onDetails = (id: string) => {
    cid.current = id;
    setExpanded(true);
  };

  const onToggleFavorite = (cid: string) => {
    if (favorites.includes(cid)) {
      FavoriteStorage.delete(cid);
      setFavorites(favorites.filter((c) => c !== cid));
    } else {
      FavoriteStorage.add(cid);
      setFavorites([...favorites, cid]);
    }
  };

  const items = [];

  if (selected === "favorites") {
    items.push(...files.filter((f) => favorites.includes(f.cid)));
  } else {
    items.push(...files);
  }

  const details = items.find((c) => c.cid === cid.current);

  const url = import.meta.env.VITE_CODEX_API_URL + "/api/codex/v1/data/";

  return (
    <div className="files">
      <div className="files-header">
        <div className="files-title">Files</div>
        <div className="files-headerTabs">
          <div
            className={classnames(
              ["files-headerTab"],
              ["files-headerTab--active", selected === "all"]
            )}
            onClick={onSelected}>
            <FilesIcon size={"1rem"}></FilesIcon>
            <span>All files</span>
          </div>

          <div
            className={classnames(
              ["files-headerTab"],
              ["files-headerTab--active", selected === "favorites"]
            )}
            onClick={onSelected}>
            <Star size={"1rem"}></Star>
            <span>Favorites</span>
          </div>
        </div>
      </div>

      <div className="files-fileBody">
        {items.length ? (
          items.map((c) => (
            <div className="files-file" key={c.cid}>
              <div className="files-fileContent">
                <div className="files-fileIcon">
                  <WebFileIcon type={c.mimetype} />
                </div>
                <div className="files-fileData">
                  <div>
                    <b>{c.name}</b>
                    <div>
                      <small className="files-fileMeta">
                        {PrettyBytes(c.manifest.datasetSize)} -{" "}
                        {Dates.format(c.uploadedAt).toString()} - ...
                        {c.cid.slice(-5)}
                      </small>
                    </div>
                  </div>
                  <div className="files-fileActions">
                    <ButtonIcon
                      variant="small"
                      onClick={() => window.open(url + c.cid, "_blank")}
                      Icon={() => <Download size={ICON_SIZE} />}></ButtonIcon>

                    <ButtonIcon
                      variant="small"
                      onClick={() => onToggleFavorite(c.cid)}
                      Icon={() => (
                        <StarIcon isFavorite={favorites.includes(c.cid)} />
                      )}></ButtonIcon>

                    <ButtonIcon
                      variant="small"
                      onClick={() => onDetails(c.cid)}
                      Icon={() => (
                        <ReceiptText size={ICON_SIZE} />
                      )}></ButtonIcon>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="files-placeholder">
            <EmptyPlaceholder
              title="Nothing to show"
              message="No data here yet. Start to upload files to see data here."
            />
          </div>
        )}
      </div>

      <FileDetails onClose={onClose} details={details} expanded={expanded} />
    </div>
  );
}
