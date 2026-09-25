import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../components/UserLayout";
import Button from "../components/Button";
import { supabase } from "../lib/supabaseClient";

type Draw = {
  id: string;
  draw_month: string;
  number_1: number;
  number_2: number;
  number_3: number;
  number_4: number;
  number_5: number;
  prize_pool: number;
  status: string;
};

type Winner = {
  match_count: number;
  prize_amount: number;
  payment_status: string;
};

export default function DrawResults() {
  const navigate = useNavigate();

  const [draw, setDraw] = useState<Draw | null>(null);
  const [winner, setWinner] = useState<Winner | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDraw();
  }, []);

  const loadDraw = async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data: drawData, error: drawError } =
        await supabase
          .from("draws")
          .select(
            `
            id,
            draw_month,
            number_1,
            number_2,
            number_3,
            number_4,
            number_5,
            prize_pool,
            status
          `
          )
          .eq("status", "published")
          .order("draw_month", {
            ascending: false,
          })
          .limit(1)
          .maybeSingle();

      if (drawError) {
        console.error(drawError);

        setError(
          `Unable to load draw: ${drawError.message}`
        );

        return;
      }

      if (!drawData) {
        setDraw(null);
        return;
      }

      setDraw(drawData);

      const { data: winnerData, error: winnerError } =
        await supabase
          .from("draw_winners")
          .select(
            "match_count, prize_amount, payment_status"
          )
          .eq("draw_id", drawData.id)
          .eq("user_id", user.id)
          .order("match_count", {
            ascending: false,
          })
          .limit(1)
          .maybeSingle();

      if (winnerError) {
        console.error(
          "Winner lookup:",
          winnerError
        );

        setWinner(null);
      } else {
        setWinner(winnerData);
      }
    } catch (error) {
      console.error(error);

      setError(
        "Something went wrong while loading the draw."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatMonth = (month: string) => {
    const date = new Date(`${month}-01T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return month;
    }

    return date.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="draw-page results-page">

          <div className="page-heading center">

            <span className="eyebrow">
              DRAW RESULTS
            </span>

            <h1>
              Loading draw...
            </h1>

            <p>
              Checking the latest published draw.
            </p>

          </div>

        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <div className="draw-page results-page">

          <div className="page-heading center">

            <span className="eyebrow">
              DRAW RESULTS
            </span>

            <h1>
              Unable to load draw
            </h1>

            <p>
              {error}
            </p>

          </div>

          <Button
            to="/dashboard"
            variant="secondary"
          >
            Back to Dashboard
          </Button>

        </div>
      </UserLayout>
    );
  }

  if (!draw) {
    return (
      <UserLayout>
        <div className="draw-page results-page">

          <div className="page-heading center">

            <span className="eyebrow">
              DRAW RESULTS
            </span>

            <h1>
              No draw published yet
            </h1>

            <p>
              The next draw results will appear here once
              the administrator publishes them.
            </p>

          </div>

          <Button
            to="/dashboard"
            variant="secondary"
          >
            Back to Dashboard
          </Button>

        </div>
      </UserLayout>
    );
  }

  const numbers = [
    draw.number_1,
    draw.number_2,
    draw.number_3,
    draw.number_4,
    draw.number_5,
  ];

  return (
    <UserLayout>

      <div className="draw-page results-page">

        <div className="page-heading center">

          <span className="eyebrow">
            DRAW RESULTS
          </span>

          <h1>
            {formatMonth(draw.draw_month)} Draw
          </h1>

          <p>
            Check the winning numbers and see how your
            score performed.
          </p>

        </div>

        {/* WINNING NUMBERS */}

        <div className="winning-box">

          <div className="winning-box-heading">

            <span>
              {formatMonth(
                draw.draw_month
              ).toUpperCase()}{" "}
              DRAW
            </span>

            <strong>
              Winning numbers
            </strong>

          </div>

          <div className="numbers">

            {numbers.map((number, index) => (
              <span key={`${number}-${index}`}>
                {String(number).padStart(2, "0")}
              </span>
            ))}

          </div>

        </div>

        {/* PRIZE BREAKDOWN */}

        <div className="match-grid">

          <div className="match-card top-prize">

            <strong>
              5 Number Match
            </strong>

            <b>
              40% of pool
            </b>

            <small>
              Jackpot prize
            </small>

          </div>

          <div className="match-card">

            <strong>
              4 Number Match
            </strong>

            <b>
              35% of pool
            </b>

            <small>
              Second tier
            </small>

          </div>

          <div className="match-card">

            <strong>
              3 Number Match
            </strong>

            <b>
              25% of pool
            </b>

            <small>
              Third tier
            </small>

          </div>

        </div>

        {/* USER RESULT */}

        {winner ? (

          <div className="result-banner">

            <span className="result-icon">
              🏆
            </span>

            <div>

              <small>
                YOUR RESULT
              </small>

              <strong>
                You matched{" "}
                {winner.match_count} numbers!
              </strong>

              <small>
                Prize: ₹
                {Number(
                  winner.prize_amount || 0
                ).toLocaleString("en-IN")}
                {" • "}
                Payment:{" "}
                {winner.payment_status}
              </small>

            </div>

            <Button
              to="/winner-verification"
              variant="secondary"
            >
              View winnings →
            </Button>

          </div>

        ) : (

          <div className="result-banner">

            <span className="result-icon">
              🎯
            </span>

            <div>

              <small>
                YOUR RESULT
              </small>

              <strong>
                No winning match recorded.
              </strong>

              <small>
                Keep playing and enter your latest
                scores for upcoming draws.
              </small>

            </div>

          </div>

        )}

        {/* PRIZE POOL */}

        <div className="secure">

          Current prize pool:{" "}

          <strong>
            ₹
            {Number(
              draw.prize_pool || 0
            ).toLocaleString("en-IN")}
          </strong>

        </div>

        <Button
          to="/dashboard"
          variant="secondary"
        >
          Back to Dashboard
        </Button>

      </div>

    </UserLayout>
  );
}