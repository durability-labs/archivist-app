import {
  Home,
  Star,
  Server,
  Settings,
  HelpCircle,
  ShoppingBag,
} from "lucide-react";
import { attributes } from "../../utils/attributes";
import { Link } from "@tanstack/react-router";
import "./Menu.css";
import logo from "../../assets/logo-inverse.svg";
import { ICON_SIZE } from "../../utils/constants";

type Props = {
  expanded: boolean;
  onClose: () => void;
};

export function Menu({ expanded, onClose }: Props) {
  const attr = attributes({ "aria-expanded": expanded });

  return (
    <>
      <div className="backdrop" onClick={onClose} {...attr}></div>

      <aside className="menu" {...attr}>
        <div className="menu-container">
          <div className="menu-header">
            <img width="50" height="50" src={logo} alt="Logo" />
            <span className="menu-separator">|</span>
            <span className="menu-name">Codex</span>
          </div>
          <Link
            onClick={onClose}
            to="/dashboard"
            activeOptions={{ exact: true }}
            className="menu-item">
            <Home size={ICON_SIZE} />
            Dashboard
          </Link>
          <Link
            onClick={onClose}
            to="/dashboard/favorites"
            className="menu-item">
            <Star size={ICON_SIZE} />
            Favorites
          </Link>
          <hr />
          <small className="menu-title">Rent</small>
          <Link
            onClick={onClose}
            to="/dashboard/purchases"
            className="menu-item">
            <ShoppingBag size={ICON_SIZE} />
            Purchases
          </Link>
          <hr />
          <small className="menu-title">Hosts</small>
          <Link
            onClick={onClose}
            to="/dashboard/availabilities"
            className="menu-item">
            <Server size={ICON_SIZE} />
            Availabilities
          </Link>
          <Link
            onClick={onClose}
            to="/dashboard/settings"
            className="menu-item">
            <Settings size={ICON_SIZE} />
            Settings
          </Link>
          <hr />
          <Link onClick={onClose} to="/dashboard/help" className="menu-item">
            <HelpCircle size={ICON_SIZE} />
            Help
          </Link>
        </div>
      </aside>
    </>
  );
}
