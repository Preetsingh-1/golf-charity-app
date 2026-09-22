import AdminLayout from "../components/AdminLayout";

const winners = [
  ["Rohan S.", "5 Numbers", "₹1,20,000", "Pending"],
  ["Anita K.", "4 Numbers", "₹25,000", "Pending"],
  ["Vikram P.", "3 Numbers", "₹10,000", "Approved"],
];

export default function VerifyWinners() {
  return (
    <AdminLayout>

      <div className="page-heading">

        <span className="eyebrow">
          WINNER MANAGEMENT
        </span>

        <h1>Verify Winners</h1>

        <p>
          Review winner submissions and payouts.
        </p>

      </div>

      <div className="panel table-container">

        <table>

          <thead>
            <tr>
              <th>User</th>
              <th>Match</th>
              <th>Prize</th>
              <th>Proof</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {winners.map((winner) => (

              <tr key={winner[0]}>

                <td>{winner[0]}</td>

                <td>{winner[1]}</td>

                <td>{winner[2]}</td>

                <td>
                  <a href="#">
                    View
                  </a>
                </td>

                <td>
                  <span className="status">
                    {winner[3]}
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