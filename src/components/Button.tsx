import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  children: ReactNode;
  to?: string;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
}

export default function Button({
  children,
  to,
  variant = "primary",
  type = "button",
}: ButtonProps) {

  const className = `btn ${
    variant === "secondary" ? "btn-secondary" : "btn-primary"
  }`;

  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={className}>
      {children}
    </button>
  );
}