import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Button from "../components/Button";
import { supabase } from "../lib/supabaseClient";

export default function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  setError("");

  if (!fullName.trim()) {
    setError("Please enter your full name.");
    return;
  }

  if (!email.trim()) {
    setError("Please enter your email address.");
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(normalizedEmail)) {
    setError("Please enter a valid email address.");
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
  }

  try {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });

    if (error) {
      console.error("Signup error:", error);

      setError(error.message);
      return;
    }

    /*
     * Supabase can return a successful-looking response
     * for an email that already exists.
     *
     * For an existing email, identities can be an empty array.
     */
    if (
      data.user &&
      data.user.identities &&
      data.user.identities.length === 0
    ) {
      setError(
        "Email already exists. Please use a different email or login."
      );
      return;
    }

    /*
     * Email confirmation disabled:
     * Supabase creates a session immediately.
     */
    if (data.session) {
      navigate("/subscription");
      return;
    }

    /*
     * New account but email confirmation is enabled.
     */
    if (data.user) {
      setError(
        "Account created. Please check your email to confirm your account."
      );
      return;
    }

    setError("Unable to create your account. Please try again.");
  } catch (err) {
    console.error("Signup error:", err);

    setError(
      err instanceof Error
        ? err.message
        : "Something went wrong. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-page signup-page">
      <aside className="signup-showcase">
        <div className="signup-showcase-top">
          <Logo />
          <span className="showcase-badge">A BETTER WAY TO PLAY</span>
        </div>

        <div className="signup-showcase-copy">
          <span className="eyebrow">
            ONE SUBSCRIPTION. THREE WAYS TO MAKE AN IMPACT.
          </span>

          <h2>Good golf does more good.</h2>

          <p>
            Join a community turning their scorecards into meaningful support
            for charities across the country.
          </p>
        </div>

        <div className="signup-steps" aria-label="How Golf for Good works">
          <span>
            <b>01</b> Play your round
          </span>

          <span>
            <b>02</b> Join the draw
          </span>

          <span>
            <b>03</b> Give back
          </span>
        </div>
      </aside>

      <div className="auth-card">
        <Logo />

        <div className="auth-heading">
          <span className="eyebrow">CREATE ACCOUNT</span>

          <h1>Create your account</h1>

          <p>Join Golf for Good and play for a bigger purpose.</p>
        </div>

        <form className="form" onSubmit={handleSignup}>
          <label className="signup-field">
            <span>Full name</span>

            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
            />
          </label>

          <label className="signup-field">
            <span>Email address</span>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label className="signup-field">
            <span>Password</span>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a secure password"
              autoComplete="new-password"
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <p className="form-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>

      <div className="auth-image">
        <span>“Small swings can create big change.”</span>
      </div>
    </div>
  );
}
