import Logo from "../components/Logo";
import Button from "../components/Button";

export default function Payment() {
  return (
    <div className="center-page">

      <div className="payment-page">

        <Logo />

        <a href="/subscription" className="back">
          ← Back to subscription
        </a>

        <div className="page-heading">
          <span className="eyebrow">
            PAYMENT
          </span>

          <h1>Complete your subscription</h1>

          <p>
            Review your plan and continue to payment.
          </p>
        </div>

        <div className="payment-grid">

          <div className="panel">

            <h2>Payment details</h2>

            <div className="form">

              <label>
                Cardholder name
                <input placeholder="Full name" />
              </label>

              <label>
                Card number
                <input placeholder="1234 5678 9012 3456" />
              </label>

              <div className="two-fields">

                <label>
                  Expiry
                  <input placeholder="MM / YY" />
                </label>

                <label>
                  CVC
                  <input placeholder="123" />
                </label>

              </div>

            </div>

          </div>

          <div className="panel order-summary">

            <h2>Order summary</h2>

            <div className="summary-row">
              <span>Monthly plan</span>
              <strong>₹999</strong>
            </div>

            <div className="summary-row">
              <span>Charity contribution</span>
              <strong>10%</strong>
            </div>

            <hr />

            <div className="summary-total">
              <span>Total</span>
              <strong>₹999</strong>
            </div>

            <Button to="/charity-selection">
              Pay & Continue
            </Button>

            <small>
              🔒 Secure payment
            </small>

          </div>

        </div>

      </div>

    </div>
  );
}