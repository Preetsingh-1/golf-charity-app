import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../components/UserLayout";
import Button from "../components/Button";
import { supabase } from "../lib/supabaseClient";

export default function AddScore() {
  const navigate = useNavigate();

  const [score, setScore] = useState("");
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [scoreError, setScoreError] = useState("");

  const handleSaveScore = async () => {
    setError("");
    setSuccess("");

    const numericScore = Number(score);

    // Validate score
    if (!score) {
      setError("Please enter your score.");
      return;
    }

    if (
      !Number.isInteger(numericScore) ||
      numericScore < 1 ||
      numericScore > 45
    ) {
      setError("Score must be a whole number between 1 and 45.");
      return;
    }

    // Validate date
    if (!date) {
      setError("Please select the date of your round.");
      return;
    }

    try {
      setLoading(true);

      // Get logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        setError(userError.message);
        return;
      }

      if (!user) {
        navigate("/login");
        return;
      }

      /*
       * Check whether the user already has a score
       * for this date.
       */
      const { data: existingScore, error: existingError } = await supabase
        .from("scores")
        .select("id")
        .eq("user_id", user.id)
        .eq("played_at", date)
        .maybeSingle();

      if (existingError) {
        console.error(existingError);
        setError(`Unable to check existing scores: ${existingError.message}`);
        return;
      }

      if (existingScore) {
        setError(
          "You already have a score for this date. Only one score is allowed per date.",
        );
        return;
      }

      /*
       * Insert the new score.
       */
      const { error: insertError } = await supabase.from("scores").insert({
        user_id: user.id,
        score: numericScore,
        played_at: date,
      });

      if (insertError) {
        console.error(insertError);

        setError(`Unable to save score: ${insertError.message}`);

        return;
      }

      /*
       * Get all scores ordered newest → oldest.
       */
      const { data: allScores, error: scoresError } = await supabase
        .from("scores")
        .select("id, played_at")
        .eq("user_id", user.id)
        .order("played_at", {
          ascending: false,
        });

      if (scoresError) {
        console.error(scoresError);
        setError(
          `Score saved, but unable to update score history: ${scoresError.message}`,
        );
        return;
      }

      /*
       * Keep only the latest 5 scores.
       *
       * If there are more than 5,
       * delete everything after the newest 5.
       */
      if (allScores && allScores.length > 5) {
        const scoresToDelete = allScores.slice(5);

        const idsToDelete = scoresToDelete.map((item) => item.id);

        const { error: deleteError } = await supabase
          .from("scores")
          .delete()
          .in("id", idsToDelete);

        if (deleteError) {
          console.error(deleteError);

          setError(
            `Score was saved, but old scores could not be removed: ${deleteError.message}`,
          );

          return;
        }
      }

      setSuccess("Score saved successfully.");

      setScore("");
      setDate("");

      // Give the user a moment to see success message.
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } catch (error) {
      console.error(error);

      setError("Something went wrong while saving your score.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className="form-page score-page">
        <button
          type="button"
          className="back"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to dashboard
        </button>

        <div className="page-heading">
          <span className="eyebrow">MY SCORES</span>

          <h1>Add golf score</h1>

          <p>Keep your scorecard up to date to stay eligible for every draw.</p>
        </div>

        <div className="panel score-form">
          <div className="score-form-intro">
            <span className="score-form-icon">◎</span>

            <div>
              <strong>Log a round</strong>

              <small>We use Stableford scoring for the monthly draw.</small>
            </div>
          </div>

          {error && (
            <div
              className="form-error"
              style={{
                padding: "12px",
                marginBottom: "16px",
                background: "#fff0f0",
                border: "1px solid #ffcccc",
                borderRadius: "8px",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                padding: "12px",
                marginBottom: "16px",
                background: "#eefaf1",
                border: "1px solid #b7e4c2",
                borderRadius: "8px",
                color: "#287a3d",
              }}
            >
              {success}
            </div>
          )}

          <label className="form-field">
            <span>
              Score <small>(1 - 45)</small>
            </span>

            <input
              type="number"
              min="1"
              max="45"
              step="1"
              value={score}
              onChange={(e) => {
                const value = e.target.value;

                setScore(value);
                setScoreError("");

                if (value === "") {
                  return;
                }

                const numericValue = Number(value);

                if (
                  !Number.isInteger(numericValue) ||
                  numericValue < 1 ||
                  numericValue > 45
                ) {
                  setScoreError(
                    "Score must be a whole number between 1 and 45.",
                  );
                }
              }}
              placeholder="Enter score"
            />

            {scoreError && (
              <small
                style={{
                  color: "#d93025",
                  marginTop: "6px",
                  display: "block",
                }}
              >
                {scoreError}
              </small>
            )}
          </label>

          <label className="form-field">
            <span>Date</span>

            <input
              type="date"
              value={date}
              onClick={(event) => {
                if (typeof event.currentTarget.showPicker === "function") {
                  event.currentTarget.showPicker();
                }
              }}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          <div className="rules">
            <strong>Score rules</strong>

            <span>✓ Score must be between 1 and 45</span>

            <span>✓ Only one score per date</span>

            <span>✓ Only latest 5 scores are kept</span>
          </div>

          <div className="score-form-footer">
            <small>Scores can be added once per day.</small>

            <Button type="button" onClick={handleSaveScore} disabled={loading}>
              {loading ? "Saving..." : "Save Score"}
            </Button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
