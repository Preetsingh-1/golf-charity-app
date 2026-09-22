import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="logo">
      <span className="logo-icon">✦</span>
      <span>Digital Heroes</span>
    </Link>
  );
}