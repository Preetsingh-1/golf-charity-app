import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import UserLayout from "../components/UserLayout";
import { supabase } from "../lib/supabaseClient";

type Charity = {
  id: string;
  name: string;
  category?: string | null;
  description?: string | null;
  icon?: string | null;
  status?: string | null;
};

export default function CharitySelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedCharity, setSelectedCharity] = useState("");
  const [contribution, setContribution] = useState(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadSelection = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/login", { replace: true });
          return;
        }

        const [
          { data: charityRows, error: charityError },
          { data: profile, error: profileError },
        ] = await Promise.all([
          supabase.from("charities").select("*").order("name"),
          supabase
            .from("profiles")
            .select("charity_id, charity_percentage")
            .eq("id", user.id)
            .single(),
        ]);

        if (charityError) throw charityError;
        if (profileError) throw profileError;

        const activeCharities = ((charityRows || []) as Charity[]).filter(
          (charity) =>
            !charity.status || charity.status.toLowerCase() === "active",
        );

        if (mounted) {
          setCharities(activeCharities);
          setContribution(Number(profile.charity_percentage) || 10);

          const requestedCharityId =
            (location.state as { charityId?: string } | null)?.charityId ||
            sessionStorage.getItem("pendingCharityId") ||
            undefined;
          const selectedId = activeCharities.some(
            (charity) => charity.id === requestedCharityId,
          )
            ? requestedCharityId
            : activeCharities.some(
                  (charity) => charity.id === profile.charity_id,
                )
              ? profile.charity_id
              : activeCharities[0]?.id || "";

          setSelectedCharity(selectedId);
        }
      } catch (loadError) {
        console.error("Charity selection load error:", loadError);
        if (mounted) {
          setError("Unable to load your charity options. Please try again.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadSelection();

    return () => {
      mounted = false;
    };
  }, [location.state, navigate]);

  const handleContinue = async () => {
    if (!selectedCharity) {
      setError("Choose a charity before continuing.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      const { error: saveError } = await supabase
        .from("profiles")
        .update({
          charity_id: selectedCharity,
          charity_percentage: contribution,
        })
        .eq("id", user.id);

      if (saveError) throw saveError;

      sessionStorage.removeItem("pendingCharityId");
      navigate("/dashboard");
    } catch (saveError) {
      console.error("Charity selection save error:", saveError);
      setError("Unable to save your selection. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <UserLayout>
      <div className="charity-page">
        <div className="page-container">
          <Link to="/subscription" className="back">
            ← Back
          </Link>

          <div className="onboarding-progress" aria-label="Signup progress">
            <span className="progress-step complete">
              01 <small>Plan</small>
            </span>
            <span className="progress-line complete" />
            <span className="progress-step current">
              02 <small>Charity</small>
            </span>
            <span className="progress-line" />
            <span className="progress-step">
              03 <small>Ready</small>
            </span>
          </div>

          <div className="page-heading">
            <span className="eyebrow">STEP 2</span>

            <h1>Choose your charity</h1>

            <p>Select a cause that matters to you.</p>
          </div>

          <div
            className="charity-list"
            role="radiogroup"
            aria-label="Choose a charity"
          >
            {loading ? (
              <p>Loading charity options...</p>
            ) : (
              charities.map((charity) => (
                <label
                  className={`charity-option ${selectedCharity === charity.id ? "selected" : ""}`}
                  key={charity.id}
                >
                  <input
                    type="radio"
                    name="charity"
                    value={charity.id}
                    checked={selectedCharity === charity.id}
                    onChange={() => setSelectedCharity(charity.id)}
                  />

                  <span className="charity-option-icon" aria-hidden="true">
                    {charity.icon || "♡"}
                  </span>

                  <span className="charity-option-copy">
                    <strong>{charity.name}</strong>
                    <small>{charity.category || "Community cause"}</small>
                  </span>

                  <span className="charity-check" aria-hidden="true">
                    ✓
                  </span>
                </label>
              ))
            )}
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <div className="contribution">
            <div className="contribution-heading">
              <span>
                <strong>Your contribution</strong>
                <small>Choose how much reaches your charity</small>
              </span>
              <output
                className="contribution-value"
                htmlFor="charity-contribution"
              >
                {contribution}%
              </output>
            </div>

            <input
              id="charity-contribution"
              type="range"
              min="10"
              max="25"
              value={contribution}
              onChange={(event) => setContribution(Number(event.target.value))}
              aria-label="Contribution percentage"
            />

            <div className="contribution-range-labels" aria-hidden="true">
              <span>10% minimum</span>
              <span>25% maximum</span>
            </div>
          </div>

          <p className="selected-charity-summary" aria-live="polite">
            Your support is going to{" "}
            <strong>
              {charities.find((charity) => charity.id === selectedCharity)
                ?.name || "your chosen charity"}
            </strong>
            .
          </p>

          <p className="selection-note">
            You can update your charity or contribution any time from your
            dashboard.
          </p>

          <Button
            type="button"
            onClick={handleContinue}
            disabled={loading || saving || !charities.length}
          >
            {saving ? "Saving..." : "Continue"}
          </Button>
        </div>
      </div>
    </UserLayout>
  );
}
