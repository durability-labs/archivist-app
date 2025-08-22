import {
  Cell,
  Row,
  Spinner,
  Table,
  TabSortState,
} from "@durability-labs/archivist-app-components";
import { Times } from "../../utils/times";
import { useState } from "react";
import { FileCell } from "../../components/FileCellRender/FileCell";
import { useData } from "../../hooks/useData";
import { useQuery } from "@tanstack/react-query";
import { ArchivistSdk } from "../../sdk/archivist";
import { Promises } from "../../utils/promises";
import { ArchivistPurchase } from "@durability-labs/archivist-sdk-js";
import { TruncateCell } from "../TruncateCell/TruncateCell";
import { CustomStateCellRender } from "../CustomStateCellRender/CustomStateCellRender";
import { PurchaseUtils } from "./purchase.utils";

type SortFn = (a: ArchivistPurchase, b: ArchivistPurchase) => number;

export function PurchasesTable() {
  const content = useData();
  const { data, isPending } = useQuery({
    queryFn: () =>
      ArchivistSdk.marketplace()
        .purchases()
        .then((s) => Promises.rejectOnError(s)),
    queryKey: ["purchases"],

    // No need to retry because if the connection to the node
    // is back again, all the queries will be invalidated.
    retry: false,

    // The client node should be local, so display the cache value while
    // making a background request looks good.
    staleTime: 0,

    // Refreshing when focus returns can be useful if a user comes back
    // to the UI after performing an operation in the terminal.
    refetchOnWindowFocus: true,

    initialData: [],

    // Throw the error to the error boundary
    throwOnError: true,
  });

  // const onMetadata = (
  //   requestId: string,
  //   { uploadedAt }: { uploadedAt: number }
  // ) => {
  //   setMetadata((m) => ({ ...m, [requestId]: uploadedAt }));
  //   setSortFn(() =>
  //     PurchaseUtils.sortByUploadedAt("desc", {
  //       ...metadata,
  //       [requestId]: uploadedAt,
  //     })
  //   );
  // };

  const [sortFn, setSortFn] = useState<SortFn>(() =>
    PurchaseUtils.sortByDuration("desc")
  );

  const onSortByDuration = (state: TabSortState) =>
    setSortFn(() => PurchaseUtils.sortByDuration(state));

  const onSortByReward = (state: TabSortState) =>
    setSortFn(() => PurchaseUtils.sortByReward(state));

  const onSortByState = (state: TabSortState) =>
    setSortFn(() => PurchaseUtils.sortByState(state));

  // const onSortByUploadedAt = (state: TabSortState) =>
  //   setSortFn(() => PurchaseUtils.sortByUploadedAt(state, metadata));

  const headers = [
    ["file"],
    ["request id"],
    ["duration", onSortByDuration],
    ["slots"],
    ["price per byte", onSortByReward],
    ["proof probability"],
    ["state", onSortByState],
  ] satisfies [string, ((state: TabSortState) => void)?][];

  const sorted = sortFn ? [...data].sort(sortFn) : data;

  const rows = sorted.map((p, index) => {
    const r = p.request;
    const ask = p.request.ask;
    const duration = parseInt(ask.duration, 10);
    const pf = parseInt(ask.proofProbability, 10);
    return (
      <Row
        cells={[
          <FileCell
            requestId={r.id}
            purchaseCid={r.content.cid}
            index={index}
            data={content}
          />,
          <TruncateCell value={r.id} />,
          <Cell>{Times.pretty(duration)}</Cell>,
          <Cell>{ask.slots.toString()}</Cell>,
          <Cell>{p.request.ask.pricePerBytePerSecond + " ARC"}</Cell>,
          <Cell>{pf.toString()}</Cell>,
          <CustomStateCellRender state={p.state} message={p.error} />,
        ]}></Row>
    );
  });

  if (isPending) {
    return (
      <div>
        <Spinner width="3rem" />
      </div>
    );
  }

  return (
    <>
      <Table headers={headers} rows={rows} defaultSortIndex={2} />
    </>
  );
}
