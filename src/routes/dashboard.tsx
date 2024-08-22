import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import "./dashboard.css";
import { Menu } from "../components/Menu/Menu";
import { AppBar } from "../components/AppBar/AppBar";

const Layout = () => {
  const [expanded, setExpanded] = useState(false);

  const onExpand = () => setExpanded(true);

  const onClose = () => setExpanded(false);

  return (
    <>
      <Menu expanded={expanded} onClose={onClose} />

      <main>
        <AppBar onExpand={onExpand} />
        <Outlet />
      </main>
    </>
  );
};

export const Route = createFileRoute("/dashboard")({
  component: Layout,
});
