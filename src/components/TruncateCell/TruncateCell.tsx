import { Tooltip } from "@codex-storage/marketplace-ui-components";
import "./TruncateCell.css";

type Props = {
  value: string;
};

export function TruncateCell({ value }: Props) {
  if (value.length <= 10) {
    return <span>{value}</span>;
  }

  return (
    <div className="truncateCell">
      <Tooltip message={value}>
        <span>{value.slice(0, 10) + "..."}</span>
      </Tooltip>
    </div>
  );
}
