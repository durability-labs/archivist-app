import {
  EmptyPlaceholder,
  Modal,
  SpaceAllocation,
  Spinner,
} from "@durability-labs/archivist-app-components";
import "./AvailabilityReservations.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArchivistSdk } from "../../sdk/archivist";
import { Promises } from "../../utils/promises";
import { ArchivistAvailability } from "@durability-labs/archivist-sdk-js";
import { useEffect } from "react";
import { ErrorPlaceholder } from "../ErrorPlaceholder/ErrorPlaceholder";
import { AvailabilityUtils } from "./availability.utils";

type Props = {
  availability: ArchivistAvailability | null;
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
  }, [queryClient, availability]);

  const {
    data = [],
    isPending,
    error,
  } = useQuery({
    queryFn: () =>
      ArchivistSdk.marketplace()
        .reservations(availability!.id)
        .then((s) => Promises.rejectOnError(s)),
    queryKey: ["reservations"],

    initialData: [],

    // Enable only when the availability exists
    enabled: !!availability,

    // No need to retry because if the connection to the node
    // is back again, all the queries will be invalidated.
    retry: false,

    // The client node should be local, so display the cache value while
    // making a background request looks good.
    staleTime: 0,

    // Refreshing when focus returns can be useful if a user comes back
    // to the UI after performing an operation in the terminal.
    refetchOnWindowFocus: true,
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
    ...data.map((val, index) => ({
      title: val.id,
      size: parseInt(val.size, 10),
      color: AvailabilityUtils.availabilityColors[index],
    })),
    {
      title: "Availability remaining",
      size: totalSize - totalUsed,
      color:
        AvailabilityUtils.availabilityColors[
          AvailabilityUtils.availabilityColors.length - 1
        ],
    },
  ];
  const isEmpty = !data.length;

  return (
    <Modal open={open} onClose={onClose}>
      <p className="reservations-title">
        <b>Slots</b>
      </p>
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
