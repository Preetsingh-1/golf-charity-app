import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../components/UserLayout";
import Button from "../components/Button";
import { supabase } from "../lib/supabaseClient";

type Winner = {
  id: string;
  draw_id: string;
  match_count: number;
  prize_amount: number;
  payment_status: string;
};

type Proof = {
  id: string;
  proof_url: string;
  verification_status: string;
  admin_note: string | null;
};

type Draw = {
  draw_month: string;
};

export default function WinnerVerification() {
  const navigate = useNavigate();

  const [winner, setWinner] = useState<Winner | null>(null);
  const [draw, setDraw] = useState<Draw | null>(null);
  const [proof, setProof] = useState<Proof | null>(null);

  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadWinner();
  }, []);

  const loadWinner = async () => {
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

      /*
       * Find latest winning record.
       */
      const { data: winnerData, error: winnerError } =
        await supabase
          .from("draw_winners")
          .select(
            `
            id,
            draw_id,
            match_count,
            prize_amount,
            payment_status
          `
          )
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          })
          .limit(1)
          .maybeSingle();

      if (winnerError) {
        throw new Error(
          `Unable to load winner: ${winnerError.message}`
        );
      }

      if (!winnerData) {
        setWinner(null);
        return;
      }

      setWinner(winnerData);

      /*
       * Get draw information.
       */
      const { data: drawData, error: drawError } =
        await supabase
          .from("draws")
          .select("draw_month")
          .eq("id", winnerData.draw_id)
          .maybeSingle();

      if (drawError) {
        console.error(drawError);
      } else {
        setDraw(drawData);
      }

      /*
       * Get existing proof.
       */
      const { data: proofData, error: proofError } =
        await supabase
          .from("winner_proofs")
          .select(
            `
            id,
            proof_url,
            verification_status,
            admin_note
          `
          )
          .eq("winner_id", winnerData.id)
          .order("created_at", {
            ascending: false,
          })
          .limit(1)
          .maybeSingle();

      if (proofError) {
        console.error(proofError);
      } else {
        setProof(proofData);
      }
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load winner information."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError("");
    setMessage("");

    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    /*
     * Maximum 5 MB.
     */
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError(
        "File size must be less than 5MB."
      );
      return;
    }

    /*
     * Only image files.
     */
    if (
      !selectedFile.type.includes("image")
    ) {
      setError(
        "Please upload a PNG or JPG image."
      );
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!winner) {
      setError(
        "No winning record was found."
      );
      return;
    }

    if (!file) {
      setError(
        "Please select a screenshot first."
      );
      return;
    }

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      /*
       * Create unique file name.
       */
      const fileExtension =
        file.name.split(".").pop() || "jpg";

      const fileName =
        `${user.id}/${winner.id}-${Date.now()}.${fileExtension}`;

      /*
       * Upload image to Supabase Storage.
       */
      const { error: uploadError } =
        await supabase.storage
          .from("winner-proofs")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

      if (uploadError) {
        throw new Error(
          `Unable to upload proof: ${uploadError.message}`
        );
      }

      /*
       * Get public URL.
       */
      const { data: publicUrlData } =
        supabase.storage
          .from("winner-proofs")
          .getPublicUrl(fileName);

      const proofUrl =
        publicUrlData.publicUrl;

      /*
       * Save proof record.
       */
      const { data: proofData, error: proofError } =
        await supabase
          .from("winner_proofs")
          .insert({
            winner_id: winner.id,
            proof_url: proofUrl,
            verification_status: "pending",
          })
          .select(
            `
            id,
            proof_url,
            verification_status,
            admin_note
          `
          )
          .single();

      if (proofError) {
        throw new Error(
          `Unable to save proof record: ${proofError.message}`
        );
      }

      setProof(proofData);
      setFile(null);

      setMessage(
        "Proof uploaded successfully. It is now waiting for admin verification."
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to upload proof."
      );
    } finally {
      setUploading(false);
    }
  };

  const formatMonth = (
    month?: string
  ) => {
    if (!month) {
      return "Latest Draw";
    }

    const date = new Date(
      `${month.substring(0, 7)}-01T00:00:00`
    );

    return date.toLocaleDateString(
      "en-IN",
      {
        month: "long",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="form-page verification-page">
          <div className="page-heading">
            <span className="eyebrow">
              WINNER VERIFICATION
            </span>

            <h1>
              Loading...
            </h1>

            <p>
              Checking your winnings.
            </p>
          </div>
        </div>
      </UserLayout>
    );
  }

  /*
   * No winner.
   */
  if (!winner) {
    return (
      <UserLayout>
        <div className="form-page verification-page">

          <button
            type="button"
            className="back"
            onClick={() =>
              navigate("/draw-results")
            }
          >
            ← Back
          </button>

          <div className="page-heading">

            <span className="eyebrow">
              WINNER VERIFICATION
            </span>

            <h1>
              No winnings yet
            </h1>

            <p>
              You do not currently have a winning
              draw result requiring verification.
            </p>

          </div>

          <Button
            to="/draw-results"
            variant="secondary"
          >
            View Draw Results
          </Button>

        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>

      <div className="form-page verification-page">

        <button
          type="button"
          className="back"
          onClick={() =>
            navigate("/draw-results")
          }
        >
          ← Back
        </button>

        <div className="page-heading">

          <span className="eyebrow">
            WINNER VERIFICATION
          </span>

          <h1>
            Congratulations! 🎉
          </h1>

          <p>
            Your prize is waiting. Verify your
            scorecard to claim it.
          </p>

        </div>

        {error && (
          <div
            className="form-error"
            style={{
              padding: "14px",
              marginBottom: "20px",
              background: "#fff0f0",
              border: "1px solid #ffcccc",
              borderRadius: "8px",
            }}
          >
            {error}
          </div>
        )}

        {message && (
          <div
            style={{
              padding: "14px",
              marginBottom: "20px",
              background: "#eefaf1",
              border: "1px solid #b7e4c2",
              borderRadius: "8px",
              color: "#287a3d",
            }}
          >
            {message}
          </div>
        )}

        <div className="winner-grid">

          {/* PRIZE */}

          <div className="panel prize-card">

            <span className="prize-kicker">
              {formatMonth(
                draw?.draw_month
              ).toUpperCase()} DRAW
            </span>

            <span>
              {winner.match_count} Number Match
            </span>

            <h2>
              ₹
              {Number(
                winner.prize_amount || 0
              ).toLocaleString("en-IN")}
            </h2>

            <p>
              Payment status
            </p>

            <strong className="pending-status">
              {winner.payment_status === "paid"
                ? "Paid"
                : proof?.verification_status ===
                  "approved"
                ? "Approved - Payment Pending"
                : proof?.verification_status ===
                  "rejected"
                ? "Proof Rejected"
                : "Pending verification"}
            </strong>

            <div className="verification-steps">

              <span className="complete">
                ✓ Score matched
              </span>

              <span
                className={
                  proof
                    ? "complete"
                    : ""
                }
              >
                {proof
                  ? "✓ Proof submitted"
                  : "○ Proof required"}
              </span>

              <span>
                {winner.payment_status ===
                "paid"
                  ? "✓ Payment released"
                  : "○ Payment released"}
              </span>

            </div>

          </div>

          {/* UPLOAD */}

          <div className="panel upload-panel">

            <h2>
              Upload proof
            </h2>

            <p>
              Upload a clear screenshot of your
              golf score for verification.
            </p>

            {proof ? (

              <div
                style={{
                  padding: "16px",
                  border:
                    "1px solid #dce8e3",
                  borderRadius: "10px",
                  marginBottom: "16px",
                }}
              >

                <strong>
                  Proof submitted
                </strong>

                <p>
                  Status:{" "}
                  <strong>
                    {proof.verification_status}
                  </strong>
                </p>

                <a
                  href={proof.proof_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  View uploaded proof →
                </a>

                {proof.admin_note && (
                  <p>
                    Admin note:{" "}
                    {proof.admin_note}
                  </p>
                )}

              </div>

            ) : (

              <>
                <label
                  className="upload-box"
                  style={{
                    cursor: "pointer",
                    display: "block",
                  }}
                >

                  <span className="upload-icon">
                    ↑
                  </span>

                  <strong>
                    {file
                      ? file.name
                      : "Click to upload"}
                  </strong>

                  <small>
                    PNG, JPG — Max 5MB
                  </small>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={
                      handleFileChange
                    }
                    style={{
                      display: "none",
                    }}
                  />

                </label>

                <Button
                  type="button"
                  onClick={
                    handleUpload
                  }
                  disabled={
                    uploading ||
                    !file
                  }
                >
                  {uploading
                    ? "Uploading..."
                    : "Submit for Verification"}
                </Button>
              </>

            )}

          </div>

        </div>

      </div>

    </UserLayout>
  );
}