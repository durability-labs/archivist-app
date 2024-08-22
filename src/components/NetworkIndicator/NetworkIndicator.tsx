import { useNetwork } from "../../network/useNetwork";

export function NetworkIndicator() {
  const online = useNetwork();

  if (online) {
    return (
      <div className="indicator">
        <div className="indicator-point indicator-point-online"></div>
        <span>Online</span>
      </div>
    );
  }

  return (
    <div className="indicator">
      <div className="indicator-point indicator-point-offline"></div>
      <span>Offline</span>
    </div>
  );
}
