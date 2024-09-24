import {
  Backdrop,
  Button,
  EmptyPlaceholder,
  Placeholder,
  SpaceAllocation,
} from "@codex-storage/marketplace-ui-components";
import { classnames } from "../../utils/classnames";
import "./AvailabilityReservations.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CodexSdk } from "../../sdk/codex";
import { Promises } from "../../utils/promises";
import { CodexAvailability } from "@codex-storage/sdk-js";
import { useEffect } from "react";
import { ErrorIcon } from "../ErrorIcon/ErrorIcon";

type Props = {
  availability: CodexAvailability;
  open: boolean;
  onClose: () => unknown;
};

export function AvailabilityReservations({
  availability,
  onClose,
  open,
}: Props) {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["reservations"] });
  }, [availability]);

  const { data = [], error } = useQuery({
    queryFn: async () => {
      const s = await CodexSdk.marketplace.reservations(availability.id);
      return await Promises.rejectOnError(s);
    },
    queryKey: ["reservations"],
  });

  if (error) {
    return (
      <>
        <Backdrop open={open} onClose={onClose} removeScroll={true} />

        <Placeholder
          Icon={<ErrorIcon />}
          title="Error"
          subtitle="Error when retrieving reservations."
          message={error.message}></Placeholder>
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
  const isEmpty = !!data.length;

  return (
    <>
      <Backdrop open={open} onClose={onClose} removeScroll={true} />

      <div
        className={classnames(["reservations"], ["reservations--open", open])}>
        <b className="reservations-title">Availability reservations</b>

        {isEmpty ? (
          <EmptyPlaceholder
            title="No reservation"
            message="You don't have any reservation yet."></EmptyPlaceholder>
        ) : (
          <SpaceAllocation data={spaceData} />
        )}

        <div className="reservations-buttons">
          <Button label={"Close"} variant="outline" onClick={onClose} />
        </div>
      </div>
    </>
  );
}
