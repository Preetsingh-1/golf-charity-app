import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";

interface Props {
  children: ReactNode;
}

export default function UserLayout({ children }: Props) {
  return (
    <div className="app-layout">

      <aside className="sidebar">

        <Logo />

        <nav>

          <NavLink to="/dashboard">
            ⌂ Dashboard
          </NavLink>

          <NavLink to="/scores/add">
            ◷ My Scores
          </NavLink>

          <NavLink to="/charity-selection">
            ♡ My Charity
          </NavLink>

          <NavLink to="/draw-results">
            ◉ Draws
          </NavLink>

          <NavLink to="/winner-verification">
            ★ Winnings
          </NavLink>

        </nav>

        <a href="/" className="logout">
          ↪ Logout
        </a>

      </aside>

      <main className="main-content">
        {children}
      </main>

    </div>
  );
}