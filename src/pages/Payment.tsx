import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Button from "../components/Button";
import { supabase } from "../lib/supabaseClient";

type SelectedSubscription = {
  plan: "monthly" | "yearly";
  amount: number;
};

export default function Payment() {
  const navigate = useNavigate();

  const [selectedSubscription, setSelectedSubscription] =
    useState<SelectedSubscription | null>(null);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSelectedPlan();
  }, []);

  const loadSelectedPlan = () => {
    try {
      const stored = localStorage.getItem(
        "selectedSubscription"
      );

      if (!stored) {
        navigate("/subscription");
        return;
      }

      const parsed = JSON.parse(stored);

      if (
        !parsed.plan ||
        !parsed.amount ||
        !["monthly", "yearly"].includes(parsed.plan)
      ) {
        navigate("/subscription");
        return;
      }

      setSelectedSubscription(parsed);
    } catch (error) {
      console.error("Plan loading error:", error);
      navigate("/subscription");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedSubscription) {
      setError("No subscription plan selected.");
      return;
    }

    try {
      setProcessing(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      console.log("USER:", user);
      console.log("USER ERROR:", userError);

      if (userError) {
        setError(
          `User error: ${userError.message}`
        );
        return;
      }

      if (!user) {
        setError("No logged-in user found.");
        navigate("/login");
        return;
      }

      const renewalDate = new Date();

      if (selectedSubscription.plan === "monthly") {
        renewalDate.setMonth(
          renewalDate.getMonth() + 1
        );
      } else {
        renewalDate.setFullYear(
          renewalDate.getFullYear() + 1
        );
      }

      const subscriptionData = {
        user_id: user.id,
        plan: selectedSubscription.plan,
        status: "active",
        amount: selectedSubscription.amount,
        currency: "INR",
        started_at: new Date().toISOString(),
        renewal_at: renewalDate.toISOString(),
      };

      console.log(
        "SUBSCRIPTION DATA:",
        subscriptionData
      );

      const { data, error: insertError } = await supabase
        .from("subscriptions")
        .insert(subscriptionData)
        .select()
        .single();

      console.log("SUPABASE RESPONSE:", data);
      console.log(
        "SUPABASE ERROR:",
        insertError
      );

      if (insertError) {
        setError(
          `Supabase Error: ${insertError.message}`
        );
        return;
      }

      console.log(
        "Subscription created successfully:",
        data
      );

      localStorage.removeItem(
        "selectedSubscription"
      );

      navigate("/charity-selection");

    } catch (error) {
      console.error(
        "PAYMENT ERROR:",
        error
      );

      if (error instanceof Error) {
        setError(
          `Error: ${error.message}`
        );
      } else {
        setError(
          "Unknown error occurred."
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !selectedSubscription) {
    return (
      <div className="center-page">
        <div className="payment-page">
          <Logo />

          <div className="page-heading">
            <span className="eyebrow">
              PAYMENT
            </span>

            <h1>Loading...</h1>

            <p>
              Preparing your subscription.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isMonthly =
    selectedSubscription.plan === "monthly";

  return (
    <div className="center-page">

      <div className="payment-page">

        <Logo />

        <button
          type="button"
          className="back"
          onClick={() =>
            navigate("/subscription")
          }
        >
          ← Back to subscription
        </button>

        <div className="page-heading">

          <span className="eyebrow">
            PAYMENT
          </span>

          <h1>
            Complete your subscription
          </h1>

          <p>
            Review your plan and continue to payment.
          </p>

        </div>

        {error && (
          <div
            className="form-error"
            style={{
              padding: "14px",
              marginBottom: "20px",
              background: "#fff0f0",
              border: "1px solid #ffcccc",
              borderRadius: "8px",
              color: "#c0392b",
              wordBreak: "break-word",
            }}
          >
            {error}
          </div>
        )}

        <div className="payment-grid">

          <div className="panel">

            <h2>Payment details</h2>

            <div className="form">

              <label>
                Cardholder name
                <input
                  placeholder="Full name"
                  autoComplete="cc-name"
                />
              </label>

              <label>
                Card number
                <input
                  placeholder="Stripe payment will be connected here"
                  disabled
                />
              </label>

              <div className="two-fields">

                <label>
                  Expiry
                  <input
                    placeholder="MM / YY"
                    disabled
                  />
                </label>

                <label>
                  CVC
                  <input
                    placeholder="CVC"
                    disabled
                  />
                </label>

              </div>

              <small>
                🔒 Card details are handled securely by
                the payment provider.
              </small>

            </div>

          </div>

          <div className="panel order-summary">

            <h2>Order summary</h2>

            <div className="summary-row">

              <span>
                {isMonthly
                  ? "Monthly plan"
                  : "Yearly plan"}
              </span>

              <strong>
                ₹
                {selectedSubscription.amount.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div className="summary-row">

              <span>
                Charity contribution
              </span>

              <strong>
                10%
              </strong>

            </div>

            <hr />

            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                ₹
                {selectedSubscription.amount.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <Button
              type="button"
              onClick={handlePayment}
              disabled={processing}
            >
              {processing
                ? "Processing..."
                : "Pay & Continue"}
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