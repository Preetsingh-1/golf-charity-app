import AdminLayout from "../components/AdminLayout";

const users = [
  ["Preeti Singh", "preeti@example.com", "Monthly", "Active"],
  ["Rohan Sharma", "rohan@example.com", "Yearly", "Active"],
  ["Anita Kumar", "anita@example.com", "Monthly", "Inactive"],
  ["Vikram Patel", "vikram@example.com", "Yearly", "Active"],
];

export default function Users() {
  return (
    <AdminLayout>
      <div className="admin-page-heading page-heading">
        <span className="eyebrow">USER MANAGEMENT</span>

        <h1>Users</h1>

        <p>View and manage registered subscribers.</p>

        <div className="page-heading-meta">
          <span className="page-meta-chip">{users.length} registered</span>
          <span className="page-meta-chip page-meta-chip--positive">
            3 active
          </span>
        </div>
      </div>

      <div className="panel table-container">
        <div className="table-toolbar">
          <input placeholder="Search users..." />

          <select>
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
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user[1]}>
                <td>{user[0]}</td>
                <td>{user[1]}</td>
                <td>{user[2]}</td>

                <td>
                  <span
                    className={`status ${user[3] === "Active" ? "active" : "inactive"}`}
                  >
                    {user[3]}
                  </span>
                </td>

                <td>
                  <a className="table-action" href="#">
                    View profile
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
