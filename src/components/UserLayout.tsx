import { useState } from "react";
import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { supabase } from "../lib/supabaseClient";

interface Props {
  children: ReactNode;
}

export default function UserLayout({ children }: Props) {
  const navigate = useNavigate();
  const [toast, setToast] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        setToast("Unable to log out. Please try again.");
        setLoggingOut(false);
        return;
      }

      setToast("You have been logged out successfully.");
      window.setTimeout(() => navigate("/login", { replace: true }), 900);
    } catch (error) {
      console.error("Logout failed:", error);
      setToast("Unable to log out. Please try again.");
      setLoggingOut(false);
    }
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <Logo />

        <nav>
          <NavLink to="/dashboard">⌂ Dashboard</NavLink>

          <NavLink to="/scores/add">◷ My Scores</NavLink>

          <NavLink to="/charity-selection">♡ My Charity</NavLink>

          <NavLink to="/draw-results">◉ Draws</NavLink>

          <NavLink to="/winner-verification">★ Winnings</NavLink>

          <NavLink to="/profile">⚙ Profile & Settings</NavLink>
        </nav>

        <button type="button" className="logout" onClick={handleLogout}>
          ↪ Logout
        </button>
      </aside>

      <main className="main-content">{children}</main>

      {toast && (
        <div
          className={`toast ${toast.includes("successfully") ? "toast-success" : "toast-error"}`}
          role="status"
        >
          <span className="toast-icon">
            {toast.includes("successfully") ? "✓" : "!"}
          </span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
