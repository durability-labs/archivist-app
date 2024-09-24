import {
  Placeholder,
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

const defaultSpace = {
  quotaMaxBytes: 0,
  quotaReservedBytes: 0,
  quotaUsedBytes: 0,
  totalBlocks: 0,
};

export function Availabilities() {
  {
    // Error will be catched in ErrorBounday
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

    // Error will be catched in ErrorBounday
    const { data: space = defaultSpace } = useQuery({
      queryFn: () =>
        CodexSdk.data.space().then((s) => Promises.rejectOnError(s)),
      queryKey: ["space"],
      // TODO comment staleTime
      staleTime: 24 * 60 * 60 * 1000,
    });

    const allocation = availabilities
      .map((a) => ({
        title: Strings.shortId(a.id),
        size: a.totalSize,
      }))
      .slice(0, 6);

    return (
      <div className="container">
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
