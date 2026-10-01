import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

export default function CharityDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [charity, setCharity] = useState<Charity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleChooseCharity = async () => {
    if (!charity) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        navigate("/charity-selection", { state: { charityId: charity.id } });
        return;
      }

      sessionStorage.setItem("pendingCharityId", charity.id);
      navigate("/signup");
    } catch (selectionError) {
      console.error("Unable to start charity selection:", selectionError);
      setError("Unable to start signup. Please try again.");
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadCharity = async () => {
      if (!id) {
        setError("This charity could not be found.");
        setLoading(false);
        return;
      }

      const { data, error: charityError } = await supabase
        .from("charities")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!mounted) return;

      if (charityError) {
        console.error("Charity detail load error:", charityError);
        setError("Unable to load this charity. Please try again later.");
      } else if (
        !data ||
        (data.status && data.status.toLowerCase() !== "active")
      ) {
        setError("This charity could not be found.");
      } else {
        setCharity(data as Charity);
      }

      setLoading(false);
    };

    void loadCharity();

    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <div>
      <PublicHeader />

      <main className="charity-detail">
        <Link to="/charities" className="back">
          ← Back to charities
        </Link>

        {loading ? (
          <div className="charity-detail-empty" role="status">
            Loading charity details...
          </div>
        ) : error ? (
          <div className="charity-detail-empty" role="alert">
            <h1>Charity unavailable</h1>
            <p>{error}</p>
          </div>
        ) : charity ? (
          <>
            <div className="charity-detail-hero">
              <div className="large-charity-icon" aria-hidden="true">
                {charity.icon || "♡"}
              </div>

              <div>
                {charity.category && (
                  <span className="category">{charity.category}</span>
                )}

                <h1>{charity.name}</h1>

                <p>{charity.description || "Supporting our community."}</p>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleChooseCharity}
                >
                  Choose this charity
                </button>
              </div>
            </div>

            <div className="charity-detail-grid">
              <section className="panel">
                <h2>About the charity</h2>
                <p>{charity.description || "Supporting our community."}</p>
              </section>

              <section className="panel">
                <h2>Make an impact</h2>
                <p>
                  Choose this cause during signup to direct your contribution.
                </p>
              </section>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
