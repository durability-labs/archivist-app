import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { CodexSdk } from "../../sdk/codex";
import { Promises } from "../../utils/promises";
import { NetworkIndicator } from "@codex/marketplace-ui-components";

function useNodeNetwork() {
  const { data, isError } = useQuery({
    queryKey: ["spr"],
    queryFn: async () =>
      CodexSdk.node()
        .then((node) => node.spr())
        .then(Promises.rejectOnError),
    retry: false,
    refetchInterval: 5000,
  });

  // TODO handle error

  return !isError && !!data;
}

export function NodeIndicator() {
  const queryClient = useQueryClient();
  const isCodexOnline = useNodeNetwork();

  useEffect(() => {
    queryClient.invalidateQueries({
      type: "active",
      refetchType: "all",
    });
  }, [queryClient, isCodexOnline]);

  return <NetworkIndicator online={isCodexOnline} text="Codex node" />;
}
