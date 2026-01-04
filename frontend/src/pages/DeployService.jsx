import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { ethers } from "ethers";
import DeploymentManager from "../contracts/DeploymentManager.json";

/* ================= AI / RESEARCH MODULE ================= */
const AI_INSIGHTS = {
  trust: {
    title: "TRUST VERIFICATION",
    color: "#22d3ee",
    bullets: [
      "Image digest integrity verified",
      "Ownership confirmed on-chain",
      "Execution history evaluated",
    ],
  },
  runtime: {
    title: "SECURE RUNTIME",
    color: "#22c55e",
    bullets: [
      "Isolated execution enforced",
      "High-density safe startup",
      "No escape indicators",
    ],
  },
  sasap: {
    title: "SASAP PLACEMENT",
    color: "#38bdf8",
    bullets: [
      "Security requirements satisfied",
      "Compute demand matched",
      "Edge resource fairness ensured",
    ],
  },
};

export default function DeployService() {
  const navigate = useNavigate();
  const { state } = useLocation();

  /* ================= STATE ================= */
  const [wallet, setWallet] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeInsight, setActiveInsight] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState("Cloud Only");

  /* ================= WALLET ================= */
  useEffect(() => {
    async function restoreWallet() {
      if (!window.ethereum) return;
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length) setWallet(accounts[0]);
    }
    restoreWallet();
  }, []);

  /* ================= SAFE FALLBACK DATA ================= */
  const safeState = state || {
    name: "Unknown Service",
    version: "-",
    owner: "-",
    tokenId: null,
    trustScore: 0,
    history: { timesDeployed: 0, failedExecutions: 0 },
  };
useEffect(() => {
  console.log("DEPLOY STATE:", state);
}, [state]);


  
const resolvedState = state ?? safeState;

