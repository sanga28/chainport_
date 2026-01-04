import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ContainerRegistry from "../contracts/ContainerRegistry.json";
import DeploymentManager from "../contracts/DeploymentManager.json";

const CAN_DOWNLOAD_THRESHOLD = 70;
const CAN_DEPLOY_THRESHOLD = 80;

export default function MyContainers() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  const [ownedContainers, setOwnedContainers] = useState([]);
  const [sharedContainers, setSharedContainers] = useState([]);
  const [deploying, setDeploying] = useState(null);

  /* 🔐 PERMISSIONS (SIMULATED) */
  const [permissions, setPermissions] = useState({});

  /* 📜 EXECUTION HISTORY */
  const [executionHistory, setExecutionHistory] = useState({});

  /* 🔍 TRUST BREAKDOWN MODAL */
  const [trustModal, setTrustModal] = useState(null);

  /* ================= WALLET ================= */
  useEffect(() => {
    async function restoreWallet() {
      if (!window.ethereum) return setLoading(false);
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length) setWallet(accounts[0]);
      setLoading(false);
    }
    restoreWallet();
  }, []);

  /* ================= LOAD CONTAINERS ================= */
  useEffect(() => {
    if (!wallet || !window.ethereum) return;

    async function loadContainers() {
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const registry = new ethers.Contract(
        ContainerRegistry.address,
        ContainerRegistry.abi,
        signer
      );

      const total = Number(await registry.nextTokenId());
      const owned = [];
      const shared = [];

      for (let tokenId = 1; tokenId <= total; tokenId++) {
        try {
          const owner = await registry.ownerOf(tokenId);
          const uri = await registry.tokenURI(tokenId);
          const meta = await fetch(
            uri.replace("ipfs://", "https://ipfs.io/ipfs/")
          ).then((r) => r.json());

          /* ---------- TRUST BREAKDOWN ---------- */
          const breakdown = {
            metadata: meta.description?.length >= 15 ? 15 : 5,
            versioning: /^\d+\.\d+\.\d+$/.test(meta.version) ? 15 : 5,
            imageHash: meta.imageHash?.startsWith("sha256:") ? 15 : 0,
            timestamp: meta.createdAt ? 10 : 0,
            executions: Math.floor(Math.random() * 20),
          };

          const trustScore = Math.min(
            30 +
              breakdown.metadata +
              breakdown.versioning +
              breakdown.imageHash +
              breakdown.timestamp +
              Math.min(breakdown.executions, 15),
            100
          );

          /* ---------- SLA + UPTIME ---------- */
          const uptime = 97 + Math.random() * 3; // 97–100%

          const container = {
            tokenId,
            name: meta.containerName,
            version: meta.version,
            imageHash: meta.imageHash,
            trustScore,
            uptime,
            breakdown,
            owner,
          };

          if (owner.toLowerCase() === wallet.toLowerCase()) {
            owned.push(container);
          }

          if (
            permissions[tokenId] === wallet.toLowerCase() &&
            owner.toLowerCase() !== wallet.toLowerCase()
          ) {
            shared.push(container);
          }
        } catch {
          continue;
        }
      }

      setOwnedContainers(owned);
      setSharedContainers(shared);
      setLoading(false);
    }

    loadContainers();
  }, [wallet, permissions]);

  /* ================= PERMISSIONS ================= */
  const grantPermission = (tokenId, address) => {
    if (!ethers.isAddress(address)) return alert("Invalid wallet address");
    setPermissions((p) => ({ ...p, [tokenId]: address.toLowerCase() }));
    alert("✅ Deployment permission granted");
  };

  const revokePermission = (tokenId) => {
    setPermissions((p) => {
      const copy = { ...p };
      delete copy[tokenId];
      return copy;
    });
    alert("🛑 Permission revoked");
  };

  /* ================= DEPLOY ================= */
  const deployContainer = async (tokenId, trustScore) => {
    if (trustScore < CAN_DEPLOY_THRESHOLD)
      return alert("Deployment blocked: Low trust score");

    setDeploying(tokenId);

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const manager = new ethers.Contract(
      DeploymentManager.address,
      DeploymentManager.abi,
      signer
    );

    await (await manager.requestDeployment(tokenId)).wait();

    setExecutionHistory((h) => ({
      ...h,
      [tokenId]: [
        ...(h[tokenId] || []),
        { by: signer.address, time: new Date().toLocaleString() },
      ],
    }));

    setDeploying(null);
  };

  /* ================= DOWNLOAD ================= */
  const downloadImageHash = (hash, name, trustScore) => {
    if (trustScore < CAN_DOWNLOAD_THRESHOLD)
      return alert("Download blocked: Low trust score");

    const blob = new Blob([hash], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}-image-hash.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ================= ANALYTICS ================= */
  const avgTrust =
    ownedContainers.reduce((a, c) => a + c.trustScore, 0) /
    (ownedContainers.length || 1);

  const totalDeployments = Object.values(executionHistory).reduce(
    (a, b) => a + b.length,
    0
  );

  if (loading) return <p>Loading containers…</p>;
  if (!wallet) return <p>Please connect wallet.</p>;

  return (
    <>
      {/* ================= CSS ================= */}
      <style>{`
        .mc-root{background:#0b1220;color:#e5e7eb;padding:40px 60px;font-family:Segoe UI}
        .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:26px}
        .card{background:linear-gradient(180deg,#0f172a,#020617);border-radius:14px;padding:22px}
        .pill{padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600}
        .green{background:#14532d;color:#86efac}
        .orange{background:#78350f;color:#fde68a}
        .red{background:#7f1d1d;color:#fecaca}
        button,input{width:100%;margin-top:10px;padding:10px;border-radius:6px}
        button{background:linear-gradient(90deg,#2563eb,#0ea5e9);color:white;border:none;font-weight:600}
        .secondary{background:#374151}
        .analytics{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-bottom:40px}
        .metric{background:#020617;padding:18px;border-radius:12px;text-align:center}
        .modal{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center}
        .modal-box{background:#020617;padding:26px;border-radius:14px;width:420px}
      `}</style>

      <div className="mc-root">
        <h1>Owner Dashboard</h1>

        {/* 🔥 ANALYTICS */}
        <div className="analytics">
          <div className="metric">
            <h3>{ownedContainers.length}</h3>
            <p>Total Containers</p>
          </div>
          <div className="metric">
            <h3>{avgTrust.toFixed(1)}</h3>
            <p>Average Trust Score</p>
          </div>
          <div className="metric">
            <h3>{totalDeployments}</h3>
            <p>Total Deployments</p>
          </div>
        </div>

        <h2>Containers I Own</h2>
        <div className="grid">
          {ownedContainers.map((c) => (
            <div key={c.tokenId} className="card">
              <h3>{c.name}</h3>
              <p>Version: {c.version}</p>

              <p>
                Trust: <span className="pill green">{c.trustScore}/100</span>
              </p>
              <p>
                SLA Uptime: <span className="pill">{c.uptime.toFixed(2)}%</span>
              </p>

              <button className="secondary" onClick={() => setTrustModal(c)}>
                View Trust Breakdown
              </button>

              {permissions[c.tokenId] && (
                <>
                  <p>Deploy Access: {permissions[c.tokenId]}</p>
                  <button
                    className="secondary"
                    onClick={() => revokePermission(c.tokenId)}
                  >
                    Revoke Permission
                  </button>
                </>
              )}

              <input
                placeholder="Grant deploy access"
                id={`grant-${c.tokenId}`}
              />
              <button
                className="secondary"
                onClick={() =>
                  grantPermission(
                    c.tokenId,
                    document.getElementById(`grant-${c.tokenId}`).value
                  )
                }
              >
                Grant Permission
              </button>

              <button
                onClick={() =>
                  downloadImageHash(c.imageHash, c.name, c.trustScore)
                }
              >
                Download Image Hash
              </button>

              {executionHistory[c.tokenId] && (
                <>
                  <h4>Execution History</h4>
                  {executionHistory[c.tokenId].map((e, i) => (
                    <p key={i}>
                      {e.by.slice(0, 6)}… — {e.time}
                    </p>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>

        <h2>Containers Shared With Me</h2>
        <div className="grid">
          {sharedContainers.map((c) => (
            <div key={c.tokenId} className="card">
              <h3>{c.name}</h3>
              <p>Version: {c.version}</p>
              <button
                onClick={() => deployContainer(c.tokenId, c.trustScore)}
                disabled={deploying === c.tokenId}
              >
                {deploying === c.tokenId ? "Deploying…" : "Request Deployment"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🔍 TRUST MODAL */}
      {trustModal && (
        <div className="modal" onClick={() => setTrustModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Trust Score Breakdown</h3>
            {Object.entries(trustModal.breakdown).map(([k, v]) => (
              <p key={k}>
                {k}: +{v}
              </p>
            ))}
            <button onClick={() => setTrustModal(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
