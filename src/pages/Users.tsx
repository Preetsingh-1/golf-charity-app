import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabaseClient";

type UserRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
};

type SubscriptionRow = {
  user_id: string;
  plan: string;
  status: string;
  created_at: string;
};

type UserRecord = UserRow & {
  plan: string;
  status: "Active" | "Inactive";
};

export default function Users() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All users");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadUsers = async () => {
      const [
        { data: profiles, error: profileError },
        { data: subscriptions, error: subscriptionError },
      ] = await Promise.all([
        supabase.from("profiles").select("id, full_name, email, role"),
        supabase
          .from("subscriptions")
          .select("user_id, plan, status, created_at")
          .order("created_at", { ascending: false }),
      ]);

      if (!mounted) return;

      if (profileError || subscriptionError) {
        console.error(
          "Admin users load error:",
          profileError || subscriptionError,
        );
        setError(
          "Unable to load users. Check admin data permissions and try again.",
        );
      } else {
        const latestSubscription = new Map<string, SubscriptionRow>();
        ((subscriptions || []) as SubscriptionRow[]).forEach((subscription) => {
          if (!latestSubscription.has(subscription.user_id)) {
            latestSubscription.set(subscription.user_id, subscription);
          }
        });

        setUsers(
          ((profiles || []) as UserRow[])
            .filter((profile) => profile.role !== "admin")
            .map((profile) => {
              const subscription = latestSubscription.get(profile.id);
              return {
                ...profile,
                plan: subscription?.plan || "—",
                status:
                  subscription?.status?.toLowerCase() === "active"
                    ? "Active"
                    : "Inactive",
              };
            }),
        );
      }

      setLoading(false);
    };

    void loadUsers();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = `${user.full_name || ""} ${user.email || ""}`
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    const matchesStatus =
      statusFilter === "All users" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="admin-page-heading page-heading">
        <span className="eyebrow">USER MANAGEMENT</span>

        <h1>Users</h1>

        <p>View and manage registered subscribers.</p>

        <div className="page-heading-meta">
          <span className="page-meta-chip">
            {loading ? "Loading..." : `${users.length} registered`}
          </span>
          <span className="page-meta-chip page-meta-chip--positive">
            {users.filter((user) => user.status === "Active").length} active
          </span>
        </div>
      </div>

      <div className="panel table-container">
        <div className="table-toolbar">
          <input
            type="search"
            placeholder="Search users..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option>All users</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Member ID</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>Loading users...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5}>{error}</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5}>No users match these filters.</td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.full_name || "Unnamed member"}</td>
                  <td>{user.email || "—"}</td>
                  <td>{user.plan}</td>

                  <td>
                    <span
                      className={`status ${user.status === "Active" ? "active" : "inactive"}`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td>
                    <span className="table-action">{user.id.slice(0, 8)}</span>
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
