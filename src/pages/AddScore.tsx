import UserLayout from "../components/UserLayout";
import Button from "../components/Button";

export default function AddScore() {
  return (
    <UserLayout>

      <div className="form-page">

        <a href="/dashboard" className="back">
          ← Back to dashboard
        </a>

        <div className="page-heading">

          <span className="eyebrow">
            MY SCORES
          </span>

          <h1>Add golf score</h1>

          <p>
            Enter your latest Stableford score.
          </p>

        </div>

        <div className="panel score-form">

          <label>
            Score (1 - 45)

            <input
              type="number"
              min="1"
              max="45"
              placeholder="Enter score"
            />

          </label>

          <label>
            Date

            <input
              type="date"
            />

          </label>

          <div className="rules">

            <strong>Score rules</strong>

            <span>
              ✓ Score must be between 1 and 45
            </span>

            <span>
              ✓ Only one score per date
            </span>

            <span>
              ✓ Only latest 5 scores are kept
            </span>

          </div>

          <Button to="/dashboard">
            Save Score
          </Button>

        </div>

      </div>

    </UserLayout>
  );
}