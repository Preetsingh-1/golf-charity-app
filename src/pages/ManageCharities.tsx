import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabaseClient";

type Charity = {
  id: string;
  name: string;
  category?: string | null;
  status?: string | null;
};

export default function ManageCharities() {
  const [charities, setCharities] = useState<Charity[]>([]);
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
        console.error("Admin charities load error:", charityError);
        setError("Unable to load charities. Check admin data permissions.");
      } else {
        setCharities((data || []) as Charity[]);
      }

      setLoading(false);
    };

    void loadCharities();

    return () => {
      mounted = false;
    };
  }, []);

  const activeCount = charities.filter(
    (charity) => charity.status?.toLowerCase() === "active",
  ).length;

  return (
    <AdminLayout>
      <div className="admin-page-heading page-heading">
        <span className="eyebrow">CHARITY MANAGEMENT</span>

        <h1>Charities</h1>

        <p>Manage charity listings.</p>

        <div className="page-heading-meta">
          <span className="page-meta-chip page-meta-chip--positive">
            {loading
              ? "Loading charities..."
              : `${activeCount} active charities`}
          </span>
          <span className="page-meta-chip">
            Charity contribution rates are set by members
          </span>
        </div>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="panel table-container">
        <div className="panel-header">
          <h2>Charity Directory</h2>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Record ID</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4}>Loading charities...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4}>{error}</td>
              </tr>
            ) : charities.length === 0 ? (
              <tr>
                <td colSpan={4}>No charities are configured.</td>
              </tr>
            ) : (
              charities.map((charity) => (
                <tr key={charity.id}>
                  <td>{charity.name}</td>

                  <td>{charity.category || "—"}</td>

                  <td>
                    <span
                      className={`status ${charity.status?.toLowerCase() === "active" ? "active" : "inactive"}`}
                    >
                      {charity.status || "Unspecified"}
                    </span>
                  </td>

                  <td>{charity.id}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
