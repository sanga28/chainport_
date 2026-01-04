import { useState } from "react";

export default function ConnectWallet({ onConnected }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const connectWallet = async () => {
    setError("");

    if (!window.ethereum) {
      setError("MetaMask not detected. Please install MetaMask.");
      return;
    }

    try {
      setLoading(true);

      // This ALWAYS triggers permission if not previously approved
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        throw new Error("No account selected");
      }

      const address = accounts[0];
      setAccount(address);
      onConnected(address);

    } catch (err) {
      if (err.code === 4001) {
        // User rejected
        setError("Wallet connection was rejected.");
      } else {
        console.error("Wallet connection error:", err);
        setError("Failed to connect wallet.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (account) {
    return (
      <div className="wallet-connected">
        Connected: {account.slice(0, 6)}...{account.slice(-4)}
      </div>
    );
  }

  return (
    <div>
      <button
        className="wallet-btn"
        onClick={connectWallet}
        disabled={loading}
      >
        {loading ? "Waiting for MetaMask..." : "Connect Wallet"}
      </button>

      {error && (
        <p style={{ marginTop: "8px", color: "#d9534f", fontSize: "0.9em" }}>
          {error}
        </p>
      )}
    </div>
  );
}
