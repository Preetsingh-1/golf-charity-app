import Logo from "../components/Logo";
import Button from "../components/Button";

export default function Subscription() {
  return (
    <div className="center-page">

      <div className="page-container">

        <Logo />

        <a href="/signup" className="back">
          ← Back
        </a>

        <div className="page-heading">

          <span className="eyebrow">
            STEP 1
          </span>

          <h1>Choose your plan</h1>

          <p>
            Choose a monthly or yearly subscription.
          </p>

        </div>

        <div className="plans">

          <div className="plan selected">

            <span className="plan-label">
              MONTHLY
            </span>

            <h2>₹999</h2>

            <p>per month</p>

            <ul>
              <li>Monthly prize draws</li>
              <li>Enter golf scores</li>
              <li>Support a charity</li>
            </ul>

            <Button to="/charity-selection">
              Select Plan
            </Button>

          </div>

          <div className="plan">

            <span className="plan-label">
              YEARLY
            </span>

            <h2>₹9,999</h2>

            <p>per year</p>

            <ul>
              <li>Monthly prize draws</li>
              <li>Enter golf scores</li>
              <li>Support a charity</li>
            </ul>

            <Button
              to="/charity-selection"
              variant="secondary"
            >
              Select Plan
            </Button>

          </div>

        </div>

        <div className="secure">
          🔒 Secure payment powered by Stripe
        </div>

      </div>

    </div>
  );
}