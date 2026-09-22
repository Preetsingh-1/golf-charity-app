import AdminLayout from "../components/AdminLayout";

export default function AdminDashboard() {
  return (
    <AdminLayout>

      <div className="topbar">

        <div>
          <span className="eyebrow">
            ADMIN
          </span>

          <h1>Dashboard</h1>

          <p>
            Overview of the platform.
          </p>
        </div>

        <div className="avatar">
          A
        </div>

      </div>

      <div className="dashboard-stats">

        <div className="stat-card">
          <span>♙</span>
          <p>Total Users</p>
          <strong>1,240</strong>
        </div>

        <div className="stat-card">
          <span>▣</span>
          <p>Active Subscriptions</p>
          <strong>980</strong>
        </div>

        <div className="stat-card">
          <span>🏆</span>
          <p>Total Prize Pool</p>
          <strong>₹2,45,000</strong>
        </div>

        <div className="stat-card">
          <span>♡</span>
          <p>Charity Contributions</p>
          <strong>₹61,250</strong>
        </div>

      </div>

      <div className="dashboard-grid">

        <div className="panel">

          <div className="panel-header">

            <h2>
              Upcoming Draw
            </h2>

            <a href="/admin/draw">
              Manage →
            </a>

          </div>

          <div className="admin-draw">

            <strong>
              September 2026
            </strong>

            <span>
              Ready to run
            </span>

            <a href="/admin/draw">
              Run draw →
            </a>

          </div>

        </div>

        <div className="panel">

          <div className="panel-header">

            <h2>
              Winner Verification
            </h2>

            <a href="/admin/winners">
              View all
            </a>

          </div>

          <div className="pending-number">
            3
          </div>

          <p>
            Pending submissions
          </p>

        </div>

      </div>

    </AdminLayout>
  );
}