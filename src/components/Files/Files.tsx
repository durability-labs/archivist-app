import {
  ChevronDown,
  Copy,
  Download,
  FilesIcon,
  Folder,
  Plus,
  ReceiptText,
  Star,
  X,
} from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { PrettyBytes } from "../../utils/bytes";
import { Dates } from "../../utils/dates";
import "./Files.css";
import { ICON_SIZE, SIDE_DURATION } from "../../utils/constants";
import {
  ButtonIcon,
  EmptyPlaceholder,
  WebFileIcon,
  Tabs,
  Input,
  Button,
  TabProps,
} from "@codex-storage/marketplace-ui-components";
import { FileDetails } from "./FileDetails.tsx";
import { FavoriteStorage } from "../../utils/favorite-storage.tsx";
import { useData } from "../../hooks/useData.tsx";
import { WebStorage } from "../../utils/web-storage.ts";
import { CodexSdk } from "../../sdk/codex.ts";
import { FolderButton } from "./FolderButton.tsx";
import { classnames } from "../../utils/classnames.ts";

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
  const [index, setIndex] = useState(0);
  const [folder, setFolder] = useState("");
  const [folders, setFolders] = useState<[string, string[]][]>([]);
  const [error, setError] = useState("");
  const [details, setDetails] = useState<string[]>([]);

  useEffect(() => {
    WebStorage.folders.list().then((items) => setFolders(items));
  }, []);

  const onClose = () => {
    setExpanded(false);

    setTimeout(() => {
      cid.current = "";
    }, SIDE_DURATION);
  };

  const onTabChange = async (i: number) => setIndex(i);

  const onDetails = (id: string) => {
    cid.current = id;
    setExpanded(true);
  };

  // const details = items.find((c) => c.cid === cid.current);

  const onFolderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setFolder(val);
    setError("");

    if (!val) {
      return;
    }

    if (e.currentTarget.checkValidity()) {
      if (folders.length >= 5) {
        setError("5 folders limit reached");
        return;
      }

      if (folders.find(([folder]) => folder === val)) {
        setError("This folder already exists");
        return;
      }
    } else {
      setError("9 alpha characters maximum");
    }
  };

  const onFolderCreate = () => {
    WebStorage.folders.create(folder);

    setFolder("");
    setFolders([...folders, [folder, []]]);
  };

  const onFolderDelete = (val: string) => {
    WebStorage.folders.delete(val);

    const currentIndex = folders.findIndex(([name]) => name === val);

    if (currentIndex + 1 == index) {
      setIndex(index - 1);
    }

    setFolders(folders.filter(([name]) => name !== val));
  };

  const onFolderToggle = (cid: string, folder: string) => {
    const current = folders.find(([name]) => name === folder);

    if (!current) {
      return;
    }

    const [, files] = current;

    if (files.includes(cid)) {
      WebStorage.folders.deleteFile(folder, cid);

      setFolders(
        folders.map(([name, files]) =>
          name === folder
            ? [name, files.filter((id) => id !== cid)]
            : [name, files]
        )
      );
    } else {
      WebStorage.folders.addFile(folder, cid);

      setFolders(
        folders.map(([name, files]) =>
          name === folder ? [name, [...files, cid]] : [name, files]
        )
      );
    }
  };

  const tabs: TabProps[] = folders.map(([folder]) => ({
    label: folder,
    Icon: () => <Folder size={"1rem"}></Folder>,
    IconAfter:
      folder === "Favorites"
        ? undefined
        : () => (
            <X
              size={"1rem"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                onFolderDelete(folder);
              }}></X>
          ),
  }));

  // const onToggleDetails = (cid: string) => {
  //   if (details.includes(cid)) {
  //     setDetails(details.filter((val) => val !== cid));
  //   } else {
  //     setDetails([...details, cid]);
  //   }
  // };

  const onCopy = (cid: string) => navigator.clipboard.writeText(cid);

  tabs.unshift({
    label: "All files",
    Icon: () => <FilesIcon size={"1rem"}></FilesIcon>,
  });

  const items =
    index === 0
      ? files
      : files.filter((file) => folders[index - 1][1].includes(file.cid));

  const url = CodexSdk.url() + "/api/codex/v1/data/";

  return (
    <div className="files">
      <div className="files-header">
        <div className="files-headerLeft">
          <div className="files-title">Files</div>
        </div>
        <div className="files-headerRight">
          <div>
            <Input
              id="folder"
              inputClassName={classnames(["files-folders"])}
              isInvalid={folder !== "" && !!error}
              value={folder}
              required={true}
              pattern="[A-Za-z0-9_\-]*"
              maxLength={9}
              helper={error || "Enter the folder name"}
              onChange={onFolderChange}></Input>
          </div>

          <Button
            label="Folder"
            Icon={Plus}
            disabled={!!error || !folder}
            onClick={onFolderCreate}></Button>
        </div>
      </div>

      <Tabs onTabChange={onTabChange} tabIndex={index} tabs={tabs}></Tabs>

      <div className="files-fileBody">
        {items.length ? (
          items.map((c) => (
            <div className="files-file" key={c.cid}>
              <div className="files-fileContent">
                <div className="files-fileIcon">
                  <WebFileIcon type={c.manifest.mimetype} />
                </div>
                <div className="files-fileData">
                  <div>
                    <b>{c.manifest.filename}</b>
                    <div>
                      <small className="files-fileMeta">
                        {PrettyBytes(c.manifest.datasetSize)} -{" "}
                        {Dates.format(c.manifest.uploadedAt).toString()} - ...
                        {c.cid.slice(-5)}
                      </small>
                    </div>
                  </div>
                  <div className="files-fileActions">
                    <ButtonIcon
                      variant="small"
                      animation="bounce"
                      onClick={() => window.open(url + c.cid, "_blank")}
                      Icon={() => <Download size={ICON_SIZE} />}></ButtonIcon>

                    <FolderButton
                      folders={folders.map(([folder, files]) => [
                        folder,
                        files.includes(c.cid),
                      ])}
                      onFolderToggle={(folder) => onFolderToggle(c.cid, folder)}
                    />

                    <ButtonIcon
                      variant="small"
                      onClick={() => onCopy(c.cid)}
                      animation="buzz"
                      Icon={() => <Copy size={ICON_SIZE} />}></ButtonIcon>

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

      {/* <FileDetails onClose={onClose} details={details} expanded={expanded} /> */}
    </div>
  );
}
