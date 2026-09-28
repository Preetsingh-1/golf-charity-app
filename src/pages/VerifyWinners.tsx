import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../lib/supabaseClient";

type Winner = {
  id: string;
  draw_id: string;
  user_id: string;
  match_count: number;
  prize_amount: number;
  payment_status: string;
  created_at: string;
  full_name: string;
  email: string;
  proof_id?: string;
  proof_url?: string;
  verification_status?: string;
  admin_note?: string;
};

export default function VerifyWinners() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [processingId, setProcessingId] = useState<string | null>(null);

  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const loadWinners = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * Get winners
       */
      const {
        data: winnerData,
        error: winnerError,
      } = await supabase
        .from("draw_winners")
        .select(
          "id, draw_id, user_id, match_count, prize_amount, payment_status, created_at"
        )
        .order("created_at", { ascending: false });

      if (winnerError) {
        throw winnerError;
      }

      if (!winnerData || winnerData.length === 0) {
        setWinners([]);
        return;
      }

      /*
       * Get user IDs
       */
      const userIds = [
        ...new Set(winnerData.map((winner) => winner.user_id)),
      ];

      /*
       * Get profiles
       */
      const {
        data: profiles,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);

      if (profileError) {
        throw profileError;
      }

      /*
       * Get winner IDs
       */
      const winnerIds = winnerData.map((winner) => winner.id);

      /*
       * Get proofs
       */
      const {
        data: proofs,
        error: proofError,
      } = await supabase
        .from("winner_proofs")
        .select(
          "id, winner_id, proof_url, verification_status, admin_note"
        )
        .in("winner_id", winnerIds)
        .order("created_at", { ascending: false });

      if (proofError) {
        throw proofError;
      }

      /*
       * Combine data
       */
      const formattedWinners: Winner[] = winnerData.map((winner) => {
        const profile = profiles?.find(
          (item) => item.id === winner.user_id
        );

        const proof = proofs?.find(
          (item) => item.winner_id === winner.id
        );

        return {
          ...winner,
          full_name: profile?.full_name || "Unknown User",
          email: profile?.email || "No email",
          proof_id: proof?.id,
          proof_url: proof?.proof_url,
          verification_status: proof?.verification_status,
          admin_note: proof?.admin_note,
        };
      });

      setWinners(formattedWinners);
    } catch (err: any) {
      console.error("Load winners error:", err);
      setError(err.message || "Failed to load winners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWinners();
  }, []);

  /*
   * Approve winner
   */
  const handleApprove = async (winnerId: string) => {
    try {
      setProcessingId(winnerId);
      setError("");

      const { error } = await supabase.rpc(
        "admin_approve_winner",
        {
          p_winner_id: winnerId,
        }
      );

      if (error) {
        throw error;
      }

      await loadWinners();
    } catch (err: any) {
      console.error("Approve winner error:", err);
      setError(err.message || "Failed to approve winner.");
    } finally {
      setProcessingId(null);
    }
  };

  /*
   * Reject winner
   */
  const handleReject = async (winnerId: string) => {
    if (!rejectNote.trim()) {
      setError("Please enter a reason before rejecting the proof.");
      return;
    }

    try {
      setProcessingId(winnerId);
      setError("");

      const { error } = await supabase.rpc(
        "admin_reject_winner",
        {
          p_winner_id: winnerId,
          p_admin_note: rejectNote.trim(),
        }
      );

      if (error) {
        throw error;
      }

      setRejectingId(null);
      setRejectNote("");

      await loadWinners();
    } catch (err: any) {
      console.error("Reject winner error:", err);
      setError(err.message || "Failed to reject winner.");
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = winners.filter(
    (winner) =>
      winner.verification_status === "pending" ||
      !winner.verification_status
  ).length;

  const approvedCount = winners.filter(
    (winner) => winner.verification_status === "approved"
  ).length;

  const totalPrize = winners.reduce(
    (total, winner) => total + Number(winner.prize_amount || 0),
    0
  );

  return (
    <AdminLayout>
      <div className="admin-page-heading page-heading">
        <span className="eyebrow">WINNER MANAGEMENT</span>

        <h1>Verify Winners</h1>

        <p>
          Review winner submissions, verify proof and manage payouts.
        </p>

        <div className="page-heading-meta">
          <span className="page-meta-chip page-meta-chip--warning">
            {pendingCount} pending reviews
          </span>

          <span className="page-meta-chip page-meta-chip--positive">
            {approvedCount} approved
          </span>

          <span className="page-meta-chip">
            ₹{totalPrize.toFixed(2)} total prizes
          </span>
        </div>
      </div>

      {error && (
        <div
          className="form-error"
          style={{
            marginBottom: 20,
            padding: 14,
          }}
        >
          {error}
        </div>
      )}

      <div className="panel table-container">
        {loading ? (
          <div style={{ padding: 30 }}>
            <p>Loading winners...</p>
          </div>
        ) : winners.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center" }}>
            <h3>No winners found</h3>
            <p>
              There are currently no draw winners to review.
            </p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Winner</th>
                <th>Match</th>
                <th>Prize</th>
                <th>Proof</th>
                <th>Verification</th>
                <th>Payment</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {winners.map((winner) => (
                <tr key={winner.id}>
                  <td>
                    <strong>{winner.full_name}</strong>

                    <div
                      style={{
                        fontSize: 13,
                        color: "#718096",
                        marginTop: 4,
                      }}
                    >
                      {winner.email}
                    </div>
                  </td>

                  <td>
                    <strong>
                      {winner.match_count} Number
                      {winner.match_count !== 1 ? "s" : ""} Match
                    </strong>
                  </td>

                  <td>
                    <strong>
                      ₹{Number(winner.prize_amount).toFixed(2)}
                    </strong>
                  </td>

                  <td>
                    {winner.proof_url ? (
                      <a
                        href={winner.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button button-secondary"
                        style={{
                          display: "inline-block",
                          textDecoration: "none",
                        }}
                      >
                        View Proof
                      </a>
                    ) : (
                      <span>No proof</span>
                    )}
                  </td>

                  <td>
                    {winner.verification_status === "approved" ? (
                      <span className="page-meta-chip page-meta-chip--positive">
                        Approved
                      </span>
                    ) : winner.verification_status === "rejected" ? (
                      <span className="page-meta-chip page-meta-chip--warning">
                        Rejected
                      </span>
                    ) : (
                      <span className="page-meta-chip page-meta-chip--warning">
                        Pending
                      </span>
                    )}
                  </td>

                  <td>
                    {winner.payment_status === "paid" ? (
                      <span className="page-meta-chip page-meta-chip--positive">
                        Paid
                      </span>
                    ) : (
                      <span className="page-meta-chip page-meta-chip--warning">
                        Pending
                      </span>
                    )}
                  </td>

                  <td>
                    {winner.verification_status === "approved" ? (
                      <span className="page-meta-chip page-meta-chip--positive">
                        Payment Released
                      </span>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          type="button"
                          className="button button-primary"
                          disabled={processingId === winner.id}
                          onClick={() =>
                            handleApprove(winner.id)
                          }
                        >
                          {processingId === winner.id
                            ? "Processing..."
                            : "Approve"}
                        </button>

                        <button
                          type="button"
                          className="button button-secondary"
                          disabled={processingId === winner.id}
                          onClick={() => {
                            setRejectingId(winner.id);
                            setRejectNote("");
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20,
          }}
        >
          <div
            className="panel"
            style={{
              width: "100%",
              maxWidth: 500,
              padding: 30,
              background: "#fff",
            }}
          >
            <h2>Reject Winner Proof</h2>

            <p style={{ marginBottom: 20 }}>
              Please provide a reason for rejecting this proof.
            </p>

            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={5}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #d1d5db",
                resize: "vertical",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 20,
              }}
            >
              <button
                type="button"
                className="button button-secondary"
                onClick={() => {
                  setRejectingId(null);
                  setRejectNote("");
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="button button-primary"
                disabled={processingId === rejectingId}
                onClick={() =>
                  handleReject(rejectingId)
                }
              >
                {processingId === rejectingId
                  ? "Rejecting..."
                  : "Reject Proof"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}