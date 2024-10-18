import { CodexDataContent } from "@codex-storage/sdk-js";
import { Files } from "../../utils/files";
import { classnames } from "../../utils/classnames";
import { Check } from "lucide-react";

type Props = {
  files: CodexDataContent[];
  onFilterToggle: (filter: string) => void;
};

const archiveMimetypes = [
  "application/zip",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/gzip",
  "application/x-7z-compressed",
  "application/gzip", // for .tar.gz
  "application/x-bzip2",
  "application/x-xz",
];

export function FilterFilters({ files, onFilterToggle }: Props) {
  const filters = Array.from(
    new Set(
      files.map((file) =>
        archiveMimetypes.includes(file.manifest.mimetype)
          ? "archive"
          : Files.type(file.manifest.mimetype)
      )
    )
  );

  return filters.map((type) => (
    <span
      key={type}
      className={classnames(
        ["files-filter"],
        ["files-filter--active", filters.includes(type)]
      )}
      onClick={() => onFilterToggle(type)}>
      <span>{type}</span> <Check size={"1rem"}></Check>
    </span>
  ));
}
