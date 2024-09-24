import {
  EmptyPlaceholder,
  Modal,
  SpaceAllocation,
  Spinner,
} from "@codex-storage/marketplace-ui-components";
import "./AvailabilityReservations.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CodexSdk } from "../../sdk/codex";
import { Promises } from "../../utils/promises";
import { CodexAvailability } from "@codex-storage/sdk-js";
import { useEffect } from "react";
import { ErrorPlaceholder } from "../ErrorPlaceholder/ErrorPlaceholder";

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
    queryFn: () =>
      CodexSdk.marketplace
        .reservations(availability!.id)
        .then((s) => Promises.rejectOnError(s)),
    queryKey: ["reservations"],
    retry: 0,
    staleTime: 0,
    initialData: [],
    enabled: !!availability,
  });

  if (!availability) {
    return (
      <Modal onClose={onClose} open={open}>
        <ErrorPlaceholder
          subtitle="The availability does not exist"
          error={error}></ErrorPlaceholder>
      </Modal>
    );
  }

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
      {isEmpty ? (
        <EmptyPlaceholder
          title="No reservation"
          message="You don't have any reservation yet."></EmptyPlaceholder>
      ) : (
        <SpaceAllocation data={spaceData} />
      )}
    </Modal>
  );
}
