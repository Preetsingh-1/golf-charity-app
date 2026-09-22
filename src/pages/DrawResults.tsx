import UserLayout from "../components/UserLayout";
import Button from "../components/Button";

const numbers = ["07", "14", "21", "32", "40"];

export default function DrawResults() {
  return (
    <UserLayout>

      <div className="draw-page">

        <div className="page-heading center">

          <span className="eyebrow">
            DRAW RESULTS
          </span>

          <h1>
            September 2026 Draw
          </h1>

          <p>
            Winning numbers and results.
          </p>

        </div>

        <div className="winning-box">

          <p>Winning Numbers</p>

          <div className="numbers">

            {numbers.map((number) => (
              <span key={number}>
                {number}
              </span>
            ))}

          </div>

        </div>

        <div className="match-grid">

          <div>
            <strong>5 Number Match</strong>
            <b>40% Pool</b>
            <small>2 Winners</small>
          </div>

          <div>
            <strong>4 Number Match</strong>
            <b>35% Pool</b>
            <small>12 Winners</small>
          </div>

          <div>
            <strong>3 Number Match</strong>
            <b>25% Pool</b>
            <small>48 Winners</small>
          </div>

        </div>

        <div className="result-banner">

          <span>🏆</span>

          <div>
            <strong>Your Result</strong>
            <b>You matched 4 numbers!</b>
          </div>

          <a href="/winner-verification">
            View winnings →
          </a>

        </div>

        <Button
          to="/dashboard"
          variant="secondary"
        >
          Back to Dashboard
        </Button>

      </div>

    </UserLayout>
  );
}