import { Cell, Tooltip } from "@durability-labs/archivist-app-components";
import PurchaseStateIcon from "../../assets/icons/purchases-state-pending.svg?react";
import SuccessCircleIcon from "../../assets/icons/success-circle.svg?react";
import ErrorCircleIcon from "../../assets/icons/error-circle.svg?react";

type Props = {
  state: string;
  message: string | undefined;
};

export const CustomStateCellRender = ({ state, message }: Props) => {
  const icons = {
    pending: PurchaseStateIcon,
    submitted: PurchaseStateIcon,
    started: PurchaseStateIcon,
    finished: () => <SuccessCircleIcon width={20} />,
    cancelled: ErrorCircleIcon,
    errored: ErrorCircleIcon,
  };

  const Icon = icons[state as keyof typeof icons] || PurchaseStateIcon;

  return (
    <Cell>
      <p className={"cell-state"}>
        {message ? (
          <Tooltip message={message}>
            <Icon width={20} data-testid={"cell-" + state} />
          </Tooltip>
        ) : (
          <Icon width={20} data-testid={"cell-" + state} />
        )}
      </p>
    </Cell>
  );
};
