import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import Button from "../components/Button";
import { supabase } from "../lib/supabaseClient";

type Charity = {
  id: string;
  icon?: string | null;
  name: string;
  category?: string | null;
  status?: string | null;
};

export default function Home() {
  const [charities, setCharities] = useState<Charity[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadFeaturedCharities = async () => {
      const { data, error } = await supabase
        .from("charities")
        .select("*")
        .order("name")
        .limit(4);

      if (error) {
        console.error("Featured charities load error:", error);
        return;
      }

      if (mounted) {
        setCharities(
          ((data || []) as Charity[]).filter(
            (charity) =>
              !charity.status || charity.status.toLowerCase() === "active",
          ),
        );
      }
    };

    void loadFeaturedCharities();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <PublicHeader />

      {/* Hero */}

      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">GOLF TODAY. A BRIGHTER TOMORROW.</span>

          <h1>
            Play for
            <br />
            <em>Something Bigger.</em>
          </h1>

          <p>
            Enter your golf scores, participate in monthly prize draws and
            support a charity of your choice.
          </p>

          <Button to="/signup">Get Started →</Button>
        </div>

        <div className="hero-visual">
          <div className="golf-icon">⛳</div>
        </div>
      </section>

      {/* How it works */}

      <section className="steps" id="how-it-works">
        <div className="step">
          <span>01</span>
          <h3>Play</h3>
          <p>Subscribe and enter your golf scores.</p>
        </div>

        <div className="step">
          <span>02</span>
          <h3>Win</h3>
          <p>Participate in monthly prize draws.</p>
        </div>

        <div className="step">
          <span>03</span>
          <h3>Give</h3>
          <p>Support a charity of your choice.</p>
        </div>
      </section>

      {/* Charities */}

      <section className="section" id="charities">
        <div className="section-heading">
          <div>
            <span className="eyebrow">MAKE AN IMPACT</span>

            <h2>Featured charities</h2>
          </div>

          <Link to="/charities">View all →</Link>
        </div>

        <div className="charity-grid">
          {charities.map((charity) => (
            <div className="charity-card" key={charity.name}>
              <div className="charity-image">{charity.icon || "♡"}</div>

              <div className="charity-content">
                <h3>{charity.name}</h3>

                <p>{charity.category || "Community cause"}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
