import { useState } from "react";
import Logo from "../components/Logo";
import Button from "../components/Button";

const charities = [
  ["🌱", "Green Earth Foundation", "Environment"],
  ["❤️", "Hope for Children", "Child Welfare"],
  ["🤲", "Health for All", "Healthcare"],
  ["📚", "Education First", "Education"],
];

export default function CharitySelection() {
  const [selectedCharity, setSelectedCharity] = useState(charities[0][1]);
  const [contribution, setContribution] = useState(10);

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

        <div
          className="charity-list"
          role="radiogroup"
          aria-label="Choose a charity"
        >
          {charities.map(([icon, name, category]) => (
            <label
              className={`charity-option ${selectedCharity === name ? "selected" : ""}`}
              key={name}
            >
              <input
                type="radio"
                name="charity"
                value={name}
                checked={selectedCharity === name}
                onChange={() => setSelectedCharity(name)}
              />

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
            <output
              className="contribution-value"
              htmlFor="charity-contribution"
            >
              {contribution}%
            </output>
          </div>

          <input
            id="charity-contribution"
            type="range"
            min="10"
            max="25"
            value={contribution}
            onChange={(event) => setContribution(Number(event.target.value))}
            aria-label="Contribution percentage"
          />

          <div className="contribution-range-labels" aria-hidden="true">
            <span>10% minimum</span>
            <span>25% maximum</span>
          </div>
        </div>

        <p className="selected-charity-summary" aria-live="polite">
          Your support is going to <strong>{selectedCharity}</strong>.
        </p>

        <p className="selection-note">
          You can update your charity or contribution any time from your
          dashboard.
        </p>

        <Button to="/dashboard">Continue</Button>
      </div>
    </div>
  );
}
