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

      <div className="page-heading">

        <span className="eyebrow">
          CHARITY MANAGEMENT
        </span>

        <h1>Charities</h1>

        <p>
          Manage charity listings.
        </p>

      </div>

      <div className="panel table-container">

        <div className="panel-header">

          <h2>
            Charity Directory
          </h2>

          <button className="btn btn-primary">
            + Add Charity
          </button>

        </div>

        <table>

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
                  <span className="status">
                    {charity[2]}
                  </span>
                </td>

                <td>
                  <a href="#">
                    Edit
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