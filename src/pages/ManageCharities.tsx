import AdminLayout from "../components/AdminLayout";

const charities = [
  ["Green Earth Foundation", "Environment", "Active"],
  ["Hope for Children", "Child Welfare", "Active"],
  ["Health for All", "Healthcare", "Active"],
  ["Education First", "Education", "Active"],
];

export default function ManageCharities() {
  return (
    <AdminLayout>
      <div className="admin-page-heading page-heading">
        <span className="eyebrow">CHARITY MANAGEMENT</span>

        <h1>Charities</h1>

        <p>Manage charity listings.</p>

        <div className="page-heading-meta">
          <span className="page-meta-chip page-meta-chip--positive">
            {charities.length} active charities
          </span>
          <span className="page-meta-chip">10% of subscriptions donated</span>
        </div>
      </div>

      <div className="panel table-container">
        <div className="panel-header">
          <h2>Charity Directory</h2>

          <button className="btn btn-primary" type="button">
            Add Charity
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {charities.map((charity) => (
              <tr key={charity[0]}>
                <td>{charity[0]}</td>

                <td>{charity[1]}</td>

                <td>
                  <span className="status active">{charity[2]}</span>
                </td>

                <td>
                  <a className="table-action" href="#">
                    Edit listing
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
