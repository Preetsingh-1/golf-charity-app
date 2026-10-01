import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabaseClient";

type ReportData = {
  users: number;
  activeSubscriptions: number;
  publishedDraws: number;
  winners: number;
  pendingProofs: number;
  charities: number;
};

export default function Reports() {
  const [report, setReport] = useState<ReportData>({
    users: 0,
    activeSubscriptions: 0,
    publishedDraws: 0,
    winners: 0,
    pendingProofs: 0,
    charities: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadReports = async () => {
      const [
        { count: users, error: usersError },
        { count: activeSubscriptions, error: subscriptionsError },
        { count: publishedDraws, error: drawsError },
        { count: winners, error: winnersError },
        { count: pendingProofs, error: proofsError },
        { count: charities, error: charitiesError },
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
          .from("draw_winners")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("winner_proofs")
          .select("id", { count: "exact", head: true })
          .eq("verification_status", "pending"),
        supabase.from("charities").select("id", { count: "exact", head: true }),
      ]);

      if (!mounted) return;

      const queryError =
        usersError ||
        subscriptionsError ||
        drawsError ||
        winnersError ||
        proofsError ||
        charitiesError;

      if (queryError) {
        console.error("Admin reports load error:", queryError);
        setError("Unable to load reports. Check admin data permissions.");
      } else {
        setReport({
          users: users || 0,
          activeSubscriptions: activeSubscriptions || 0,
          publishedDraws: publishedDraws || 0,
          winners: winners || 0,
          pendingProofs: pendingProofs || 0,
          charities: charities || 0,
        });
      }

      setLoading(false);
    };

    void loadReports();

    return () => {
      mounted = false;
    };
  }, []);

  const value = (number: number) =>
    loading ? "—" : number.toLocaleString("en-IN");

  return (
    <AdminLayout>
      <div className="admin-page-heading page-heading">
        <span className="eyebrow">REPORTS & ANALYTICS</span>

        <h1>Reports</h1>

        <p>Overview of platform performance.</p>

        <div className="page-heading-meta">
          <span className="page-meta-chip page-meta-chip--positive">
            {loading ? "Loading data" : "Live overview"}
          </span>
        </div>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="dashboard-stats reports-stats">
        <div className="stat-card">
          <span>♙</span>
          <p>Total Users</p>
          <strong>{value(report.users)}</strong>
        </div>

        <div className="stat-card">
          <span>◷</span>
          <p>Active Subscriptions</p>
          <strong>{value(report.activeSubscriptions)}</strong>
        </div>

        <div className="stat-card">
          <span>✓</span>
          <p>Pending Proofs</p>
          <strong>{value(report.pendingProofs)}</strong>
        </div>

        <div className="stat-card">
          <span>◉</span>
          <p>Total Draws</p>
          <strong>{value(report.publishedDraws)}</strong>
        </div>
      </div>

      <div className="reports-grid">
        <div className="panel report-panel">
          <div className="report-panel-heading">
            <div>
              <span className="panel-kicker">PERFORMANCE</span>
              <h2>Draw statistics</h2>
            </div>
            <span className="report-panel-icon">↗</span>
          </div>

          <div className="report-row">
            <span>Published draws</span>
            <strong>{value(report.publishedDraws)}</strong>
          </div>

          <div className="report-row">
            <span>Recorded winners</span>
            <strong>{value(report.winners)}</strong>
          </div>

          <div className="report-row">
            <span>Active subscriptions</span>
            <strong>{value(report.activeSubscriptions)}</strong>
          </div>
        </div>

        <div className="panel report-panel report-panel--impact">
          <div className="report-panel-heading">
            <div>
              <span className="panel-kicker">GIVING BACK</span>
              <h2>Charity impact</h2>
            </div>
            <span className="report-panel-icon">♥</span>
          </div>

          <div className="report-row">
            <span>Registered charities</span>
            <strong>{value(report.charities)}</strong>
          </div>

          <div className="report-row">
            <span>Members</span>
            <strong>{value(report.users)}</strong>
          </div>

          <div className="report-row">
            <span>Pending proof reviews</span>
            <strong>{value(report.pendingProofs)}</strong>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
