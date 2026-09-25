import Logo from "../components/Logo";
import Button from "../components/Button";

const charities = [
  ["🌱", "Green Earth Foundation", "Environment"],
  ["❤️", "Hope for Children", "Child Welfare"],
  ["🤲", "Health for All", "Healthcare"],
  ["📚", "Education First", "Education"],
];

export default function CharitySelection() {
  return (
    <div className="center-page charity-page">
      <div className="page-container">
        <Logo />

        <a href="/subscription" className="back">
          ← Back
        </a>

        <div className="onboarding-progress" aria-label="Signup progress">
          <span className="progress-step complete">
            01 <small>Plan</small>
          </span>
          <span className="progress-line complete" />
          <span className="progress-step current">
            02 <small>Charity</small>
          </span>
          <span className="progress-line" />
          <span className="progress-step">
            03 <small>Ready</small>
          </span>
        </div>

        <div className="page-heading">
          <span className="eyebrow">STEP 2</span>

          <h1>Choose your charity</h1>

          <p>Select a cause that matters to you.</p>
        </div>

        <div className="charity-list">
          {charities.map(([icon, name, category], index) => (
            <label
              className={`charity-option ${index === 0 ? "selected" : ""}`}
              key={name}
            >
              <input type="radio" name="charity" defaultChecked={index === 0} />

              <span className="charity-option-icon" aria-hidden="true">
                {icon}
              </span>

              <span className="charity-option-copy">
                <strong>{name}</strong>
                <small>{category}</small>
              </span>

              <span className="charity-check" aria-hidden="true">
                ✓
              </span>
            </label>
          ))}
        </div>

        <div className="contribution">
          <div className="contribution-heading">
            <span>
              <strong>Your contribution</strong>
              <small>Choose how much reaches your charity</small>
            </span>
            <strong className="contribution-value">10%</strong>
          </div>

          <input type="range" min="10" max="25" defaultValue="10" />

          <small>Minimum contribution: 10% of subscription</small>
        </div>

        <p className="selection-note">
          You can update your charity or contribution any time from your
          dashboard.
        </p>

        <Button to="/dashboard">Continue</Button>
      </div>
    </div>
  );
}
