import { Spinner, Cell, Table } from "@codex-storage/marketplace-ui-components";
import { useQuery } from "@tanstack/react-query";
import prettyMilliseconds from "pretty-ms";
import { CodexSdk } from "../../sdk/codex";
import { Promises } from "../../utils/promises";
import { TruncateCell } from "../TruncateCell/TruncateCell";
import { PrettyBytes } from "../../utils/bytes";
import { AvailabilityActionsCell } from "./AvailabilityActionsCell";
import { CodexAvailability } from "@codex-storage/sdk-js/async";

type Props = {
  // onEdit: () => void;
  onReservationsShow: (availability: CodexAvailability) => void;
};

export function AvailabilitiesTable({ onReservationsShow }: Props) {
  const { data, isPending } = useQuery({
    queryFn: () =>
      CodexSdk.marketplace
        .availabilities()
        .then((s) => Promises.rejectOnError(s)),
    queryKey: ["availabilities"],
    refetchOnWindowFocus: false,
    retry: false,
    throwOnError: true,
  });

  if (isPending) {
    return (
      <div className="purchases-loader">
        <Spinner width="3rem" />
      </div>
    );
  }

  const headers = [
    "id",
    "total size",
    "duration",
    "min price",
    "max collateral",
    "actions",
  ];

  const sorted = [...(data || [])].reverse();
  const cells =
    sorted.map((a) => {
      return [
        <TruncateCell value={a.id} />,
        <Cell value={PrettyBytes(a.totalSize)} />,
        <Cell value={prettyMilliseconds(a.duration)} />,
        <Cell value={a.minPrice.toString()} />,
        <Cell value={a.maxCollateral.toString()} />,
        <AvailabilityActionsCell
          availability={a}
          onReservationsShow={onReservationsShow}
        />,
      ];
    }) || [];

  return <Table headers={headers} cells={cells} />;
}
