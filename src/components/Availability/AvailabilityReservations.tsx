import {
  Backdrop,
  Button,
  EmptyPlaceholder,
  SpaceAllocation,
} from "@codex-storage/marketplace-ui-components";
import { classnames } from "../../utils/classnames";
import "./AvailabilityReservations.css";
import { useQuery } from "@tanstack/react-query";
import { CodexSdk } from "../../sdk/codex";
import { Promises } from "../../utils/promises";
import { CodexAvailability } from "@codex-storage/sdk-js";

type Props = {
  availability: CodexAvailability | null;
  open: boolean;
  onClose: () => unknown;
};

export function AvailabilityReservations({
  availability,
  onClose,
  open,
}: Props) {
  const { data } = useQuery({
    queryFn: () => {
      if (availability) {
        return CodexSdk.marketplace
          .reservations(availability?.id)
          .then((s) => Promises.rejectOnError(s));
      }

      return Promise.resolve([]);
    },
    queryKey: ["reservations"],
  });

  // TODO manage error

  if (!availability) {
    return (
      <>
        <Backdrop open={open} onClose={onClose} removeScroll={true} />

        <span></span>
      </>
    );
  }

  if (!data?.length) {
    return (
      <>
        <Backdrop open={open} onClose={onClose} removeScroll={true} />

        <div
          className={classnames(
            ["reservations"],
            ["reservations--open", open]
          )}>
          <b className="reservations-title">Availability reservations</b>

          <EmptyPlaceholder
            title="No reservation"
            message="You don't have any reservation yet."></EmptyPlaceholder>

          <div className="reservations-buttons">
            <Button label={"Close"} variant="outline" onClick={onClose} />
          </div>
        </div>
      </>
    );
  }

  const totalSize = availability.totalSize;

  const totalUsed = data.reduce((acc, val) => acc + parseInt(val.size, 10), 0);

  const spaceData = [
    ...data.map((val) => ({
      title: val.id,
      size: parseInt(val.size, 10),
    })),
    {
      title: "Availability remaining",
      size: totalSize - totalUsed,
    },
  ];

  return (
    <>
      <Backdrop open={open} onClose={onClose} removeScroll={true} />

      <div
        className={classnames(["reservations"], ["reservations--open", open])}>
        <b className="reservations-title">Availability reservations</b>

        <SpaceAllocation data={spaceData} />

        <div className="reservations-buttons">
          <Button label={"Close"} variant="outline" onClick={onClose} />
        </div>
      </div>
    </>
  );
}
