import { Menu } from "lucide-react";
import { NetworkIndicator } from "../NetworkIndicator/NetworkIndicator";
import { NodeIndicator } from "../NodeIndicator/NodeIndicator";
import "./AppBar.css";
import { ICON_SIZE } from "../../utils/constants";

type Props = {
  onExpand: () => void;
};

export function AppBar({ onExpand }: Props) {
  return (
    <div className="appBar">
      <div className="appBar-left">
        <a className="appBar-burger" href="#">
          <Menu onClick={onExpand} size={ICON_SIZE} />
        </a>
        <span>Home</span>
      </div>
      <div className="appBar-right">
        <NodeIndicator />
        <NetworkIndicator />
      </div>
    </div>
  );
}
