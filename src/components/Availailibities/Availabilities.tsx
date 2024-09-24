import {
  SpaceAllocation,
  Spinner,
} from "@codex-storage/marketplace-ui-components";
import { useQuery } from "@tanstack/react-query";
import { Promises } from "../../utils/promises";
import { AvailabilityCreate } from "../Availability/AvailabilityCreate";
import { CodexSdk } from "../../sdk/codex";
import { Strings } from "../../utils/strings";
import { CodexAvailability } from "@codex-storage/sdk-js";
import { useState } from "react";
import { AvailabilitiesTable } from "../Availability/AvailabilitiesTable";
import { AvailabilityReservations } from "../Availability/AvailabilityReservations";
import "./Availabilities.css";

export function Availabilities() {
  {
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

    const {
      data: space = {
        quotaMaxBytes: 0,
        quotaReservedBytes: 0,
        quotaUsedBytes: 0,
        totalBlocks: 0,
      },
      isError,
      error,
    } = useQuery({
      queryFn: () =>
        CodexSdk.data.space().then((s) => Promises.rejectOnError(s)),
      queryKey: ["space"],
      // TODO comment staleTime
      staleTime: 24 * 60 * 60 * 1000,
    });

    const onReservationsShow = (a: CodexAvailability) =>
      setAvailabilitySelected(a);

    const onReservationsClose = () => setAvailabilitySelected(null);

    const allocation = availabilities
      .map((a) => ({
        title: Strings.shortId(a.id),
        size: a.totalSize,
      }))
      .slice(0, 6);

    return (
      <div className="container">
        {availabilitySelected && (
          <AvailabilityReservations
            availability={availabilitySelected}
            onClose={onReservationsClose}
            open={!!availabilitySelected}></AvailabilityReservations>
        )}

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
            <div>
              <SpaceAllocation data={allocation} />
            </div>
            <div>
              <AvailabilityCreate space={space} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
