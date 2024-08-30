import { NetworkIndicator } from "@codex-storage/marketplace-ui-components";
import { useNetwork } from "../../network/useNetwork";

export function HttpNetworkIndicator() {
  const online = useNetwork();

  const text = online ? "Online" : "Offline";

  return <NetworkIndicator online={online} text={text} />;
}
