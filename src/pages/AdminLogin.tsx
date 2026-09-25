import Logo from "../components/Logo";
import Button from "../components/Button";

export default function AdminLogin() {
  return (
    <div className="auth-page single admin-login-page">
      <div className="admin-login-aside">
        <Logo />
        <span className="eyebrow">DIGITAL HEROES</span>
        <h2>Make every round count.</h2>
        <p>
          Manage subscribers, draws, winners, and the impact created by the
          community.
        </p>
      </div>

      <div className="auth-card">
        <Logo />

        <div className="auth-heading">
          <span className="eyebrow">ADMIN PANEL</span>

          <h1>Admin Login</h1>

          <p>Access platform management.</p>
        </div>

        <form className="form">
          <label className="admin-login-field">
            <span>Email address</span>
            <input type="email" placeholder="admin@example.com" />
          </label>

          <label className="admin-login-field">
            <span>Password</span>
            <input type="password" placeholder="••••••••" />
          </label>

          <Button to="/admin">Login</Button>
        </form>
      </div>
    </div>
  );
}
