import UserLayout from "../components/UserLayout";
import Button from "../components/Button";

export default function ProfileSettings() {
  return (
    <UserLayout>

      <div className="form-page">

        <div className="page-heading">

          <span className="eyebrow">
            ACCOUNT
          </span>

          <h1>Profile & Settings</h1>

          <p>
            Manage your account details and subscription.
          </p>

        </div>

        <div className="panel settings-panel">

          <h2>Personal details</h2>

          <div className="two-fields">

            <label>
              Full Name
              <input defaultValue="Preeti Singh" />
            </label>

            <label>
              Email
              <input defaultValue="preeti@example.com" />
            </label>

          </div>

          <label>
            Phone
            <input defaultValue="+91 9876543210" />
          </label>

          <Button>
            Save Changes
          </Button>

        </div>

        <div className="panel settings-panel">

          <h2>Subscription</h2>

          <div className="subscription-setting">

            <div>
              <span>Current plan</span>
              <strong>Monthly</strong>
            </div>

            <div>
              <span>Status</span>
              <strong className="active-text">
                Active
              </strong>
            </div>

            <div>
              <span>Renewal date</span>
              <strong>12 October 2026</strong>
            </div>

          </div>

          <Button variant="secondary">
            Manage Subscription
          </Button>

        </div>

      </div>

    </UserLayout>
  );
}