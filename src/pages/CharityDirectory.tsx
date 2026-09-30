import { Link } from "react-router-dom";
import { useState } from "react";
import Logo from "../components/Logo";

const charities = [
  {
    id: "green-earth",
    icon: "🌱",
    name: "Green Earth Foundation",
    category: "Environment",
    description: "Supporting environmental protection and sustainability.",
  },
  {
    id: "hope-children",
    icon: "❤️",
    name: "Hope for Children",
    category: "Child Welfare",
    description: "Helping children access education, healthcare and support.",
  },
  {
    id: "health-all",
    icon: "🤲",
    name: "Health for All",
    category: "Healthcare",
    description: "Working to improve access to essential healthcare.",
  },
  {
    id: "education-first",
    icon: "📚",
    name: "Education First",
    category: "Education",
    description: "Creating better educational opportunities for children.",
  },
];

const categories = Array.from(
  new Set(charities.map((charity) => charity.category)),
);

export default function CharityDirectory() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All categories");

  const filteredCharities = charities.filter((charity) => {
    const matchesSearch =
      `${charity.name} ${charity.category} ${charity.description}`
        .toLowerCase()
        .includes(search.trim().toLowerCase());
    const matchesCategory =
      selectedCategory === "All categories" ||
      charity.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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
        <section className="directory-intro">
          <div>
            <span className="eyebrow">MAKE AN IMPACT</span>
            <h1>Our charity partners</h1>
            <p>Explore the causes supported by Golf for Good.</p>
          </div>

          <div className="directory-intro-stat">
            <strong>{charities.length}</strong>
            <span>causes to explore</span>
          </div>
        </section>

        <section className="directory-listing" aria-label="Charity partners">
          <div className="charity-filters">
            <label className="charity-search">
              <span>Search causes</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name, category or keyword"
              />
            </label>

            <label className="charity-category-filter">
              <span>Category</span>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                <option>All categories</option>
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="directory-results" aria-live="polite">
            <h2>Find your cause</h2>
            <span>
              {filteredCharities.length}{" "}
              {filteredCharities.length === 1 ? "partner" : "partners"}
            </span>
          </div>

          {filteredCharities.length > 0 ? (
            <div className="directory-grid">
              {filteredCharities.map((charity) => (
                <article className="directory-card" key={charity.id}>
                  <div
                    className={`directory-image directory-image--${charity.id}`}
                  >
                    <span aria-hidden="true">{charity.icon}</span>
                    <span className="directory-image-label">
                      Golf for Good partner
                    </span>
                  </div>

                  <div className="directory-content">
                    <span className="category">{charity.category}</span>
                    <h3>{charity.name}</h3>
                    <p>{charity.description}</p>
                    <Link to={`/charities/${charity.id}`}>
                      Explore this cause <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="directory-empty">
              <strong>No matching causes</strong>
              <p>Try another search term or choose a different category.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All categories");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
