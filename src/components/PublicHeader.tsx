import { Link } from "react-router-dom";
import Logo from "./Logo";
import Button from "./Button";

export default function PublicHeader() {
  return (
    <header className="header">

      <Logo />

      <nav className="header-nav">
        <a href="#how-it-works">How it works</a>
        <a href="#charities">Charities</a>
        <a href="#draws">Draws</a>
      </nav>

      <div className="header-actions">
        <Link to="/login">Login</Link>

        <Button to="/signup">
          Sign Up
        </Button>
      </div>

    </header>
  );
}