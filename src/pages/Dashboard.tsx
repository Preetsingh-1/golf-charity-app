import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserLayout from "../components/UserLayout";
import Button from "../components/Button";
import { supabase } from "../lib/supabaseClient";

type Score = {
  id: string;
  score: number;
  played_at: string;
};

type DashboardData = {
  userName: string;
  memberSince: string | null;

  subscriptionStatus: string | null;
  renewalDate: string | null;

  nextDrawDate: string | null;

  charityName: string | null;
  charityPercentage: number;
};

function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning";
  }

  if (hour >= 12 && hour < 18) {
    return "Good afternoon";
  }

  if (hour >= 18 && hour < 21) {
    return "Good evening";
  }

  return "Good night";
}

function formatDate(dateString: string | null) {
  if (!dateString) {
    return "—";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatMonthYear(dateString: string | null) {
  if (!dateString) {
    return "—";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

function getDaysUntil(dateString: string | null) {
  if (!dateString) {
    return null;
  }

  const targetDate = new Date(dateString);

  if (Number.isNaN(targetDate.getTime())) {
    return null;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const difference =
    targetDate.getTime() - today.getTime();

  return Math.max(
    0,
    Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    )
  );
}

function formatSubscriptionStatus(
  status: string | null
) {
  if (!status) {
    return "Inactive";
  }

  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
}

export default function Dashboard() {
  const [greeting, setGreeting] =
    useState(getGreeting());

  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);

  const [scores, setScores] =
    useState<Score[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      // -----------------------------------------
      // 1. Get logged-in user
      // -----------------------------------------

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(userError.message);
      }

      if (!user) {
        throw new Error(
          "Unable to find the logged-in user."
        );
      }

      // -----------------------------------------
      // 2. Get profile
      // -----------------------------------------

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select(
          "full_name, created_at, charity_id, charity_percentage"
        )
        .eq("id", user.id)
        .single();

      if (profileError) {
        throw new Error(
          `Unable to load profile: ${profileError.message}`
        );
      }

      // -----------------------------------------
      // 3. Get selected charity
      // -----------------------------------------

      let charityName: string | null = null;

      if (profile?.charity_id) {
        const {
          data: charity,
          error: charityError,
        } = await supabase
          .from("charities")
          .select("name")
          .eq("id", profile.charity_id)
          .single();

        if (charityError) {
          console.error(
            "Charity loading error:",
            charityError
          );
        } else {
          charityName = charity?.name || null;
        }
      }

      // -----------------------------------------
      // 4. Get latest subscription
      // -----------------------------------------

      const {
        data: subscription,
        error: subscriptionError,
      } = await supabase
        .from("subscriptions")
        .select(
          "status, renewal_at, created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (subscriptionError) {
        console.error(
          "Subscription loading error:",
          subscriptionError
        );
      }

      // -----------------------------------------
      // 5. Get upcoming published draw
      // -----------------------------------------

      const today = new Date();

      const todayString = today
        .toISOString()
        .split("T")[0];

      const {
        data: nextDraw,
        error: drawError,
      } = await supabase
        .from("draws")
        .select("draw_month")
        .eq("status", "published")
        .gte("draw_month", todayString)
        .order("draw_month", {
          ascending: true,
        })
        .limit(1)
        .maybeSingle();

      if (drawError) {
        console.error(
          "Draw loading error:",
          drawError
        );
      }

      // -----------------------------------------
      // 6. Get latest 5 scores
      // -----------------------------------------

      const {
        data: scoreData,
        error: scoreError,
      } = await supabase
        .from("scores")
        .select(
          "id, score, played_at"
        )
        .eq("user_id", user.id)
        .order("played_at", {
          ascending: false,
        })
        .limit(5);

      if (scoreError) {
        throw new Error(
          `Unable to load scores: ${scoreError.message}`
        );
      }

      // -----------------------------------------
      // 7. Store dashboard data
      // -----------------------------------------

      setDashboardData({
        userName:
          profile?.full_name?.trim() ||
          user.email?.split("@")[0] ||
          "Member",

        memberSince:
          profile?.created_at || null,

        subscriptionStatus:
          subscription?.status || null,

        renewalDate:
          subscription?.renewal_at || null,

        nextDrawDate:
          nextDraw?.draw_month || null,

        charityName,

        charityPercentage:
          Number(
            profile?.charity_percentage || 0
          ),
      });

      setScores(scoreData || []);
    } catch (err) {
      console.error(
        "Dashboard loading error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();

    // Update greeting every minute
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // -----------------------------------------
  // Dynamic score average
  // -----------------------------------------

  const averageScore =
    scores.length > 0
      ? (
          scores.reduce(
            (total, item) =>
              total + Number(item.score),
            0
          ) / scores.length
        ).toFixed(0)
      : "0";

  // -----------------------------------------
  // Dynamic draw countdown
  // -----------------------------------------

  const daysUntilDraw = getDaysUntil(
    dashboardData?.nextDrawDate || null
  );

  // -----------------------------------------
  // Dynamic subscription status
  // -----------------------------------------

  const isSubscriptionActive =
    dashboardData?.subscriptionStatus?.toLowerCase() ===
    "active";

  return (
    <UserLayout>
      <div className="topbar dashboard-topbar">
        <div>
          <span className="eyebrow">
            USER DASHBOARD
          </span>

          <h1>
            {greeting},{" "}
            {dashboardData?.userName ||
              "Member"}{" "}
            👋
          </h1>

          <p>
            Keep your streak going and make your
            next round count.
          </p>
        </div>

        <div className="dashboard-profile">
          <div className="avatar">
            {(
              dashboardData?.userName ||
              "M"
            )
              .charAt(0)
              .toUpperCase()}
          </div>

          <span>
            Member since
            <br />

            <strong>
              {formatMonthYear(
                dashboardData?.memberSince ||
                  null
              )}
            </strong>
          </span>
        </div>
      </div>

      {error && (
        <div
          className="form-error"
          style={{
            padding: "12px 16px",
            marginBottom: "20px",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      <div className="dashboard-stats">
        {/* ---------------------------------- */}
        {/* Subscription */}
        {/* ---------------------------------- */}

        <div
          className={`stat-card ${
            isSubscriptionActive
              ? "stat-card-success"
              : ""
          }`}
        >
          <span className="stat-icon">
            ✓
          </span>

          <p>Subscription</p>

          <strong>
            {loading
              ? "Loading..."
              : formatSubscriptionStatus(
                  dashboardData?.subscriptionStatus ||
                    null
                )}
          </strong>

          <small>
            {dashboardData?.renewalDate
              ? `Renews ${formatDate(
                  dashboardData.renewalDate
                )}`
              : "No renewal date available"}
          </small>
        </div>

        {/* ---------------------------------- */}
        {/* Next Draw */}
        {/* ---------------------------------- */}

        <div className="stat-card">
          <span className="stat-icon">
            ◷
          </span>

          <p>Next Draw</p>

          <strong>
            {loading
              ? "Loading..."
              : dashboardData?.nextDrawDate
              ? formatDate(
                  dashboardData.nextDrawDate
                )
              : "No upcoming draw"}
          </strong>

          <small>
            {daysUntilDraw !== null
              ? daysUntilDraw === 0
                ? "Draw is today"
                : `${daysUntilDraw} ${
                    daysUntilDraw === 1
                      ? "day"
                      : "days"
                  } to go`
              : "Check back soon"}
          </small>
        </div>

        {/* ---------------------------------- */}
        {/* Charity */}
        {/* ---------------------------------- */}

        <div className="stat-card">
          <span className="stat-icon">
            ♡
          </span>

          <p>Your Charity</p>

          <strong>
            {loading
              ? "Loading..."
              : dashboardData?.charityName ||
                "Not selected"}
          </strong>

          <small>
            {dashboardData?.charityName
              ? `${dashboardData.charityPercentage}% contribution`
              : "No charity selected"}{" "}
            <Link to="/charity-selection">
              Change
            </Link>
          </small>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* ================================== */}
        {/* SCORE SECTION */}
        {/* ================================== */}

        <section className="panel">
          <div className="panel-header score-panel-heading">
            <div>
              <span className="panel-kicker">
                YOUR PROGRESS
              </span>

              <h2>
                Your latest 5 scores
              </h2>
            </div>

            <span className="score-average">
              Avg. {averageScore}
            </span>
          </div>

          {loading ? (
            <div
              style={{
                padding: "24px 0",
                textAlign: "center",
                color: "#777",
              }}
            >
              Loading scores...
            </div>
          ) : scores.length === 0 ? (
            <div
              style={{
                padding: "24px 0",
                textAlign: "center",
                color: "#777",
              }}
            >
              No scores added yet.
            </div>
          ) : (
            scores.map((item) => (
              <div
                className="score-row"
                key={item.id}
              >
                <strong>
                  <span className="score-dot" />

                  {item.score}
                </strong>

                <span>
                  {formatDate(
                    item.played_at
                  )}
                </span>
              </div>
            ))
          )}

          <div className="score-panel-footer">
            <span>
              Keep logging your rounds to
              track your form.
            </span>

            <Button to="/scores/add">
              + Add Score
            </Button>
          </div>
        </section>

        {/* ================================== */}
        {/* CHARITY IMPACT */}
        {/* ================================== */}

        <section className="panel impact">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">
                YOUR IMPACT
              </span>

              <h2>Giving back</h2>
            </div>

            <span className="impact-leaf">
              ✦
            </span>
          </div>

          <div className="impact-icon">
            🌱
          </div>

          <h3>
            {loading
              ? "Loading..."
              : dashboardData?.charityName ||
                "No charity selected"}
          </h3>

          <strong className="impact-percent">
  {dashboardData?.charityName
    ? `${dashboardData.charityPercentage}%`
    : "0%"}
</strong>

          <p>
            of your subscription goes to your
            selected charity.
          </p>

          <Link to="/charity-selection">
            Change charity →
          </Link>

          <div
            className="impact-progress"
            aria-label={`Charity contribution ${
              dashboardData?.charityPercentage ||
              0
            } percent`}
          >
            <span
  style={{
    width: dashboardData?.charityName
      ? `${Math.min(
          100,
          Math.max(
            0,
            dashboardData.charityPercentage
          )
        )}%`
      : "0%",
  }}
/>
          </div>

          <small className="impact-caption">
            Your contribution this month
          </small>
        </section>
      </div>
    </UserLayout>
  );
}