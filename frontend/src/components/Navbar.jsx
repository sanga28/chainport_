import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Load wallet from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("wallet");
    if (saved) setWallet(saved);

    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        localStorage.removeItem("wallet");
        setWallet(null);
      } else {
        localStorage.setItem("wallet", accounts[0]);
        setWallet(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  // 🔐 CONNECT WALLET (MetaMask)
  const handleConnect = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not found. Please install MetaMask.");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      localStorage.setItem("wallet", accounts[0]);
      setWallet(accounts[0]);
    } catch (err) {
      console.error("Wallet connect error:", err);
      alert(err.message || "Failed to connect wallet");
    }
  };

  // 🔓 DISCONNECT WALLET
  const logout = () => {
    localStorage.removeItem("wallet");
    setWallet(null);
    setOpen(false);
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const shortAddress =
    wallet && `${wallet.substring(0, 6)}...${wallet.slice(-4)}`;

  return (
    <div className="navbar">
      {/* LEFT */}
      <div className="nav-left">
        <h2 className="logo" onClick={() => navigate("/")}>
          ChainPort
        </h2>
      </div>

      {/* CENTER */}
      <div className="nav-center">
        <NavLink to="/dashboard" className="nav-item">
          Dashboard
        </NavLink>

        <NavLink to="/mycontainers" className="nav-item">
          My Containers
        </NavLink>

        <NavLink to="/mint" className="nav-item">
          Mint 
        </NavLink>

        <NavLink to="/marketplace" className="nav-item">
          Marketplace
        </NavLink>

         <NavLink to="/sasapanalysis" className="nav-item">
          SASAP Analysis
        </NavLink>

        <NavLink to="/deployservice" className="nav-item">
          Deploy Service 
        </NavLink>

      </div>

      {/* RIGHT */}
      <div className="nav-right">
        {!wallet ? (
          /* ✅ CONNECT WALLET BUTTON (REPLACES LOGIN) */
          <button className="connect-wallet-btn" onClick={handleConnect}>
            Connect Wallet
          </button>
        ) : (
          <>
            <div
              className="wallet-status"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="status-dot connected"></span>
              {shortAddress}
            </div>

            <div className="user-menu" ref={menuRef}>
              <span
                className="avatar"
                onClick={() => setOpen((o) => !o)}
              >
                {wallet.charAt(2).toUpperCase()}
              </span>

              {open && (
                <div className="dropdown">
                  <p onClick={() => navigate("/profile")}>Profile</p>
                  <p onClick={() => navigate("/settings")}>Settings</p>
                  <p onClick={logout}>Disconnect Wallet</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}