import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import Button from "../components/Button";

export default function Signup() {
  return (
    <div className="auth-page">

      <div className="auth-card">

        <Logo />

        <div className="auth-heading">

          <span className="eyebrow">
            CREATE ACCOUNT
          </span>

          <h1>Create your account</h1>

          <p>
            Join Digital Heroes and play for a bigger purpose.
          </p>

        </div>

        <form className="form">

          <label>
            Full Name
            <input placeholder="Your full name" />
          </label>

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

          <Button to="/subscription">
            Sign Up
          </Button>

        </form>

        <p className="form-footer">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

      <div className="auth-image">
        <span>
          “Small swings can create big change.”
        </span>
      </div>

    </div>
  );
}