const container = resolvedState.container ?? resolvedState;

  const {
    tokenId,
    name,
    version,
    owner,
  } = container;

  const {
    trustScore = 0,
    history = { timesDeployed: 0, failedExecutions: 0 },
    sasapScore,
    placement,
  } = resolvedState;


  /* ================= CORE LOGIC ================= */
  const trustPassed = trustScore >= 70;
  const runtimeSafe =
    trustPassed && history.failedExecutions === 0;

  /* ================= SASAP DECISION (MEMOIZED) ================= */
  const sasapDecision = useMemo(() => {
    if (!runtimeSafe) {
      return {
        target: "Cloud Only",
        fairness: 0.3,
        reason: "Security constraints not satisfied",
      };
    }

    if (trustScore >= 85 && history.timesDeployed >= 3) {
      return {
        target: "Edge + Cloud",
        fairness: 0.9,
        reason: "High trust & stable execution",
      };
    }

    return {
      target: "Cloud Preferred",
      fairness: 0.6,
      reason: "Moderate trust level",
    };
  }, [runtimeSafe, trustScore, history.timesDeployed]);

  /* ================= SYNC TARGET ================= */
  useEffect(() => {
    setSelectedTarget(sasapDecision.target);
  }, [sasapDecision.target]);

  const finalTarget =
    selectedTarget === "Edge + Cloud" && !runtimeSafe
      ? "Cloud Only"
      : selectedTarget;

  /* ================= DEPLOY ================= */
  const handleDeploy = async () => {
    if (!wallet || !confirmed) {
      setMessage("Wallet & confirmation required.");
      return;
    }
   if (!Number.isInteger(Number(tokenId)) || Number(tokenId) <= 0) {
  setMessage("Invalid deployment request.");
  return;
}


    try {
      setLoading(true);
      setMessage("Submitting deployment…");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const manager = new ethers.Contract(
        DeploymentManager.address,
        DeploymentManager.abi,
        signer
      );

      const tx = await manager.requestDeployment(tokenId, {
        value: ethers.parseEther("0.002"),
      });

      await tx.wait();
      setMessage(`Deployment requested → ${finalTarget}`);
    } catch {
      setMessage("Deployment failed.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= NO CONTEXT ================= */
  if (!state) {
    return (
      <div style={{ padding: 40 }}>
        <h2>No deployment context</h2>
        <br/>
        <button onClick={() => navigate("/sasapanalysis")}>
          ← Back to SASAP
        </button>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <>
      <style>{`
        body { margin:0; font-family:"Segoe UI",system-ui; background:#0b1220; }
        .root { display:grid; grid-template-columns:280px 1fr; min-height:100vh; }
        .side { padding:28px; background:#020617; border-right:1px solid rgba(255,255,255,0.06); }
        .content { padding:44px 64px; color:#e5e7eb; }
        .panel { background:#020617; border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:20px; margin-bottom:26px; }
        .bar { height:10px; border-radius:999px; background:#111827; overflow:hidden; }
        .fill { height:100%; transition:width .6s ease; }
        .chip { padding:6px 12px; border-radius:999px; font-size:12px; }
        .btn { padding:14px 26px; border:none; border-radius:8px; font-weight:600; cursor:pointer; }
        .primary { background:linear-gradient(90deg,#2563eb,#0ea5e9); color:white; }
        .disabled { background:#374151; cursor:not-allowed; }
        .insight-btn { background:#020617; border:1px solid #1f2937; color:#9ca3af; padding:10px; border-radius:8px; cursor:pointer; }
      `}</style>

      <div className="root">
        <div className="side">
          <h2>ChainPort</h2>
          <p>Trust-Aware Serverless Deployment</p>
        </div>

        <div className="content">
          <button onClick={() => navigate("/marketplace")}>← Back</button>
          <h1 style={{ marginTop: 16 }}>Deploy Service</h1>

          <div className="panel">
            <b>{name}</b> • v{version}
            <p>Publisher: {owner}</p>
          </div>

          <div className="panel">
            <h3>Trust Evaluation</h3>
            <div className="bar">
              <div
                className="fill"
                style={{
                  width: `${trustScore}%`,
                  background: trustScore >= 80 ? "#22c55e" : "#facc15",
                }}
              />
            </div>
            <p>{trustScore}/100 — {trustPassed ? "PASSED" : "FAILED"}</p>
          </div>

          <div className="panel">
            <h3>Secure Runtime</h3>
            <span
              className="chip"
              style={{
                background: runtimeSafe ? "#022c22" : "#3f1d1d",
                color: runtimeSafe ? "#86efac" : "#fecaca",
              }}
            >
              {runtimeSafe ? "ENABLED" : "DISABLED"}
            </span>
          </div>

          <div className="panel">
            <h3>SASAP Placement</h3>
            <div className="bar">
              <div
                className="fill"
                style={{
                  width: `${sasapDecision.fairness * 100}%`,
                  background: "#38bdf8",
                }}
              />
            </div>
            <p><b>{sasapDecision.target}</b></p>
            <small>{sasapDecision.reason}</small>
          </div>

          <div className="panel">
            <h3>Research Insights</h3>
            <div style={{ display: "flex", gap: 10 }}>
              {Object.values(AI_INSIGHTS).map((i, idx) => (
                <button
                  key={idx}
                  className="insight-btn"
                  onClick={() => setActiveInsight(i)}
                >
                  {i.title}
                </button>
              ))}
            </div>

            {activeInsight && (
              <div className="panel" style={{ marginTop: 16 }}>
                <b style={{ color: activeInsight.color }}>
                  {activeInsight.title}
                </b>
                <ul>
                  {activeInsight.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="panel">
            <label>
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />{" "}
              I acknowledge deployment risks
            </label>
          </div>

          <button
            className={`btn primary ${!trustPassed || loading ? "disabled" : ""}`}
            onClick={handleDeploy}
            disabled={!trustPassed || loading}
          >
            {loading ? "Deploying…" : `Deploy to ${finalTarget}`}
          </button>

          {message && <p style={{ marginTop: 14 }}>{message}</p>}
        </div>
      </div>
    </>
  );
}
