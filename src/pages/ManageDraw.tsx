import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import Button from "../components/Button";
import { supabase } from "../lib/supabaseClient";

type DrawType = "random" | "algorithmic";

type Draw = {
  id: string;
  draw_month: string;
  number_1: number;
  number_2: number;
  number_3: number;
  number_4: number;
  number_5: number;
  draw_type: DrawType;
  status: "simulated" | "published";
  prize_pool: number;
  jackpot_rollover: number;
};

type Winner = {
  user_id: string;
  match_count: number;
  prize_amount: number;
};

export default function ManageDraw() {
  const navigate = useNavigate();

  const [drawMonth, setDrawMonth] = useState("2026-09");
  const [drawType, setDrawType] = useState<DrawType>("random");

  const [draw, setDraw] = useState<Draw | null>(null);

  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [winnerCount, setWinnerCount] = useState(0);

  // --------------------------------------------------
  // Generate 5 unique random numbers
  // --------------------------------------------------

  const generateRandomNumbers = (): number[] => {
    const numbers: number[] = [];

    while (numbers.length < 5) {
      const number = Math.floor(Math.random() * 45) + 1;

      if (!numbers.includes(number)) {
        numbers.push(number);
      }
    }

    return numbers.sort((a, b) => a - b);
  };

  // --------------------------------------------------
  // Algorithmic draw
  // --------------------------------------------------

  const generateAlgorithmicNumbers = async (): Promise<number[]> => {
    const { data: scores, error } = await supabase
      .from("scores")
      .select("score");

    if (error) {
      throw new Error(
        `Unable to read score history: ${error.message}`
      );
    }

    if (!scores || scores.length === 0) {
      return generateRandomNumbers();
    }

    const frequency: Record<number, number> = {};

    scores.forEach((item) => {
      frequency[item.score] =
        (frequency[item.score] || 0) + 1;
    });

    const weightedNumbers: number[] = [];

    Object.entries(frequency).forEach(
      ([score, count]) => {
        const number = Number(score);

        for (let i = 0; i < count; i++) {
          weightedNumbers.push(number);
        }
      }
    );

    const selected = new Set<number>();

    while (
      selected.size < 5 &&
      weightedNumbers.length > 0
    ) {
      const index = Math.floor(
        Math.random() * weightedNumbers.length
      );

      selected.add(weightedNumbers[index]);
    }

    while (selected.size < 5) {
      const number =
        Math.floor(Math.random() * 45) + 1;

      selected.add(number);
    }

    return Array.from(selected).sort(
      (a, b) => a - b
    );
  };

  // --------------------------------------------------
  // Calculate prize pool
  // --------------------------------------------------

  const calculatePrizePool = async (): Promise<number> => {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("amount, user_id")
      .eq("status", "active");

    if (error) {
      throw new Error(
        `Unable to calculate prize pool: ${error.message}`
      );
    }

    if (!data || data.length === 0) {
      return 0;
    }

    const uniqueUsers = new Map<string, number>();

    data.forEach((subscription) => {
      if (!uniqueUsers.has(subscription.user_id)) {
        uniqueUsers.set(
          subscription.user_id,
          Number(subscription.amount || 0)
        );
      }
    });

    let total = 0;

    uniqueUsers.forEach((amount) => {
      total += amount;
    });

    return total;
  };

  // --------------------------------------------------
  // Find winners
  // --------------------------------------------------

  const calculateWinners = async (
    currentDraw: Draw
  ): Promise<{
    winners: Winner[];
    jackpotRollover: number;
  }> => {
    const {
      data: subscriptions,
      error: subscriptionError,
    } = await supabase
      .from("subscriptions")
      .select("user_id")
      .eq("status", "active");

    if (subscriptionError) {
      throw new Error(
        `Unable to get active subscribers: ${subscriptionError.message}`
      );
    }

    if (
      !subscriptions ||
      subscriptions.length === 0
    ) {
      return {
        winners: [],
        jackpotRollover:
          Number(currentDraw.jackpot_rollover || 0) +
          Number(currentDraw.prize_pool || 0) * 0.4,
      };
    }

    const userIds = Array.from(
      new Set(
        subscriptions.map(
          (subscription) =>
            subscription.user_id
        )
      )
    );

    const {
      data: scores,
      error: scoresError,
    } = await supabase
      .from("scores")
      .select(
        "user_id, score, played_at"
      )
      .in("user_id", userIds)
      .order("played_at", {
        ascending: false,
      });

    if (scoresError) {
      throw new Error(
        `Unable to get user scores: ${scoresError.message}`
      );
    }

    const winningNumbers = [
      currentDraw.number_1,
      currentDraw.number_2,
      currentDraw.number_3,
      currentDraw.number_4,
      currentDraw.number_5,
    ];

    const userScores: Record<
      string,
      number[]
    > = {};

    userIds.forEach((userId) => {
      userScores[userId] = [];
    });

    (scores || []).forEach((item) => {
      if (
        userScores[item.user_id] &&
        userScores[item.user_id].length < 5
      ) {
        userScores[item.user_id].push(
          Number(item.score)
        );
      }
    });

    const winners: Winner[] = [];

    userIds.forEach((userId) => {
      const scoresForUser =
        userScores[userId] || [];

      const matchCount =
        winningNumbers.filter((number) =>
          scoresForUser.includes(number)
        ).length;

      if (matchCount >= 3) {
        winners.push({
          user_id: userId,
          match_count: matchCount,
          prize_amount: 0,
        });
      }
    });

    const prizePool =
      Number(currentDraw.prize_pool || 0);

    const fiveMatchWinners =
      winners.filter(
        (winner) =>
          winner.match_count === 5
      );

    const fourMatchWinners =
      winners.filter(
        (winner) =>
          winner.match_count === 4
      );

    const threeMatchWinners =
      winners.filter(
        (winner) =>
          winner.match_count === 3
      );

    const jackpotAmount =
      prizePool * 0.4 +
      Number(
        currentDraw.jackpot_rollover || 0
      );

    const fourMatchAmount =
      prizePool * 0.35;

    const threeMatchAmount =
      prizePool * 0.25;

    if (fiveMatchWinners.length > 0) {
      const amountPerWinner =
        jackpotAmount /
        fiveMatchWinners.length;

      fiveMatchWinners.forEach(
        (winner) => {
          winner.prize_amount =
            Number(
              amountPerWinner.toFixed(2)
            );
        }
      );
    }

    if (fourMatchWinners.length > 0) {
      const amountPerWinner =
        fourMatchAmount /
        fourMatchWinners.length;

      fourMatchWinners.forEach(
        (winner) => {
          winner.prize_amount =
            Number(
              amountPerWinner.toFixed(2)
            );
        }
      );
    }

    if (threeMatchWinners.length > 0) {
      const amountPerWinner =
        threeMatchAmount /
        threeMatchWinners.length;

      threeMatchWinners.forEach(
        (winner) => {
          winner.prize_amount =
            Number(
              amountPerWinner.toFixed(2)
            );
        }
      );
    }

    const jackpotRollover =
      fiveMatchWinners.length === 0
        ? jackpotAmount
        : 0;

    return {
      winners,
      jackpotRollover,
    };
  };

  // --------------------------------------------------
  // Simulate
  // --------------------------------------------------

  const handleSimulate = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");
      setDraw(null);
      setWinnerCount(0);

      if (!drawMonth) {
        setError(
          "Please select a draw month."
        );
        return;
      }

      const drawDate =
        `${drawMonth}-01`;

      // Generate numbers
      const numbers =
        drawType === "algorithmic"
          ? await generateAlgorithmicNumbers()
          : generateRandomNumbers();

      // Calculate prize pool
      const prizePool =
        await calculatePrizePool();

      /*
       * IMPORTANT:
       * We no longer insert directly into
       * public.draws from the browser.
       *
       * The secure Supabase RPC performs the
       * admin check and creates/updates the draw.
       */

      const {
        data,
        error,
      } = await supabase.rpc(
        "admin_save_draw",
        {
          p_draw_month: drawDate,
          p_number_1: numbers[0],
          p_number_2: numbers[1],
          p_number_3: numbers[2],
          p_number_4: numbers[3],
          p_number_5: numbers[4],
          p_draw_type: drawType,
          p_prize_pool: prizePool,
          p_five_percentage: 40,
          p_four_percentage: 35,
          p_three_percentage: 25,
          p_jackpot_rollover: 0,
        }
      );

      if (error) {
        throw new Error(
          `Unable to create draw: ${error.message}`
        );
      }

      if (!data) {
        throw new Error(
          "Draw was created but no data was returned."
        );
      }

      setDraw(data as Draw);

      setMessage(
        "Draw simulated successfully. Review the numbers before publishing."
      );
    } catch (error) {
      console.error(
        "Simulation error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to simulate draw."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Publish
  // --------------------------------------------------

 const handlePublish = async () => {
  if (!draw) {
    setError("Please simulate a draw first.");
    return;
  }

  try {
    setPublishing(true);
    setError("");
    setMessage("");
    setWinnerCount(0);

    // Calculate winners
    const {
      winners,
      jackpotRollover,
    } = await calculateWinners(draw);

    // Prepare winner data for secure RPC
    const winnerPayload = winners.map(
      (winner) => ({
        user_id: winner.user_id,
        match_count: winner.match_count,
        prize_amount: winner.prize_amount,
      })
    );

    // Secure admin publish operation
    const {
      data,
      error,
    } = await supabase.rpc(
      "admin_publish_draw",
      {
        p_draw_id: draw.id,
        p_winners: winnerPayload,
        p_jackpot_rollover:
          jackpotRollover,
      }
    );

    if (error) {
      throw new Error(
        `Unable to publish draw: ${error.message}`
      );
    }

    if (!data) {
      throw new Error(
        "Draw was published but no data was returned."
      );
    }

    setDraw(data as Draw);
    setWinnerCount(winners.length);

    setMessage(
      winners.length > 0
        ? `Draw published successfully. ${winners.length} winner(s) found.`
        : "Draw published successfully. No winners found. The 5-match jackpot has been rolled over."
    );

  } catch (error) {
    console.error(
      "Publish error:",
      error
    );

    setError(
      error instanceof Error
        ? error.message
        : "Unable to publish draw."
    );

  } finally {
    setPublishing(false);
  }
};

  // --------------------------------------------------
  // Format month
  // --------------------------------------------------

  const formatMonth = (
    month: string
  ) => {
    const date = new Date(
      `${month.substring(
        0,
        7
      )}-01T00:00:00`
    );

    return date.toLocaleDateString(
      "en-IN",
      {
        month: "long",
        year: "numeric",
      }
    );
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <AdminLayout>
      <div className="form-page">

        <button
          type="button"
          className="back"
          onClick={() =>
            navigate("/admin")
          }
        >
          ← Back
        </button>

        <div className="admin-page-heading page-heading">

          <span className="eyebrow">
            DRAW MANAGEMENT
          </span>

          <h1>
            Run monthly draw
          </h1>

          <p>
            Configure, simulate and publish
            the monthly draw.
          </p>

          <div className="page-heading-meta">

            <span className="page-meta-chip">
              5 winning numbers
            </span>

            <span className="page-meta-chip page-meta-chip--positive">
              40% jackpot allocation
            </span>

          </div>

        </div>

        {error && (
          <div className="form-message form-message--error">
            {error}
          </div>
        )}

        {message && (
          <div className="form-message form-message--success">
            {message}
          </div>
        )}

        <div className="panel draw-config-panel">

          <label className="draw-field">

            <span>
              Draw Month
            </span>

            <input
              type="month"
              value={drawMonth}
              onChange={(e) =>
                setDrawMonth(
                  e.target.value
                )
              }
            />

          </label>

          <div className="draw-distribution">

            <strong>
              Prize Pool Distribution
            </strong>

            <div>
              <span>
                5 Number Match
              </span>

              <b>
                40%
              </b>
            </div>

            <div>
              <span>
                4 Number Match
              </span>

              <b>
                35%
              </b>
            </div>

            <div>
              <span>
                3 Number Match
              </span>

              <b>
                25%
              </b>
            </div>

          </div>

          <div className="radio-group">

            <label>

              <input
                type="radio"
                name="drawType"
                checked={
                  drawType ===
                  "random"
                }
                onChange={() =>
                  setDrawType(
                    "random"
                  )
                }
              />

              Random

            </label>

            <label>

              <input
                type="radio"
                name="drawType"
                checked={
                  drawType ===
                  "algorithmic"
                }
                onChange={() =>
                  setDrawType(
                    "algorithmic"
                  )
                }
              />

              Algorithmic

            </label>

          </div>

          <Button
            type="button"
            onClick={
              handleSimulate
            }
            disabled={
              loading ||
              publishing
            }
          >
            {loading
              ? "Simulating..."
              : "Simulate Draw"}
          </Button>

        </div>

        {draw && (
          <div className="panel draw-result-panel">

            <div className="page-heading">

              <span className="eyebrow">
                SIMULATION
              </span>

              <h2>
                {formatMonth(
                  draw.draw_month
                )}
              </h2>

              <p>
                Status:{" "}
                <strong>
                  {draw.status}
                </strong>
              </p>

            </div>

            <div className="winning-box">

              <div className="winning-box-heading">

                <span>
                  DRAW NUMBERS
                </span>

                <strong>
                  Winning numbers
                </strong>

              </div>

              <div className="numbers">

                {[
                  draw.number_1,
                  draw.number_2,
                  draw.number_3,
                  draw.number_4,
                  draw.number_5,
                ].map(
                  (
                    number,
                    index
                  ) => (
                    <span
                      key={`${number}-${index}`}
                    >
                      {String(
                        number
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>
                  )
                )}

              </div>

            </div>

            <div className="draw-summary">

              <div className="draw-summary-item">

                <span>
                  Draw type
                </span>

                <strong>
                  {draw.draw_type}
                </strong>

              </div>

              <div className="draw-summary-item">

                <span>
                  Prize pool
                </span>

                <strong>
                  ₹
                  {Number(
                    draw.prize_pool ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              {draw.status ===
                "published" && (
                <div className="draw-summary-item">

                  <span>
                    Winners found
                  </span>

                  <strong>
                    {winnerCount}
                  </strong>

                </div>
              )}

            </div>

            <Button
              type="button"
              onClick={
                handlePublish
              }
              disabled={
                publishing ||
                draw.status ===
                  "published"
              }
            >
              {publishing
                ? "Publishing..."
                : draw.status ===
                  "published"
                  ? "Draw Published"
                  : "Publish Draw"}
            </Button>

          </div>
        )}

      </div>
    </AdminLayout>
  );
}