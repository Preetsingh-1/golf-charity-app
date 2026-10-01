import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Button from "../components/Button";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        setError(
          error.message === "Invalid login credentials"
            ? "Invalid email or password."
            : error.message,
        );
        return;
      }

      if (!data.user) {
        setError("Unable to load your account. Please try again.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError || !profile) {
        console.error("Account role lookup error:", profileError);
        await supabase.auth.signOut();
        setError("Unable to verify your account. Please try again.");
        return;
      }

      navigate(profile.role === "admin" ? "/admin" : "/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error("Login error:", err);

      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page single login-page">
      <aside className="login-showcase">
        <div className="login-showcase-top">
          <Logo />

          <span className="showcase-badge">PLAY • WIN • GIVE</span>
        </div>

        <div className="login-showcase-copy">
          <span className="eyebrow">YOUR GAME, YOUR IMPACT</span>

          <h2>Every round can make a difference.</h2>

          <p>
            Track your scores, join the monthly draw, and help a charity you
            care about.
          </p>
        </div>

        <div className="login-showcase-stat">
          <strong>10%</strong>

          <span>of every subscription goes to charity</span>
        </div>
      </aside>

      <div className="auth-card">
        <Logo />

        <div className="auth-heading">
          <span className="eyebrow">WELCOME BACK</span>

          <h1>Welcome back</h1>

          <p>Access your Golf for Good account.</p>
        </div>

        <form className="form" onSubmit={handleLogin}>
          <label className="login-field">
            <span>Email address</span>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label className="login-field">
            <span>Password</span>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </label>

          <div className="forgot">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          {error && <p className="form-error">{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="form-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
