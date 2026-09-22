import UserLayout from "../components/UserLayout";
import Button from "../components/Button";

export default function WinnerVerification() {
  return (
    <UserLayout>

      <div className="form-page">

        <a href="/draw-results" className="back">
          ← Back
        </a>

        <div className="page-heading">

          <span className="eyebrow">
            WINNER VERIFICATION
          </span>

          <h1>
            Congratulations! 🎉
          </h1>

          <p>
            You've won a prize in the September draw.
          </p>

        </div>

        <div className="winner-grid">

          <div className="panel prize-card">

            <span>
              4 Number Match
            </span>

            <h2>
              ₹25,000
            </h2>

            <p>
              Payment status:
              Pending verification
            </p>

          </div>

          <div className="panel">

            <h2>
              Upload proof
            </h2>

            <p>
              Upload a screenshot of your
              golf score for verification.
            </p>

            <div className="upload-box">

              <span>☁</span>

              <strong>
                Click to upload
              </strong>

              <small>
                PNG, JPG — Max 5MB
              </small>

            </div>

            <Button to="/dashboard">
              Submit for Verification
            </Button>

          </div>

        </div>

      </div>

    </UserLayout>
  );
}