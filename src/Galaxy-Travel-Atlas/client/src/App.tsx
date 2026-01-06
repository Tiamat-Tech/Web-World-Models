import { Outlet, useLocation } from "react-router-dom";

import { useThemeController } from "./context/ThemeContext";
import { VibePanel } from "./components/VibePanel";
import { useEffect } from "react";

export default function App() {
  const { mode, toggleMode } = useThemeController();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <main className="app-main">
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
