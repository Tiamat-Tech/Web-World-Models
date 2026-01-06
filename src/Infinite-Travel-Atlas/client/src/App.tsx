import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { useThemeController } from "./context/ThemeContext";
import { VibePanel } from "./components/VibePanel";

export default function App() {
  const { mode, toggleMode } = useThemeController();
  const location = useLocation();
  const isAtlasView = location.pathname === "/";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    if (isAtlasView) {
      document.body.classList.add("atlas-body");
    } else {
      document.body.classList.remove("atlas-body");
    }
    return () => {
      document.body.classList.remove("atlas-body");
    };
  }, [isAtlasView]);

  const mainClassName = `app-main${isAtlasView ? " app-main--atlas" : ""}`;

  return (
    <div className="app-shell">
      <main className={mainClassName}>
        <Outlet />
      </main>
      <footer className="app-footer">
        <div className="app-footer-inner">
          <span className="muted">&copy; {new Date().getFullYear()} Roam Atlas. Crafted for curious travelers.</span>
        </div>
      </footer>
      <button className="theme-toggle-floating" type="button" onClick={toggleMode}>
        {mode === "day" ? "Night mode" : "Day mode"}
      </button>
      <VibePanel />
    </div>
  );
}
