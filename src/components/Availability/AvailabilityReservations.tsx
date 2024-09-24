import {
  Backdrop,
  Button,
  EmptyPlaceholder,
  Modal,
  Placeholder,
  SpaceAllocation,
  Spinner,
} from "@codex-storage/marketplace-ui-components";
import { classnames } from "../../utils/classnames";
import "./AvailabilityReservations.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CodexSdk } from "../../sdk/codex";
import { Promises } from "../../utils/promises";
import { CodexAvailability } from "@codex-storage/sdk-js";
import { useEffect } from "react";
import { ErrorIcon } from "../ErrorIcon/ErrorIcon";
import { ErrorPlaceholder } from "../ErrorPlaceholder/ErrorPlaceholder";

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
    if (availability) {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    }
  }, [availability]);

  const {
    data = [],
    isPending,
    error,
  } = useQuery({
    queryFn: () => {
      return CodexSdk.marketplace
        .reservations(availability?.id)
        .then((s) => Promises.rejectOnError(s));
    },
    queryKey: ["reservations"],
    retry: 0,
    staleTime: 0,
  });

  if (isPending) {
    return (
      <Modal onClose={onClose} open={open}>
        <Spinner />
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal onClose={onClose} open={open}>
        <ErrorPlaceholder
          subtitle="Error when retrieving reservations."
          error={error}></ErrorPlaceholder>
      </Modal>
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
    <Modal open={open} onClose={onClose}>
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
    </Modal>
  );
}
