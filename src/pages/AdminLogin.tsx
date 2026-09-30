import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import Logo from "../components/Logo";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Login through Supabase Auth
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

      if (loginError) {
        throw loginError;
      }

      if (!data.user) {
        throw new Error("Unable to login.");
      }

      // Check admin role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, email, role")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        await supabase.auth.signOut();
        throw new Error("Admin profile not found.");
      }

      if (profile.role !== "admin") {
        await supabase.auth.signOut();
        throw new Error("You do not have admin access.");
      }

      // Admin login successful
      navigate("/admin", { replace: true });
    } catch (err: any) {
      console.error("Admin login error:", err);
      setError(err.message || "Admin login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page admin-login-page">
      <aside className="admin-login-aside">
        <Logo />
        <span className="eyebrow">GOLF FOR GOOD ADMIN</span>
        <h2>Lead with impact.</h2>
        <p>
          Manage the community, monthly draws, and the good they make possible.
        </p>
      </aside>

      <div className="auth-card">
        <div className="auth-heading">
          <span className="eyebrow">ADMIN PORTAL</span>
          <h1>Admin Login</h1>
          <p>Sign in to manage the Golf for Good platform.</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <label className="admin-login-field" htmlFor="email">
            <span>Email address</span>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </label>

          <label className="admin-login-field" htmlFor="password">
            <span>Password</span>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
