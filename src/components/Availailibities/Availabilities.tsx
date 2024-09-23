import { Placeholder } from "@codex-storage/marketplace-ui-components";
import { useQuery } from "@tanstack/react-query";
import { CircleX } from "lucide-react";
import { Promises } from "../../utils/promises";
import { AvailabilityCreate } from "../Availability/AvailabilityCreate";
import { CodexSdk } from "../../sdk/codex";

export function Availabilities() {
  {
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
  }
}
