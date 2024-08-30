import { useQuery } from "@tanstack/react-query";
import Loader from "../../assets/loader.svg";
import { CodexSdk } from "../../sdk/codex";
import { Card, Spinner } from "@codex-storage/marketplace-ui-components";
import { Promises } from "../../utils/promises";

export function Debug() {
  const { data, isPending } = useQuery({
    queryFn: () =>
      CodexSdk.debug()
        .then((debug) => debug.info())
        .then((s) => Promises.rejectOnError(s)),
    queryKey: ["debug"],
  });

  if (isPending) {
    return (
      <div className="settings-debug-loader">
        <Spinner width="3rem" />
      </div>
    );
  }

  return (
    <>
      <h3>Debug</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}
