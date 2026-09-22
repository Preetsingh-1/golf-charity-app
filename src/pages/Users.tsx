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

      <div className="page-heading">

        <span className="eyebrow">
          USER MANAGEMENT
        </span>

        <h1>Users</h1>

        <p>
          View and manage registered subscribers.
        </p>

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

        <table>

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
                  <span className="status">
                    {user[3]}
                  </span>
                </td>

                <td>
                  <a href="#">
                    View
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