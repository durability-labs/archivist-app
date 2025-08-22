import "./appBar.css";
import { classnames } from "../../utils/classnames";
import { useNetwork } from "../../network/useNetwork";
import { useQueryClient } from "@tanstack/react-query";
import { ReactElement, useEffect } from "react";
import { useArchivistConnection } from "../../hooks/useArchivistConnection";
import { usePersistence } from "../../hooks/usePersistence";
import DashboardIcon from "../../assets/icons/dashboard.svg?react";
import PeersIcon from "../../assets/icons/peers.svg?react";
import NodesIcon from "../../assets/icons/nodes.svg?react";
import FilesIcon from "../../assets/icons/files.svg?react";
import LogsIcon from "../../assets/icons/logs.svg?react";
import HostIcon from "../../assets/icons/host.svg?react";
import SettingsIcon from "../../assets/icons/settings.svg?react";
import WalletIcon from "../../assets/icons/wallet.svg?react";
import NetworkFlashIcon from "../../assets/icons/flash.svg?react";
import PurchasesIcon from "../../assets/icons/purchase.svg?react";
import HelpIcon from "../../assets/icons/help.svg?react";
import DisclaimerIcon from "../../assets/icons/disclaimer.svg?react";
import { WalletConnect } from "../WalletLogin/WalletLogin";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/icons/logo.svg?react";
import { useIsMobile } from "../../hooks/useMobile";

type Props = {
  onIconClick: () => void;
  onExpanded: (val: boolean) => void;
};

const icons: Record<string, ReactElement> = {
  dashboard: <DashboardIcon width={24} />,
  peers: <PeersIcon width={24} />,
  settings: <SettingsIcon width={24} />,
  files: <FilesIcon width={24} />,
  logs: <LogsIcon width={24} />,
  availabilities: <HostIcon width={24} />,
  wallet: <WalletIcon width={24} />,
  purchases: <PurchasesIcon width={24} />,
  help: <HelpIcon width={24} />,
  disclaimer: <DisclaimerIcon width={24} />,
};

const descriptions: Record<string, string> = {
  dashboard: "Get Overview of your Archivist Vault.",
  peers: "Monitor your Archivist peer connections.",
  settings: "Manage your Archivist Vault.",
  files: "Manage your files in your local vault.",
  logs: "Manage your logs and debug console.",
  availabilities: "Manage your host data.",
  wallet: "Manage your Archivist wallet.",
  purchases: "Manage your storage requests.",
  help: "Quick help resources.",
  disclaimer: "Important information.",
};

export function AppBar({ onIconClick, onExpanded }: Props) {
  const online = useNetwork();
  const queryClient = useQueryClient();
  const archivist = useArchivistConnection();
  const persistence = usePersistence(archivist.enabled);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    queryClient.invalidateQueries({
      type: "active",
      refetchType: "all",
    });
  }, [queryClient, archivist.enabled]);

  const offline = !online || !archivist.enabled;

  const onNodeClick = () => navigate("/dashboard/settings");

  const title =
    location.pathname.split("/")[2] || location.pathname.split("/")[1];
  const networkIconColor = online ? "#3EE089" : "var(--archivist-color-error)";
  const nodesIconColor =
    archivist.enabled === false
      ? "var(--archivist-color-error)"
      : persistence.enabled
        ? "#3EE089"
        : "var(--archivist-input-color-warning)";

  const icon = isMobile ? (
    <Logo onClick={() => onExpanded(true)} width={30}></Logo>
  ) : (
    icons[title]
  );

  return (
    <>
      <div
        className={classnames(
          ["app-bar"],
          ["app-bar--offline", offline],
          ["app-bar--no-persistence", !persistence.enabled]
        )}>
        <div className="row gap">
          <span onClick={onIconClick}>{icon}</span>

          <div>
            <h1>{title}</h1>
            <h2>{descriptions[title]}</h2>
          </div>
        </div>
        <aside className="row gap">
          <WalletConnect></WalletConnect>
          <div className="row gap">
            <NetworkFlashIcon color={networkIconColor} />
            <span>Network</span>
          </div>
          <div className="row gap" onClick={onNodeClick}>
            <NodesIcon color={nodesIconColor} width={20} />
            <span>Node</span>
          </div>
        </aside>
      </div>
    </>
  );
}
