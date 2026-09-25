import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Button from "../components/Button";
import { supabase } from "../lib/supabaseClient";

type Plan = "monthly" | "yearly";

type SubscriptionRecord = {
  id: string;
  plan: Plan;
  status: string;
  amount: number;
};

export default function Subscription() {
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState<Plan>("monthly");
  const [subscription, setSubscription] =
    useState<SubscriptionRecord | null>(null);

  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const [error, setError] = useState("");

  const monthlyAmount = 999;
  const yearlyAmount = 9999;

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("subscriptions")
        .select("id, plan, status, amount")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(error);
        setError("Unable to load your subscription.");
        return;
      }

      if (data) {
        setSubscription(data);
        setSelectedPlan(data.plan);
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (plan: Plan) => {
    try {
      setSelecting(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const amount =
        plan === "monthly" ? monthlyAmount : yearlyAmount;

      /*
       * Save the selected plan temporarily.
       * The actual payment/activation will be handled
       * by the Payment page.
       */
      localStorage.setItem(
        "selectedSubscription",
        JSON.stringify({
          plan,
          amount,
        })
      );

      setSelectedPlan(plan);

      navigate("/payment");
    } catch (error) {
      console.error(error);
      setError("Unable to continue. Please try again.");
    } finally {
      setSelecting(false);
    }
  };

  if (loading) {
    return (
      <div className="center-page">
        <div className="page-container">
          <Logo />

          <div className="page-heading">
            <span className="eyebrow">SUBSCRIPTION</span>
            <h1>Loading...</h1>
            <p>Checking your subscription.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="center-page">

      <div className="page-container">

        <Logo />

        <button
          type="button"
          className="back"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="page-heading">

          <span className="eyebrow">
            STEP 1
          </span>

          <h1>Choose your plan</h1>

          <p>
            Choose a monthly or yearly subscription.
          </p>

        </div>

        {subscription && (
          <div className="secure">
            Current subscription:{" "}
            <strong>
              {subscription.plan === "monthly"
                ? "Monthly"
                : "Yearly"}
            </strong>{" "}
            — {subscription.status}
          </div>
        )}

        {error && (
          <p className="form-error">
            {error}
          </p>
        )}

        <div className="plans">

          {/* MONTHLY */}

          <div
            className={`plan ${
              selectedPlan === "monthly"
                ? "selected"
                : ""
            }`}
            onClick={() => setSelectedPlan("monthly")}
          >

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

            <Button
              type="button"
              onClick={() =>
                handleSelectPlan("monthly")
              }
              disabled={selecting}
            >
              {selecting && selectedPlan === "monthly"
                ? "Continuing..."
                : "Select Plan"}
            </Button>

          </div>

          {/* YEARLY */}

          <div
            className={`plan ${
              selectedPlan === "yearly"
                ? "selected"
                : ""
            }`}
            onClick={() => setSelectedPlan("yearly")}
          >

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
              type="button"
              variant="secondary"
              onClick={() =>
                handleSelectPlan("yearly")
              }
              disabled={selecting}
            >
              {selecting && selectedPlan === "yearly"
                ? "Continuing..."
                : "Select Plan"}
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