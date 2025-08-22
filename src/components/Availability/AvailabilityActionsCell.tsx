import "./AvailabilityActionsCell.css";
import { ArchivistAvailability } from "@durability-labs/archivist-sdk-js/async";
import { ButtonIcon, Cell } from "@durability-labs/archivist-app-components";
import EditIcon from "../../assets/icons/edit.svg?react";

type Props = {
  availability: ArchivistAvailability;
};

export function AvailabilityActionsCell({ availability }: Props) {
  const onEditClick = async () => {
    document.dispatchEvent(
      new CustomEvent("archivistavailabilityedit", { detail: availability })
    );
  };

  return (
    <Cell>
      <div className="availability-actions">
        <ButtonIcon
          variant="small"
          onClick={onEditClick}
          Icon={EditIcon}></ButtonIcon>
      </div>
    </Cell>
  );
}
