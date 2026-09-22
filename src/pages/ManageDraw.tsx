import AdminLayout from "../components/AdminLayout";
import Button from "../components/Button";

export default function ManageDraw() {
  return (
    <AdminLayout>

      <div className="form-page">

        <a href="/admin" className="back">
          ← Back
        </a>

        <div className="page-heading">

          <span className="eyebrow">
            DRAW MANAGEMENT
          </span>

          <h1>Run monthly draw</h1>

          <p>
            Configure the monthly draw.
          </p>

        </div>

        <div className="panel">

          <label>
            Draw Month

            <select>
              <option>
                September 2026
              </option>
            </select>

          </label>

          <div className="draw-distribution">

            <strong>
              Prize Pool Distribution
            </strong>

            <div>
              <span>
                5 Number Match
              </span>
              <b>40%</b>
            </div>

            <div>
              <span>
                4 Number Match
              </span>
              <b>35%</b>
            </div>

            <div>
              <span>
                3 Number Match
              </span>
              <b>25%</b>
            </div>

          </div>

          <div className="radio-group">

            <label>
              <input
                type="radio"
                name="draw"
                defaultChecked
              />
              Random
            </label>

            <label>
              <input
                type="radio"
                name="draw"
              />
              Algorithmic
            </label>

          </div>

          <Button to="/admin/winners">
            Run Draw
          </Button>

        </div>

      </div>

    </AdminLayout>
  );
}