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

      <div className="topbar">

        <div>
          <span className="eyebrow">
            USER DASHBOARD
          </span>

          <h1>Good morning, Preeti 👋</h1>

          <p>
            Here's your overview.
          </p>
        </div>

        <div className="avatar">
          P
        </div>

      </div>

      <div className="dashboard-stats">

        <div className="stat-card">
          <span>✓</span>
          <p>Subscription</p>
          <strong>Active</strong>
          <small>Renews 12 Oct 2026</small>
        </div>

        <div className="stat-card">
          <span>◷</span>
          <p>Next Draw</p>
          <strong>28 Sep 2026</strong>
          <small>Monthly draw</small>
        </div>

        <div className="stat-card">
          <span>♡</span>
          <p>Your Charity</p>
          <strong>Green Earth</strong>
          <small>10% contribution</small>
        </div>

      </div>

      <div className="dashboard-grid">

        <section className="panel">

          <div className="panel-header">
            <h2>Your latest 5 scores</h2>
          </div>

          {scores.map(([score, date]) => (

            <div className="score-row" key={date}>

              <strong>{score}</strong>

              <span>{date}</span>

            </div>

          ))}

          <Button to="/scores/add">
            + Add Score
          </Button>

        </section>

        <section className="panel impact">

          <h2>Your impact</h2>

          <div className="impact-icon">
            🌱
          </div>

          <h3>
            Green Earth Foundation
          </h3>

          <strong>10%</strong>

          <p>
            of your subscription goes to
            your selected charity.
          </p>

          <a href="/charity-selection">
            Change charity →
          </a>

        </section>

      </div>

    </UserLayout>
  );
}