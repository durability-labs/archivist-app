import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CodexSdk } from "../../sdk/codex";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  BreakCellRender,
  Button,
  DefaultCellRender,
  DurationCellRender,
  StateCellRender,
  Table,
} from "@codex/marketplace-ui-components";
import { StorageRequestStepper } from "../../components/StorageRequestSetup/StorageRequestStepper";
import "./purchases.css";
import { classnames } from "../../utils/classnames";

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
    console.error(data.data);
    return <div>Error: {data.data.message}</div>;
    // TODO Manage error
  }

  const headers = [
    "id",
    "state",
    "duration",
    "slots",
    "reward",
    "proof probability",
    "error",
  ];

  const cells = [
    BreakCellRender,
    StateCellRender({ cancelling: "success" }),
    DurationCellRender,
    DefaultCellRender,
    DefaultCellRender,
    DefaultCellRender,
    DefaultCellRender,
  ];

  const purchases =
    data?.data.map((p) => [
      p.requestId.toString(),
      p.state,
      p.request.ask.duration.toString(),
      p.request.ask.slots.toString(),
      p.request.ask.reward.toString(),
      p.request.ask.proofProbability.toString(),
      p.error,
    ]) || [];

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
      <Table headers={headers} data={purchases} cells={cells} />
    </div>
  );
};

export const Route = createFileRoute("/dashboard/purchases")({
  component: Purchases,
});
