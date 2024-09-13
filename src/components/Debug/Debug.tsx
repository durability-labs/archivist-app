import { useQuery } from "@tanstack/react-query";
import { CodexSdk } from "../../sdk/codex";
import { Placeholder, Spinner } from "@codex-storage/marketplace-ui-components";
import { Promises } from "../../utils/promises";
import { CircleX } from "lucide-react";

export function Debug() {
  const { data, isPending, isError, error } = useQuery({
    queryFn: () => CodexSdk.debug.info().then((s) => Promises.rejectOnError(s)),
    queryKey: ["debug"],
  });

  if (isPending) {
    return (
      <div className="settings-debug-loader">
        <Spinner width="3rem" />
      </div>
    );
  }

  if (isError) {
    return (
      <Placeholder
        Icon={<CircleX size={"4em"}></CircleX>}
        title="Something went wrong"
        message={error.message}></Placeholder>
    );
  }

  return (
    <>
      <h3>Debug</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}
