import { EmptyPlaceholder } from "@codex-storage/marketplace-ui-components";
import { createFileRoute } from "@tanstack/react-router";
import "./availabilities.css";

export const Route = createFileRoute("/dashboard/availabilities")({
  component: () => {
    return (
      <div className="availabilities">
        <EmptyPlaceholder
          title="Nothing to show"
          message="This page is in progress."
        />
      </div>
    );
  },
});
