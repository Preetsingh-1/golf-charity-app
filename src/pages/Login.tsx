import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import Button from "../components/Button";

export default function Login() {
  return (
    <div className="auth-page single">

      <div className="auth-card">

        <Logo />

        <div className="auth-heading">

          <span className="eyebrow">
            WELCOME BACK
          </span>

          <h1>Login</h1>

          <p>
            Access your Digital Heroes account.
          </p>

        </div>

        <form className="form">

          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="••••••••"
            />
          </label>

          <div className="forgot">
            <a href="#">Forgot password?</a>
          </div>

          <Button to="/dashboard">
            Login
          </Button>

        </form>

        <p className="form-footer">
          Don't have an account?{" "}
          <Link to="/signup">
            Sign Up
          </Link>
        </p>

      </div>

    </div>
  );
}