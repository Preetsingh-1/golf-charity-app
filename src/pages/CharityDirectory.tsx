import { Link } from "react-router-dom";
import Logo from "../components/Logo";

const charities = [
  {
    id: "green-earth",
    icon: "🌱",
    name: "Green Earth Foundation",
    category: "Environment",
    description:
      "Supporting environmental protection and sustainability.",
  },
  {
    id: "hope-children",
    icon: "❤️",
    name: "Hope for Children",
    category: "Child Welfare",
    description:
      "Helping children access education, healthcare and support.",
  },
  {
    id: "health-all",
    icon: "🤲",
    name: "Health for All",
    category: "Healthcare",
    description:
      "Working to improve access to essential healthcare.",
  },
  {
    id: "education-first",
    icon: "📚",
    name: "Education First",
    category: "Education",
    description:
      "Creating better educational opportunities for children.",
  },
];

export default function CharityDirectory() {
  return (
    <div>

      <header className="header">
        <Logo />

        <div className="header-actions">
          <Link to="/login">Login</Link>
          <Link to="/signup" className="btn btn-primary">
            Sign Up
          </Link>
        </div>
      </header>

      <main className="directory-page">

        <div className="page-heading center">

          <span className="eyebrow">
            MAKE AN IMPACT
          </span>

          <h1>Our charity partners</h1>

          <p>
            Explore the causes supported by Digital Heroes.
          </p>

        </div>

        <div className="charity-filters">

          <input
            placeholder="Search charities..."
          />

          <select>
            <option>All categories</option>
            <option>Environment</option>
            <option>Healthcare</option>
            <option>Education</option>
            <option>Child Welfare</option>
          </select>

        </div>

        <div className="directory-grid">

          {charities.map((charity) => (

            <div
              className="directory-card"
              key={charity.id}
            >

              <div className="directory-image">
                {charity.icon}
              </div>

              <div className="directory-content">

                <span className="category">
                  {charity.category}
                </span>

                <h3>
                  {charity.name}
                </h3>

                <p>
                  {charity.description}
                </p>

                <Link
                  to={`/charities/${charity.id}`}
                >
                  View charity →
                </Link>

              </div>

            </div>

          ))}

        </div>

      </main>

    </div>
  );
}