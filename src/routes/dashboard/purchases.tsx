import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CodexSdk } from "../../sdk/codex";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button, Cell, Table } from "@codex/marketplace-ui-components";
import { StorageRequestStepper } from "../../components/StorageRequestSetup/StorageRequestStepper";
import "./purchases.css";
import { classnames } from "../../utils/classnames";
import { FileCell } from "../../components/FileCellRender/FIleCell";
import { CustomStateCellRender } from "../../components/CustomStateCellRender/CustomStateCellRender";
import prettyMilliseconds from "pretty-ms";

const Purchases = () => {
  const [open, setOpen] = useState(false);
  const { data, isPending } = useQuery({
    queryFn: () =>
      CodexSdk.marketplace().then((marketplace) => marketplace.purchases()),
    queryKey: ["purchases"],
  });

  if (isPending) {
    return <div>Pending</div>;
  }

  if (data?.error) {
    return <div>Error: {data.data.message}</div>;
    // TODO Manage error
  }

  const headers = [
    "cid",
    "duration",
    "slots",
    "reward",
    "proof probability",
    "state",
  ];

  const sorted = [...(data?.data || [])].reverse();
  const cells =
    sorted.map((p, index) => {
      const r = p.request;
      const ask = p.request.ask;
      const duration = parseInt(p.request.ask.duration, 10) * 1000;
      const pf = parseInt(p.request.ask.proofProbability, 10) * 1000;

      return [
        <FileCell requestId={r.id} purchaseCid={r.content.cid} index={index} />,
        <Cell value={prettyMilliseconds(duration)} />,
        <Cell value={ask.slots + " hosts"} />,
        <Cell value={ask.reward + " tokens"} />,
        <Cell value={"Every " + prettyMilliseconds(pf)} />,
        <CustomStateCellRender state={p.state} message={p.error} />,
      ];
    }) || [];

  return (
    <div className="container">
      <div className="purchases-actions">
        <Button
          label="Storage Request"
          Icon={Plus}
          onClick={() => setOpen(true)}
          variant="primary"
        />
      </div>

      <StorageRequestStepper
        className={classnames(
          ["purchases-modal"],
          ["purchases-modal-open", open]
        )}
        open={open}
        onClose={() => setOpen(false)}
      />

      {!open && <Table headers={headers} cells={cells} />}
    </div>
  );
};

export const Route = createFileRoute("/dashboard/purchases")({
  component: Purchases,
});
