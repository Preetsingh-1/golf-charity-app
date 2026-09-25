import UserLayout from "../components/UserLayout";
import Button from "../components/Button";

const scores = [
  ["40", "18 Sep 2026"],
  ["36", "12 Sep 2026"],
  ["38", "05 Sep 2026"],
  ["31", "28 Aug 2026"],
  ["35", "20 Aug 2026"],
];

export default function Dashboard() {
  return (
    <UserLayout>
      <div className="topbar dashboard-topbar">
        <div>
          <span className="eyebrow">USER DASHBOARD</span>

          <h1>Good morning, Preeti 👋</h1>

          <p>Keep your streak going and make your next round count.</p>
        </div>

        <div className="dashboard-profile">
          <div className="avatar">P</div>
          <span>
            Member since
            <br />
            <strong>June 2026</strong>
          </span>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card stat-card-success">
          <span className="stat-icon">✓</span>
          <p>Subscription</p>
          <strong>Active</strong>
          <small>
            <i /> Renews 12 Oct 2026
          </small>
        </div>

        <div className="stat-card">
          <span className="stat-icon">◷</span>
          <p>Next Draw</p>
          <strong>28 Sep 2026</strong>
          <small>12 days to go</small>
        </div>

        <div className="stat-card">
          <span className="stat-icon">♡</span>
          <p>Your Charity</p>
          <strong>Green Earth</strong>
          <small>
            10% contribution <a href="/charity-selection">Change</a>
          </small>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header score-panel-heading">
            <div>
              <span className="panel-kicker">YOUR PROGRESS</span>
              <h2>Your latest 5 scores</h2>
            </div>
            <span className="score-average">Avg. 36</span>
          </div>

          {scores.map(([score, date]) => (
            <div className="score-row" key={date}>
              <strong>
                <span className="score-dot" />
                {score}
              </strong>

              <span>{date}</span>
            </div>
          ))}

          <div className="score-panel-footer">
            <span>Keep logging your rounds to track your form.</span>
            <Button to="/scores/add">+ Add Score</Button>
          </div>
        </section>

        <section className="panel impact">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">YOUR IMPACT</span>
              <h2>Giving back</h2>
            </div>
            <span className="impact-leaf">✦</span>
          </div>

          <div className="impact-icon">🌱</div>

          <h3>Green Earth Foundation</h3>

          <strong className="impact-percent">10%</strong>

          <p>of your subscription goes to your selected charity.</p>

          <a href="/charity-selection">Change charity →</a>

          <div
            className="impact-progress"
            aria-label="Charity contribution 10 percent"
          >
            <span />
          </div>
          <small className="impact-caption">Your contribution this month</small>
        </section>
      </div>
    </UserLayout>
  );
}
