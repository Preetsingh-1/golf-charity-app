import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabaseClient";

type SubscriptionRow = {
  id: string;
  user_id: string;
  plan: string;
  amount: number;
  renewal_at: string | null;
  status: string;
  created_at: string;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
};

type SubscriptionRecord = SubscriptionRow & {
  full_name: string;
  email: string;
};

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All subscriptions");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadSubscriptions = async () => {
      const [
        { data: rows, error: subscriptionError },
        { data: profiles, error: profileError },
      ] = await Promise.all([
        supabase
          .from("subscriptions")
          .select("id, user_id, plan, amount, renewal_at, status, created_at")
          .order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, full_name, email"),
      ]);

      if (!mounted) return;

      if (subscriptionError || profileError) {
        console.error(
          "Admin subscriptions load error:",
          subscriptionError || profileError,
        );
        setError(
          "Unable to load subscriptions. Check admin data permissions and try again.",
        );
      } else {
        const profilesById = new Map(
          ((profiles || []) as ProfileRow[]).map((profile) => [
            profile.id,
            profile,
          ]),
        );

        setSubscriptions(
          ((rows || []) as SubscriptionRow[]).map((subscription) => {
            const profile = profilesById.get(subscription.user_id);
            return {
              ...subscription,
              full_name: profile?.full_name || "Unnamed member",
              email: profile?.email || "—",
            };
          }),
        );
      }

      setLoading(false);
    };

    void loadSubscriptions();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const matchesSearch = `${subscription.full_name} ${subscription.email}`
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    const matchesStatus =
      statusFilter === "All subscriptions" ||
      subscription.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const activeCount = subscriptions.filter(
    (subscription) => subscription.status.toLowerCase() === "active",
  ).length;

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime())
      ? "—"
      : parsed.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  const formatAmount = (amount: number) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  return (
    <AdminLayout>
      <div className="admin-page-heading page-heading">
        <span className="eyebrow">SUBSCRIPTION MANAGEMENT</span>

        <h1>Subscriptions</h1>

        <p>Monitor subscriber plans and renewal status.</p>

        <div className="page-heading-meta">
          <span className="page-meta-chip">
            {loading ? "Loading..." : `${subscriptions.length} total plans`}
          </span>
          <span className="page-meta-chip page-meta-chip--positive">
            {activeCount} active
          </span>
        </div>
      </div>

      <div className="panel table-container">
        <div className="table-toolbar">
          <input
            type="search"
            placeholder="Search subscribers..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option>All subscriptions</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Plan</th>
              <th>Amount</th>
              <th>Renewal</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>Loading subscriptions...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5}>{error}</td>
              </tr>
            ) : filteredSubscriptions.length === 0 ? (
              <tr>
                <td colSpan={5}>No subscriptions match these filters.</td>
              </tr>
            ) : (
              filteredSubscriptions.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.full_name}</strong>
                    <small className="table-secondary-text">{item.email}</small>
                  </td>
                  <td>{item.plan}</td>
                  <td>
                    <strong className="table-amount">
                      {formatAmount(item.amount)}
                    </strong>
                  </td>
                  <td>{formatDate(item.renewal_at)}</td>

                  <td>
                    <span
                      className={`status ${
                        item.status.toLowerCase() === "active"
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
