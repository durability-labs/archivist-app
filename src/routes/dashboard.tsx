import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import "./dashboard.css";
import {
  MenuItem,
  MenuItemComponentProps,
  NetworkIndicator,
  Page,
} from "@codex/marketplace-ui-components";
import {
  Home,
  Star,
  ShoppingBag,
  Server,
  Settings,
  HelpCircle,
} from "lucide-react";
import { ICON_SIZE } from "../utils/constants";
import { NodeIndicator } from "../components/NodeIndicator/NodeIndicator";
import { HttpNetworkIndicator } from "../components/HttpNetworkIndicator/HttpNetworkIndicator";

const Layout = () => {
  const Right = (
    <>
      <NodeIndicator />
      <HttpNetworkIndicator />
    </>
  );

  const items = [
    {
      type: "menu-item",
      Component: (p: MenuItemComponentProps) => (
        <Link to="/dashboard" activeOptions={{ exact: true }} {...p}>
          <Home size={ICON_SIZE} />
          Dashboard
        </Link>
      ),
    },
    {
      type: "menu-item",
      Component: (p: MenuItemComponentProps) => (
        <Link to="/dashboard/favorites" {...p}>
          <Star size={ICON_SIZE} />
          Favorites
        </Link>
      ),
    },
    {
      type: "separator",
    },
    {
      type: "menu-title",
      title: "rent",
    },
    {
      type: "menu-item",
      Component: (p: MenuItemComponentProps) => (
        <Link to="/dashboard/purchases" {...p}>
          <ShoppingBag size={ICON_SIZE} />
          Purchases
        </Link>
      ),
    },
    {
      type: "separator",
    },
    {
      type: "menu-title",
      title: "host",
    },
    {
      type: "menu-item",
      Component: (p: MenuItemComponentProps) => (
        <Link to="/dashboard/availabilities" {...p}>
          <Server size={ICON_SIZE} />
          Availabilities
        </Link>
      ),
    },
    {
      type: "menu-item",
      Component: (p: MenuItemComponentProps) => (
        <Link to="/dashboard/settings" {...p}>
          <Settings size={ICON_SIZE} />
          Settings
        </Link>
      ),
    },
    {
      type: "separator",
    },
    {
      type: "menu-item",
      Component: (p: MenuItemComponentProps) => (
        <a {...p}>
          <HelpCircle size={"1.25rem"} /> Help
        </a>
      ),
    },
  ] satisfies MenuItem[];

  return <Page children={<Outlet />} items={items} Right={Right} />;
};

export const Route = createFileRoute("/dashboard")({
  component: Layout,
});
