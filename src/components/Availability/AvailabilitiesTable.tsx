import { Cell, Row, Table } from "@codex-storage/marketplace-ui-components";
import { TruncateCell } from "../TruncateCell/TruncateCell";
import { PrettyBytes } from "../../utils/bytes";
import { AvailabilityActionsCell } from "./AvailabilityActionsCell";
import { CodexAvailability } from "@codex-storage/sdk-js/async";
import { Times } from "../../utils/times";
import { useState } from "react";
import { AvailabilityReservations } from "./AvailabilityReservations";

type Props = {
  // onEdit: () => void;
  availabilities: CodexAvailability[];
};

export function AvailabilitiesTable({ availabilities }: Props) {
  const [availability, setAvailability] = useState<CodexAvailability | null>(
    null
  );
  const headers = [
    "id",
    "total size",
    "duration",
    "min price",
    "max collateral",
    "actions",
  ];

  const onReservationsShow = (a: CodexAvailability) => setAvailability(a);

  const onReservationsClose = () => setAvailability(null);

  const rows = availabilities.map((a) => (
    <Row
      cells={[
        <TruncateCell value={a.id} />,
        <Cell>{PrettyBytes(a.totalSize)}</Cell>,
        <Cell>{Times.pretty(a.duration)}</Cell>,
        <Cell>{a.minPrice}</Cell>,
        <Cell>{a.maxCollateral}</Cell>,
        <AvailabilityActionsCell
          availability={a}
          onReservationsShow={onReservationsShow}
        />,
      ]}></Row>
  ));

  return (
    <>
      <Table headers={headers} rows={rows} />
      <AvailabilityReservations
        availability={availability}
        onClose={onReservationsClose}
        open={!!availability}></AvailabilityReservations>
    </>
  );
}
