import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import Button from "../components/Button";

export default function Draws() {
  return (
    <div className="public-page">
      <PublicHeader />

      <main className="draws-page">
        <section className="draws-hero">
          <div className="draws-hero-content">
            <span className="section-eyebrow">MONTHLY DRAW</span>

            <h1>
              Play your game.
              <br />
              Give back.
              <br />
              <span>Win something meaningful.</span>
            </h1>

            <p>
              Every month, eligible subscribers take part in our community draw.
              Match numbers to unlock rewards while supporting the charity you
              care about.
            </p>

            <div className="draws-actions">
              <Button to="/signup">Join the community</Button>

              <Link to="/login" className="draw-login-link">
                Already a member? Login
              </Link>
            </div>
          </div>

          <aside className="draw-highlight" aria-label="Monthly draw overview">
            <div className="draw-highlight-heading">
              <span>YOUR GAME, IN THE DRAW</span>
              <strong>Every month</strong>
            </div>

            <div className="draw-highlight-stat">
              <span>Numbers drawn</span>
              <strong>05</strong>
            </div>

            <div className="draw-highlight-divider" />

            <div className="draw-highlight-stat">
              <span>Jackpot share</span>
              <strong>
                40<small>%</small>
              </strong>
            </div>

            <p>Play regularly. Give back with every eligible entry.</p>
          </aside>
        </section>

        <section className="draws-info">
          <div className="section-heading">
            <span className="section-eyebrow">HOW IT WORKS</span>
            <h2>A simple monthly draw</h2>
            <p>
              Your subscription gives you access to the monthly draw and helps
              support charitable causes.
            </p>
          </div>

          <div className="draw-steps">
            <div className="draw-step">
              <div className="draw-step-number">01</div>
              <h3>Subscribe</h3>
              <p>
                Choose a monthly or yearly subscription to become an eligible
                participant.
              </p>
            </div>

            <div className="draw-step">
              <div className="draw-step-number">02</div>
              <h3>Play & score</h3>
              <p>
                Record your Stableford golf scores and keep your latest five
                scores in the system.
              </p>
            </div>

            <div className="draw-step">
              <div className="draw-step-number">03</div>
              <h3>Monthly draw</h3>
              <p>
                Five numbers are drawn each month and matched against eligible
                participant results.
              </p>
            </div>

            <div className="draw-step">
              <div className="draw-step-number">04</div>
              <h3>Win & give</h3>
              <p>
                Matching numbers can unlock prizes while your chosen charity
                receives your selected contribution.
              </p>
            </div>
          </div>
        </section>

        <section className="prize-section">
          <div className="section-heading">
            <span className="section-eyebrow">PRIZE STRUCTURE</span>
            <h2>More matches. Bigger rewards.</h2>
          </div>

          <div className="prize-grid">
            <div className="prize-card prize-card-jackpot">
              <span className="prize-match">5 MATCH</span>
              <strong>40%</strong>
              <p>of the prize pool</p>
              <small>Jackpot</small>
            </div>

            <div className="prize-card">
              <span className="prize-match">4 MATCH</span>
              <strong>35%</strong>
              <p>of the prize pool</p>
              <small>Major prize</small>
            </div>

            <div className="prize-card">
              <span className="prize-match">3 MATCH</span>
              <strong>25%</strong>
              <p>of the prize pool</p>
              <small>Entry prize</small>
            </div>
          </div>
        </section>

        <section className="draw-cta">
          <span className="section-eyebrow">READY TO PLAY?</span>

          <h2>
            Turn your golf game
            <br />
            into positive impact.
          </h2>

          <p>Join Golf for Good and take part in the next monthly draw.</p>

          <Button to="/signup">Sign Up</Button>
        </section>
      </main>
    </div>
  );
}
