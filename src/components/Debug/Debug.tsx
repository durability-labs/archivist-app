import { Spinner } from "@durability-labs/archivist-app-components";
import { useDebug } from "../../hooks/useDebug";

const throwOnError = true;

export function Debug() {
  const { data, isPending } = useDebug(throwOnError);

  if (isPending) {
    return (
      <div>
        <Spinner width="3rem" />
      </div>
    );
  }

  return (
    <>
      <h3>Debug</h3>
      <pre key={Date.now()}>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}
