import "./root.css";
import { Menu } from "../components/Menu/Menu";
import { useState } from "react";
import { AppBar } from "../components/AppBar/AppBar";
import { Backdrop } from "@codex-storage/marketplace-ui-components";
import { Outlet, ScrollRestoration } from "react-router-dom";

export const Root = () => {
  const [hasMobileMenu, setHasMobileMenu] = useState(false);

  const onIconClick = () => {
    if (window.innerWidth <= 999) {
      setHasMobileMenu(true);
    }
  };

  const onClose = () => setHasMobileMenu(false);

  return (
    <div className="layout">
      <Menu></Menu>

      <main>
        <AppBar onIconClick={onIconClick} />
        <div>
          <ScrollRestoration></ScrollRestoration>
          <Outlet />
        </div>
      </main>

      <Backdrop onClose={onClose} open={hasMobileMenu}></Backdrop>
    </div>
  );
};
