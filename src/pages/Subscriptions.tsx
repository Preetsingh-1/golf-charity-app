import AdminLayout from "../components/AdminLayout";

const subscriptions = [
  ["Preeti Singh", "Monthly", "₹999", "12 Oct 2026", "Active"],
  ["Rohan Sharma", "Yearly", "₹9,999", "05 May 2027", "Active"],
  ["Anita Kumar", "Monthly", "₹999", "18 Sep 2026", "Inactive"],
  ["Vikram Patel", "Yearly", "₹9,999", "21 Feb 2027", "Active"],
];

export default function Subscriptions() {
  return (
    <AdminLayout>

      <div className="page-heading">

        <span className="eyebrow">
          SUBSCRIPTION MANAGEMENT
        </span>

        <h1>Subscriptions</h1>

        <p>
          Monitor subscriber plans and renewal status.
        </p>

      </div>

      <div className="panel table-container">

        <div className="table-toolbar">

          <input placeholder="Search subscribers..." />

          <select>
            <option>All subscriptions</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

        </div>

        <table>

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

            {subscriptions.map((item) => (

              <tr key={item[0]}>

                <td>{item[0]}</td>
                <td>{item[1]}</td>
                <td>{item[2]}</td>
                <td>{item[3]}</td>

                <td>
                  <span className="status">
                    {item[4]}
                  </span>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </AdminLayout>
  );
}