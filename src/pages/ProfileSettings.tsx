import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserLayout from "../components/UserLayout";
import Button from "../components/Button";
import { supabase } from "../lib/supabaseClient";

type Subscription = {
  plan: string;
  status: string;
  renewal_at: string | null;
};

export default function ProfileSettings() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!user || userError) {
        if (mounted) {
          setError("Unable to load your account. Please sign in again.");
          setLoading(false);
        }
        return;
      }

      const [
        { data: profile, error: profileError },
        { data: latestSubscription, error: subscriptionError },
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single(),
        supabase
          .from("subscriptions")
          .select("plan, status, renewal_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      if (!mounted) return;

      if (profileError || subscriptionError) {
        console.error(
          "Profile settings load error:",
          profileError || subscriptionError,
        );
        setError("Unable to load your account details.");
      } else {
        setFullName(profile?.full_name || "");
        setEmail(user.email || "");
        setSubscription(latestSubscription);
      }

      setLoading(false);
    };

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    const normalizedName = fullName.trim();
    if (!normalizedName) {
      setError("Please enter your full name.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Please sign in again to update your profile.");
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ full_name: normalizedName })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setFullName(normalizedName);
      setMessage("Your profile has been updated.");
    } catch (saveError) {
      console.error("Profile update error:", saveError);
      setError("Unable to save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime())
      ? "—"
      : parsed.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
  };

  return (
    <UserLayout>
      <div className="form-page profile-page">
        <div className="page-heading">
          <span className="eyebrow">ACCOUNT</span>

          <h1>Profile & Settings</h1>

          <p>Manage your account details and review your subscription.</p>
        </div>

        <section className="profile-overview" aria-label="Member account">
          <div className="profile-overview-identity">
            <span className="profile-avatar" aria-hidden="true">
              {(fullName || email || "M").charAt(0).toUpperCase()}
            </span>
            <span>
              <small>GOLF FOR GOOD MEMBER</small>
              <strong>
                {loading ? "Loading account..." : fullName || "Member"}
              </strong>
              <span>{email}</span>
            </span>
          </div>

          <span
            className={`profile-status-badge ${subscription?.status?.toLowerCase() === "active" ? "is-active" : ""}`}
          >
            <span aria-hidden="true" />
            {loading
              ? "Checking status"
              : subscription?.status || "No subscription"}
          </span>
        </section>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="form-success" role="status">
            {message}
          </p>
        )}

        <div className="profile-settings-grid">
          <section className="panel settings-panel">
            <div className="settings-section-heading">
              <div>
                <span className="panel-kicker">ACCOUNT DETAILS</span>
                <h2>Personal details</h2>
              </div>
              <span className="settings-section-number" aria-hidden="true">
                01
              </span>
            </div>

            <div className="profile-fields">
              <label>
                Full name
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  autoComplete="name"
                  disabled={loading}
                />
              </label>

              <label>
                Email address
                <input value={email} readOnly aria-readonly="true" />
              </label>
            </div>

            <div className="settings-panel-footer">
              <small>Changes apply to your member profile.</small>
              <Button
                type="button"
                onClick={handleSave}
                disabled={loading || saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </section>

          <section className="panel settings-panel subscription-settings-panel">
            <div className="settings-section-heading">
              <div>
                <span className="panel-kicker">MEMBERSHIP</span>
                <h2>Subscription</h2>
              </div>
              <span className="settings-section-number" aria-hidden="true">
                02
              </span>
            </div>

            <div className="subscription-setting">
              <div>
                <span>Current plan</span>
                <strong>
                  {loading ? "Loading..." : subscription?.plan || "No plan"}
                </strong>
              </div>

              <div>
                <span>Renewal date</span>
                <strong>{formatDate(subscription?.renewal_at || null)}</strong>
              </div>
            </div>

            {!loading && !subscription && (
              <Link className="btn btn-secondary" to="/subscription">
                Choose a plan
              </Link>
            )}
          </section>
        </div>
      </div>
    </UserLayout>
  );
}
