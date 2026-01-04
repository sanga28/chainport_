import "../styles/sasap.css";
import { useLocation, useNavigate } from "react-router-dom";

/*
  SASAP = Security Aware Serverless Application Partitioning
  This page performs *analysis only*.
  Deployment gating happens AFTER this step.
*/

export default function SASAPAnalysis() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <div style={{ padding: 40 }}>
        <h2>Choose a container from the Marketplace</h2>
    <br/>
     <button onClick={() => navigate("/marketplace")}>
          ← Back to Marketplace
        </button>
        </div>;
  }

  const {
    tokenId,
    name,
    version,
    trustScore = 0,
    history = { timesDeployed: 0, failedExecutions: 0 },
  } = state;

  /* ================= SASAP DIMENSIONS ================= */

  // 1️⃣ Identity & provenance (wallet + NFT + metadata)
  const identityScore = Math.min(100, trustScore + 5);

  // 2️⃣ Image integrity & versioning discipline
  const integrityScore = trustScore;

  // 3️⃣ Runtime behavior (execution outcomes)
  const behaviorScore =
    history.failedExecutions > 0
      ? Math.max(30, 70 - history.failedExecutions * 20)
      : Math.min(95, 70 + history.timesDeployed * 5);

  // 4️⃣ Supply-chain exposure (trust maturity)
  const supplyChainScore =
    trustScore >= 80 ? 90 : trustScore >= 60 ? 70 : trustScore >= 40 ? 50 : 25;

  /* ================= FINAL SASAP SCORE ================= */

  const finalScore = Math.round(
    (identityScore +
      integrityScore +
      behaviorScore +
      supplyChainScore) / 4
  );

  /* ================= PLACEMENT DECISION ================= */

  let placement;
  let explanation;

  if (finalScore >= 85) {
    placement = "EDGE + CLOUD (HYBRID)";
    explanation =
      "High trust, stable execution history, and low supply-chain risk.";
  } else if (finalScore >= 70) {
    placement = "CLOUD (RESTRICTED)";
    explanation =
      "Moderate risk detected. Edge deployment avoided for safety.";
  } else {
    placement = "BLOCKED";
    explanation =
      "Security and/or behavior risks exceed acceptable thresholds.";
  }

  const canDeploy = finalScore >= 70;

  /* ================= UI ================= */

  return (
    <div className="sasap-root">
      <header className="sasap-header">
        <h1>SASAP Security & Placement Analysis</h1>
        <p>
          Security-aware analysis for serverless container deployment across
          Edge and Cloud
        </p>
      </header>

      {/* CONTAINER INFO */}
      <section className="sasap-card">
        <h2>{name}</h2>
        <p>
          Version <b>{version}</b> • Token #{tokenId}
        </p>
      </section>

      {/* METRICS */}
      <section className="sasap-grid">
        <Metric
          title="Identity & Provenance"
          value={identityScore}
          description="Publisher identity and on-chain ownership"
        />
        <Metric
          title="Image Integrity"
          value={integrityScore}
          description="Digest validity and version discipline"
        />
        <Metric
          title="Runtime Behavior"
          value={behaviorScore}
          description="Observed execution outcomes"
        />
        <Metric
          title="Supply-Chain Exposure"
          value={supplyChainScore}
          description="Dependency and trust maturity"
        />
      </section>

      {/* FINAL DECISION */}
      <section className="sasap-decision">
        <div className="score-circle">{finalScore}</div>

        <h3>Deployment Decision</h3>
        <p className="placement">{placement}</p>
        <p className="explanation">{explanation}</p>

        <button
          className={`sasap-btn ${!canDeploy ? "blocked" : ""}`}
          disabled={!canDeploy}
          onClick={() =>
            navigate("/deployservice", {
              state: {
                ...state,
                sasapScore: finalScore,
                placement,
              },
            })
          }
        >
          {canDeploy ? "Proceed to Deployment" : "Deployment Blocked"}
        </button>
      </section>
    </div>
  );
}

/* ================= METRIC COMPONENT ================= */

function Metric({ title, value, description }) {
  return (
    <div className="metric-card">
      <h4>{title}</h4>

      <div className="metric-bar">
        <div
          className="metric-fill"
          style={{
            width: `${value}%`,
            background:
              value >= 80
                ? "#22c55e"
                : value >= 60
                ? "#facc15"
                : "#ef4444",
          }}
        />
      </div>

      <strong>{value}%</strong>
      <p>{description}</p>
    </div>
  );
}
