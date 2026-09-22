import Logo from "../components/Logo";
import Button from "../components/Button";

export default function AdminLogin() {
  return (
    <div className="auth-page single">

      <div className="auth-card">

        <Logo />

        <div className="auth-heading">

          <span className="eyebrow">
            ADMIN PANEL
          </span>

          <h1>Admin Login</h1>

          <p>
            Access platform management.
          </p>

        </div>

        <form className="form">

          <label>
            Email
            <input
              type="email"
              placeholder="admin@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="••••••••"
            />
          </label>

          <Button to="/admin">
            Login
          </Button>

        </form>

      </div>

    </div>
  );
}