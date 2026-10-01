import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabaseClient";

type Overview = {
  totalUsers: number;
  activeSubscriptions: number;
  publishedDraws: number;
  pendingProofs: number;
  latestDrawMonth: string | null;
};

export default function AdminDashboard() {
  const [overview, setOverview] = useState<Overview>({
    totalUsers: 0,
    activeSubscriptions: 0,
    publishedDraws: 0,
    pendingProofs: 0,
    latestDrawMonth: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadOverview = async () => {
      const [
        { count: userCount, error: usersError },
        { count: activeCount, error: subscriptionsError },
        { count: drawCount, error: drawsError },
        { count: pendingCount, error: proofsError },
        { data: latestDraw, error: latestDrawError },
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .neq("role", "admin"),
        supabase
          .from("subscriptions")
          .select("id", { count: "exact", head: true })
          .eq("status", "active"),
        supabase
          .from("draws")
          .select("id", { count: "exact", head: true })
          .eq("status", "published"),
        supabase
          .from("winner_proofs")
          .select("id", { count: "exact", head: true })
          .eq("verification_status", "pending"),
        supabase
          .from("draws")
          .select("draw_month")
          .eq("status", "published")
          .gte("draw_month", new Date().toISOString().slice(0, 10))
          .order("draw_month", { ascending: true })
          .limit(1)
          .maybeSingle(),
      ]);

      if (!mounted) return;

      const queryError =
        usersError ||
        subscriptionsError ||
        drawsError ||
        proofsError ||
        latestDrawError;

      if (queryError) {
        console.error("Admin overview load error:", queryError);
        setError(
          "Unable to load platform overview. Check admin data permissions.",
        );
      } else {
        setOverview({
          totalUsers: userCount || 0,
          activeSubscriptions: activeCount || 0,
          publishedDraws: drawCount || 0,
          pendingProofs: pendingCount || 0,
          latestDrawMonth: latestDraw?.draw_month || null,
        });
      }

      setLoading(false);
    };

    void loadOverview();

    return () => {
      mounted = false;
    };
  }, []);

  const formatMonth = (month: string | null) => {
    if (!month) return "No published draws";
    const date = new Date(`${month.slice(0, 7)}-01T00:00:00`);
    return Number.isNaN(date.getTime())
      ? month
      : date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  };

  return (
    <AdminLayout>
      <div className="topbar">
        <div>
          <span className="eyebrow">ADMIN</span>

          <h1>Dashboard</h1>

          <p>Overview of the platform.</p>
        </div>

        <div className="avatar">A</div>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="dashboard-stats">
        <div className="stat-card">
          <span>♙</span>
          <p>Total Users</p>
          <strong>{loading ? "—" : overview.totalUsers}</strong>
        </div>

        <div className="stat-card">
          <span>▣</span>
          <p>Active Subscriptions</p>
          <strong>{loading ? "—" : overview.activeSubscriptions}</strong>
        </div>

        <div className="stat-card">
          <span>◉</span>
          <p>Published Draws</p>
          <strong>{loading ? "—" : overview.publishedDraws}</strong>
        </div>

        <div className="stat-card">
          <span>✓</span>
          <p>Pending Proofs</p>
          <strong>{loading ? "—" : overview.pendingProofs}</strong>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Next Published Draw</h2>

            <Link to="/admin/draw">Manage →</Link>
          </div>

          <div className="admin-draw">
            <strong>{formatMonth(overview.latestDrawMonth)}</strong>

            <span>
              {overview.latestDrawMonth ? "Scheduled" : "No draw scheduled"}
            </span>

            <Link to="/admin/draw">Run draw →</Link>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Winner Verification</h2>

            <Link to="/admin/winners">View all</Link>
          </div>

          <div className="pending-number">
            {loading ? "—" : overview.pendingProofs}
          </div>

          <p>Pending submissions</p>
        </div>
      </div>
    </AdminLayout>
  );
}
