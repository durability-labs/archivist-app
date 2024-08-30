import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CodexSdk } from "../../sdk/codex";
import { NetworkIndicator, Toast } from "@codex/marketplace-ui-components";

export function NodeIndicator() {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState({
    time: 0,
    message: "",
  });

  const { data, isError } = useQuery({
    queryKey: ["spr"],
    queryFn: async () =>
      CodexSdk.node()
        .then((node) => node.spr())
        .then((data) => {
          if (data.error) {
            setToast({
              message: "Cannot connect to the Codex node.",
              time: Date.now(),
            });
          }

          // TODO sentry debug

          return data;
        }),
    retry: false,
    refetchInterval: 5000,
  });

  const isCodexOnline = !isError && !!data;

  useEffect(() => {
    queryClient.invalidateQueries({
      type: "active",
      refetchType: "all",
    });
  }, [queryClient, isCodexOnline]);

  return (
    <>
      <Toast message={toast.message} time={toast.time} variant="success" />
      <NetworkIndicator online={isCodexOnline} text="Codex node" />
    </>
  );
}
