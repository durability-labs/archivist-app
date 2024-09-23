import { createFileRoute } from "@tanstack/react-router";
import "./availabilities.css";
import { AvailabilitiesTable } from "../../components/Availability/AvailabilitiesTable";
import { useState } from "react";
import { AvailabilityReservations } from "../../components/Availability/AvailabilityReservations";
import { CodexAvailability } from "@codex-storage/sdk-js/async";
import { CodexSdk } from "../../sdk/codex";
import { Promises } from "../../utils/promises";
import { useQuery } from "@tanstack/react-query";
import {
  SpaceAllocation,
  Spinner,
} from "@codex-storage/marketplace-ui-components";
import { Strings } from "../../utils/strings";

export const Route = createFileRoute("/dashboard/availabilities")({
  component: () => {
    const [availabilitySelected, setAvailabilitySelected] =
      useState<CodexAvailability | null>(null);
    const { data: availabilities = [], isPending } = useQuery({
      queryFn: () =>
        CodexSdk.marketplace
          .availabilities()
          .then((s) => Promises.rejectOnError(s))
          .then((res) => res.sort((a, b) => b.totalSize - a.totalSize)),
      queryKey: ["availabilities"],
      refetchOnWindowFocus: false,
      retry: false,
      throwOnError: true,
    });

    const onReservationsShow = (a: CodexAvailability) =>
      setAvailabilitySelected(a);

    const onReservationsClose = () => setAvailabilitySelected(null);

    const allocation = availabilities
      .map((a) => ({
        title: Strings.shortId(a.id),
        size: a.totalSize,
      }))
      .slice(0, 7);

    return (
      <div className="container">
        <AvailabilityReservations
          availability={availabilitySelected}
          onClose={onReservationsClose}
          open={!!availabilitySelected}></AvailabilityReservations>

        <div className="availabilities-content">
          {isPending ? (
            <div className="purchases-loader">
              <Spinner width="3rem" />
            </div>
          ) : (
            <div className="availabilities-table">
              <AvailabilitiesTable
                // onEdit={onOpen}
                availabilities={availabilities}
                onReservationsShow={onReservationsShow}
              />
            </div>
          )}

          <div className="availabilities-space">
            <SpaceAllocation data={allocation} />
          </div>
        </div>
      </div>
    );
  },
});
