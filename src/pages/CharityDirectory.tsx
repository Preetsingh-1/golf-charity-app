import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PublicHeader from "../components/PublicHeader";
import { supabase } from "../lib/supabaseClient";

type Charity = {
  id: string;
  name: string;
  category?: string | null;
  description?: string | null;
  icon?: string | null;
  status?: string | null;
};

export default function CharityDirectory() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadCharities = async () => {
      const { data, error: charityError } = await supabase
        .from("charities")
        .select("*")
        .order("name");

      if (!mounted) return;

      if (charityError) {
        console.error("Charity directory load error:", charityError);
        setError("Unable to load charity partners. Please try again later.");
      } else {
        setCharities(
          ((data || []) as Charity[]).filter(
            (charity) =>
              !charity.status || charity.status.toLowerCase() === "active",
          ),
        );
      }

      setLoading(false);
    };

    void loadCharities();

    return () => {
      mounted = false;
    };
  }, []);

  const categories = Array.from(
    new Set(
      charities
        .map((charity) => charity.category)
        .filter((category): category is string => Boolean(category)),
    ),
  );

  const filteredCharities = charities.filter((charity) => {
    const matchesSearch =
      `${charity.name} ${charity.category || ""} ${charity.description || ""}`
        .toLowerCase()
        .includes(search.trim().toLowerCase());
    const matchesCategory =
      selectedCategory === "All categories" ||
      charity.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <PublicHeader />

      <main className="directory-page">
        <section className="directory-intro">
          <div>
            <span className="eyebrow">MAKE AN IMPACT</span>
            <h1>Our charity partners</h1>
            <p>Explore the causes supported by Golf for Good.</p>
          </div>

          <div className="directory-intro-stat">
            <strong>{loading ? "—" : charities.length}</strong>
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

          {loading ? (
            <div className="directory-empty" role="status">
              Loading charity partners...
            </div>
          ) : error ? (
            <div className="directory-empty" role="alert">
              {error}
            </div>
          ) : filteredCharities.length > 0 ? (
            <div className="directory-grid">
              {filteredCharities.map((charity) => (
                <article className="directory-card" key={charity.id}>
                  <div
                    className={`directory-image directory-image--${charity.id}`}
                  >
                    <span aria-hidden="true">{charity.icon || "♡"}</span>
                    <span className="directory-image-label">
                      Golf for Good partner
                    </span>
                  </div>

                  <div className="directory-content">
                    {charity.category && (
                      <span className="category">{charity.category}</span>
                    )}
                    <h3>{charity.name}</h3>
                    <p>{charity.description || "Supporting our community."}</p>
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
