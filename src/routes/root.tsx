import "./root.css";
import { Menu } from "../components/Menu/Menu";
import { useCallback, useState } from "react";
import { AppBar } from "../components/AppBar/AppBar";
import { Backdrop } from "@durability-labs/archivist-app-components";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { useIsMobile } from "../hooks/useMobile";

export const Root = () => {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(!isMobile);

  const onExpanded = useCallback((val: boolean) => setIsExpanded(val), []);

  const onIconClick = () => {
    if (isMobile) {
      setIsExpanded(true);
    }
  };

  const onClose = () => setIsExpanded(false);

  return (
    <div className="layout">
      <Menu isExpanded={isExpanded} onExpanded={onExpanded}></Menu>

      <main>
        <AppBar onIconClick={onIconClick} onExpanded={onExpanded} />
        <div>
          <ScrollRestoration></ScrollRestoration>
          <Outlet />
        </div>
      </main>

      <Backdrop onClose={onClose} open={isExpanded && isMobile}></Backdrop>
    </div>
  );
};
