import {
  ButtonIcon,
  Cell,
  WebFileIcon,
} from "@codex-storage/marketplace-ui-components";
import { CodexDataContent } from "@codex-storage/sdk-js";
import { Copy } from "lucide-react";

type Props = {
  content: CodexDataContent;
};

export function FileCell({ content }: Props) {
  const onCopy = (cid: string) => navigator.clipboard.writeText(cid);

  return (
    <Cell>
      <div className="files-cell-file">
        <WebFileIcon type={content.manifest.mimetype} />

        <div>
          <b>{content.manifest.filename}</b>
          <div>
            <small className="files-fileMeta">{content.cid}</small>
            <ButtonIcon
              variant="small"
              onClick={() => onCopy(content.cid)}
              animation="buzz"
              Icon={(props) => <Copy size={"1rem"} {...props} />}></ButtonIcon>
          </div>
        </div>
      </div>
    </Cell>
  );
}
