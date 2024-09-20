import { createFileRoute } from "@tanstack/react-router";
import "./availabilities.css";
import { AvailabilitiesTable } from "../../components/Availability/AvailabilitiesTable";
import { useState } from "react";
import { AvailabilityReservations } from "../../components/Availability/AvailabilityReservations";
import { CodexAvailability } from "@codex-storage/sdk-js/async";

export const Route = createFileRoute("/dashboard/availabilities")({
  component: () => {
    const [availabilitySelected, setAvailabilitySelected] =
      useState<CodexAvailability | null>(null);

    const onReservationsShow = (a: CodexAvailability) =>
      setAvailabilitySelected(a);

    const onReservationsClose = () => setAvailabilitySelected(null);

    return (
      <div className="container">
        <AvailabilityReservations
          availability={availabilitySelected}
          onClose={onReservationsClose}
          open={!!availabilitySelected}></AvailabilityReservations>

        <AvailabilitiesTable
          // onEdit={onOpen}
          onReservationsShow={onReservationsShow}
        />
      </div>
    );
  },
});
