import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/*
  🔹 DEMO DATA
*/
const DEMO_CONTAINERS = [
  {
    id: 1,
    name: "node-auth-service",
    version: "1.2.0",
    owner: "0xA91b3E9cD1234567890aBCDEF1234567890AbC",
    description: "Authentication microservice built with Node.js and JWT.",
    trustScore: 82,
  },
  {
    id: 2,
    name: "ml-inference-api",
    version: "0.9.1",
    owner: "0xF29c8eE91234567890aBCDEF1234567890Faa",
    description: "Lightweight ML inference API for image classification.",
    trustScore: 68,
  },
  {
    id: 3,
    name: "logging-service",
    version: "2.0.0",
    owner: "0xA91b3E9cD1234567890aBCDEF1234567890AbC",
    description: "Centralized logging and monitoring service.",
    trustScore: 91,
  },
];

export default function Explore() {
  const [containers, setContainers] = useState([]);
  const [wallet, setWallet] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setContainers(DEMO_CONTAINERS);

    const savedWallet = localStorage.getItem("wallet");
    if (savedWallet) setWallet(savedWallet);
  }, []);

  const handleViewDetails = () => {
    // 🔐 mark why we are redirecting
    localStorage.setItem(
      "redirectReason",
      "connect_wallet_for_details"
    );

    navigate("/");
  };

  return (
    <div className="page-container">
      <h1>Explore Marketplace</h1>

      <p style={{ opacity: 0.8, marginBottom: "20px" }}>
        Browse containerized projects published on ChainPort.  
        This view is public and read-only.
      </p>

      <div className="card-grid">
        {containers.map((c) => {
          const isOwner =
            wallet &&
            wallet.toLowerCase() === c.owner.toLowerCase();

          return (
            <div
              key={c.id}
              className="card"
              style={{
                border: isOwner
                  ? "2px solid #4caf50"
                  : "1px solid #ddd",
              }}
            >
              <div className="card-title">
                {c.name}
                {isOwner && (
                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: "12px",
                      color: "#4caf50",
                    }}
                  >
                    (Your Project)
                  </span>
                )}
              </div>

              <div className="card-text">
                <b>Version:</b> {c.version}
              </div>

              <div className="card-text">
                <b>Owner:</b>{" "}
                {c.owner.substring(0, 6)}...{c.owner.slice(-4)}
              </div>

              <div className="card-text">
                <b>Description:</b> {c.description}
              </div>

              <div className="card-text">
                <b>Trust Score:</b>{" "}
                <span
                  style={{
                    color:
                      c.trustScore >= 80
                        ? "green"
                        : c.trustScore >= 60
                        ? "orange"
                        : "red",
                  }}
                >
                  {c.trustScore}/100
                </span>
              </div>

              {/* ACTION */}
              <button onClick={handleViewDetails}>
                View Details
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}