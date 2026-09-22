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
    <div className="center-page">

      <div className="page-container">

        <Logo />

        <a href="/subscription" className="back">
          ← Back
        </a>

        <div className="page-heading">

          <span className="eyebrow">
            STEP 2
          </span>

          <h1>Choose your charity</h1>

          <p>
            Select a cause that matters to you.
          </p>

        </div>

        <div className="charity-list">

          {charities.map(
            ([icon, name, category], index) => (

              <label
                className={`charity-option ${
                  index === 0 ? "selected" : ""
                }`}
                key={name}
              >

                <input
                  type="radio"
                  name="charity"
                  defaultChecked={index === 0}
                />

                <span className="charity-option-icon">
                  {icon}
                </span>

                <span>
                  <strong>{name}</strong>
                  <small>{category}</small>
                </span>

              </label>

            )
          )}

        </div>

        <div className="contribution">

          <div className="contribution-heading">
            <strong>Your contribution</strong>
            <strong>10%</strong>
          </div>

          <input
            type="range"
            min="10"
            max="25"
            defaultValue="10"
          />

          <small>
            Minimum contribution: 10% of subscription
          </small>

        </div>

        <Button to="/dashboard">
          Continue
        </Button>

      </div>

    </div>
  );
}