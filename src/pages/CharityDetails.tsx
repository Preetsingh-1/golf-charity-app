import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function CharityDetails() {
  return (
    <div>
      <header className="header">
        <Link to="/" className="logo">
          <span className="logo-icon">✦</span>
          Golf for Good
        </Link>

        <div className="header-actions">
          <Link to="/login">Login</Link>
          <Link to="/signup" className="btn btn-primary">
            Sign Up
          </Link>
        </div>
      </header>

      <main className="charity-detail">
        <a href="/charities" className="back">
          ← Back to charities
        </a>

        <div className="charity-detail-hero">
          <div className="large-charity-icon">🌱</div>

          <div>
            <span className="category">Environment</span>

            <h1>Green Earth Foundation</h1>

            <p>
              Supporting environmental protection, sustainability and a
              healthier planet.
            </p>

            <Button to="/charity-selection">Choose this charity</Button>
          </div>
        </div>

        <div className="charity-detail-grid">
          <section className="panel">
            <h2>About the charity</h2>

            <p>
              Green Earth Foundation works to support environmental causes and
              create sustainable communities.
            </p>
          </section>

          <section className="panel">
            <h2>Upcoming events</h2>

            <div className="event-item">
              <strong>Community Golf Day</strong>
              <span>15 October 2026</span>
            </div>

            <div className="event-item">
              <strong>Green Future Event</strong>
              <span>28 October 2026</span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
