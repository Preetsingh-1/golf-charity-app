import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Button from "../components/Button";
import { supabase } from "../lib/supabaseClient";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeRecovery = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session && mounted) {
        setReady(true);
      }
    };

    initializeRecovery();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          event === "PASSWORD_RECOVERY" &&
          session &&
          mounted
        ) {
          setReady(true);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!ready) {
      setError(
        "This password reset link is invalid or has expired. Please request a new reset link."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { error } =
        await supabase.auth.updateUser({
          password,
        });

      if (error) {
        setError(error.message);
        return;
      }

      setMessage(
        "Password updated successfully. Redirecting to login..."
      );

      setPassword("");
      setConfirmPassword("");

      // Remove the recovery session before going to login.
      await supabase.auth.signOut();

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(
        "Reset password error:",
        err
      );

      setError(
        "Unable to update your password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page single">
      <div className="auth-card">
        <Logo />

        <div className="auth-heading">
          <span className="eyebrow">
            NEW PASSWORD
          </span>

          <h1>Reset your password</h1>

          <p>
            Enter your new password below.
          </p>
        </div>

        <form
          className="form"
          onSubmit={handleSubmit}
        >
          <label className="login-field">
            <span>New password</span>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter new password"
              autoComplete="new-password"
            />
          </label>

          <label className="login-field">
            <span>Confirm password</span>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
          </label>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          {message && (
            <p className="form-success">
              {message}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading || !ready}
          >
            {loading
              ? "Updating..."
              : "Update Password"}
          </Button>
        </form>

        <p className="form-footer">
          Remember your password?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}