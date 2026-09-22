import type { ReactNode } from "react";
import { Link, Outlet } from "react-router-dom";

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">Digital Heroes</div>

        <nav>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/subscriptions">Subscriptions</Link>
          <Link to="/admin/draw">Draws</Link>
          <Link to="/admin/charities">Charities</Link>
          <Link to="/admin/winners">Winners</Link>
          <Link to="/admin/reports">Reports</Link>
          <Link to="/admin/login">Logout</Link>
        </nav>
      </aside>

      <main className="dashboard-content">{children ?? <Outlet />}</main>
    </div>
  );
};

export default AdminLayout;
