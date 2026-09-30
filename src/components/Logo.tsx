import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="logo">
      <span className="logo-icon">✦</span>
      <span>Golf for Good</span>
    </Link>
  );
}
