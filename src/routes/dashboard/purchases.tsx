import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CodexSdk } from "../../sdk/codex";
import { Cell, Spinner, Table } from "@codex-storage/marketplace-ui-components";
import { StorageRequestStepper } from "../../components/StorageRequestSetup/StorageRequestStepper";
import "./purchases.css";
import { FileCell } from "../../components/FileCellRender/FileCell";
import { CustomStateCellRender } from "../../components/CustomStateCellRender/CustomStateCellRender";
import prettyMilliseconds from "pretty-ms";
import { ErrorBoundary } from "../../components/ErrorBoundary/ErrorBoundary";
import { Promises } from "../../utils/promises";
import { TruncateCell } from "../../components/TruncateCell/TruncateCell";

const Purchases = () => {
  const { data, isPending } = useQuery({
    queryFn: () =>
      CodexSdk.marketplace.purchases().then((s) => Promises.rejectOnError(s)),
    queryKey: ["purchases"],
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
    "file",
    "request id",
    "duration",
    "slots",
    "reward",
    "proof probability",
    "state",
  ];

  const sorted = [...(data || [])].reverse();
  const cells =
    sorted.map((p, index) => {
      const r = p.request;
      const ask = p.request.ask;
      const duration = parseInt(p.request.ask.duration, 10) * 1000;
      const pf = parseInt(p.request.ask.proofProbability, 10) * 1000;

      return [
        <FileCell requestId={r.id} purchaseCid={r.content.cid} index={index} />,
        <TruncateCell value={r.id} />,
        <Cell value={prettyMilliseconds(duration, { verbose: true })} />,
        <Cell value={ask.slots.toString()} />,
        <Cell value={ask.reward + " CDX"} />,
        <Cell value={(pf / 1000).toString()} />,
        <CustomStateCellRender state={p.state} message={p.error} />,
      ];
    }) || [];

  // TODO make name uniforms

  return (
    <div className="container">
      <div className="purchases-actions">
        <StorageRequestStepper />
      </div>

      <Table headers={headers} cells={cells} />
    </div>
  );
};

// TODO make uniforms for availabilities

export const Route = createFileRoute("/dashboard/purchases")({
  component: () => (
    <ErrorBoundary card={true}>
      <Purchases />
    </ErrorBoundary>
  ),
});
