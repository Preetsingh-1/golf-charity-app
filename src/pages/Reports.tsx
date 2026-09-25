import AdminLayout from "../components/AdminLayout";

export default function Reports() {
  return (
    <AdminLayout>
      <div className="admin-page-heading page-heading">
        <span className="eyebrow">REPORTS & ANALYTICS</span>

        <h1>Reports</h1>

        <p>Overview of platform performance.</p>

        <div className="page-heading-meta">
          <span className="page-meta-chip page-meta-chip--positive">
            Live overview
          </span>
          <span className="page-meta-chip">September 2026</span>
        </div>
      </div>

      <div className="dashboard-stats reports-stats">
        <div className="stat-card">
          <span>♙</span>
          <p>Total Users</p>
          <strong>1,240</strong>
        </div>

        <div className="stat-card">
          <span>🏆</span>
          <p>Total Prize Pool</p>
          <strong>₹2.45L</strong>
        </div>

        <div className="stat-card">
          <span>♡</span>
          <p>Charity Contributions</p>
          <strong>₹61K</strong>
        </div>

        <div className="stat-card">
          <span>◉</span>
          <p>Total Draws</p>
          <strong>12</strong>
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
            <span>Draws completed</span>
            <strong>12</strong>
          </div>

          <div className="report-row">
            <span>Total winners</span>
            <strong>183</strong>
          </div>

          <div className="report-row">
            <span>Prizes distributed</span>
            <strong>₹8.4L</strong>
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
            <span>Total contributions</span>
            <strong>₹61,250</strong>
          </div>

          <div className="report-row">
            <span>Active charities</span>
            <strong>24</strong>
          </div>

          <div className="report-row">
            <span>Subscribers supporting charity</span>
            <strong>980</strong>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
