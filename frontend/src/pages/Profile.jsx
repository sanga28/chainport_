import { useEffect, useState } from "react";

export default function Profile() {
  /* ================= AUTH ================= */
  const [wallet, setWallet] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function restoreWallet() {
      if (!window.ethereum) {
        setAuthLoading(false);
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts", // 🔥 restores wallet on reload
      });

      if (accounts.length > 0) {
        localStorage.setItem("wallet", accounts[0]);
        setWallet(accounts[0]);
      }

      setAuthLoading(false);
    }

    restoreWallet();
  }, []);

  /* ================= GUARDS ================= */
  if (authLoading) {
    return <p>Restoring wallet…</p>;
  }

  if (!wallet) {
    return <p>Please connect your wallet to view your profile.</p>;
  }

  /* ================= UI ================= */
  return (
    <div className="page-container">
      <h1>My Profile</h1>

      <div className="card">
        <p><b>Name:</b> ChainPort User</p>
        <p><b>Email:</b> user@chainport.io</p>
        <p><b>Wallet Address:</b> {wallet}</p>
        <p><b>Role:</b> Standard User</p>
        <p><b>Joined:</b> December 2025</p>
      </div>

      <div className="card" style={{ marginTop: "20px" }}>
        <h3>Account Actions</h3>
        <button disabled>Edit Profile</button>
      </div>
    </div>
  );
}
