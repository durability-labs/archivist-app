import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { CodexSdk } from "../../sdk/codex";
import { Promises } from "../../utils/promises";

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

  if (!isCodexOnline) {
    return (
      <div className="indicator">
        <div className="indicator-point indicator-point-offline"></div>
        <span>Codex node</span>
      </div>
    );
  }

  return (
    <div className="indicator">
      <div className="indicator-point indicator-point-online"></div>
      <span>Codex node</span>
    </div>
  );
}
