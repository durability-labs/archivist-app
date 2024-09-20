import { Placeholder } from "@codex-storage/marketplace-ui-components";
import { createFileRoute } from "@tanstack/react-router";
import "./availabilities.css";
import { CircleX } from "lucide-react";
import { AvailabilityCreate } from "../../components/Availability/AvailabilityCreate";
import { Promises } from "../../utils/promises";
import { CodexSdk } from "../../sdk/codex";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/dashboard/availabilities")({
  component: () => {
    const {
      data = {
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
    });

    if (isError) {
      return (
        <Placeholder
          Icon={<CircleX size={"4em"}></CircleX>}
          title="Something went wrong"
          message={error.message}></Placeholder>
      );
    }

    return (
      <div className="container">
        <div className="availabilities-actions">
          <AvailabilityCreate space={data} />
        </div>
      </div>
    );
  },
});
