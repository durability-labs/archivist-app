import { useQuery } from "@tanstack/react-query";
import Loader from "../../assets/loader.svg";
import { CodexSdk } from "../../sdk/codex";
import { Card } from "@codex/marketplace-ui-components";

export function Debug() {
  const { data, isPending } = useQuery({
    queryFn: () => CodexSdk.debug().then((debug) => debug.info()),
    queryKey: ["debug"],
  });

  if (isPending) {
    return (
      <Card title="Debug">
        <img src={Loader} width={24} height={24} alt="Loader" />
      </Card>
    );
  }

  if (data?.error) {
    // TODO display error
    return (
      <Card title="Debug">
        <p>{data?.data.message || ""}</p>
      </Card>
    );
  }

  return (
    <Card title="Debug">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Card>
  );
}
