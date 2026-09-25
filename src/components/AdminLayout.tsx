import { useState } from "react";
import type { ReactNode } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const [toast, setToast] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Admin logout error:", error);
        setToast("Unable to log out. Please try again.");
        setLoggingOut(false);
        return;
      }

      setToast("You have been logged out successfully.");
      window.setTimeout(() => navigate("/admin/login", { replace: true }), 900);
    } catch (error) {
      console.error("Admin logout failed:", error);
      setToast("Unable to log out. Please try again.");
      setLoggingOut(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">Digital Heroess</div>

        <nav>
          <NavLink to="/admin">Dashboard</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
          <NavLink to="/admin/subscriptions">Subscriptions</NavLink>
          <NavLink to="/admin/draw">Draws</NavLink>
          <NavLink to="/admin/charities">Charities</NavLink>
          <NavLink to="/admin/winners">Winners</NavLink>
          <NavLink to="/admin/reports">Reports</NavLink>
          <Link
            to="/admin/login"
            onClick={(event) => {
              if (loggingOut) {
                event.preventDefault();
                return;
              }

              event.preventDefault();
              void handleLogout();
            }}
          >
            Logout
          </Link>
        </nav>
      </aside>

      <main className="dashboard-content">{children ?? <Outlet />}</main>

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
};

export default AdminLayout;
