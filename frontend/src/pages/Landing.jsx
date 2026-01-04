import "../styles/landing.css";
import heroImg from "../assets/hero-chainport.jpeg";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

export default function Landing() {
  const navigate = useNavigate();

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not detected. Please install MetaMask.");
        return;
      }

      // Request account access
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      const address = accounts[0];

      // Save wallet (used later in dashboard)
      localStorage.setItem("wallet", address);

      console.log("Wallet connected:", address);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  return (
    <div className="landing-root">
      {/* Navbar */}
      <header className="landing-header">
        <div className="logo">ChainPort</div>

    
        <button className="wallet-btn" onClick={connectWallet}>
          Connect Wallet
        </button>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-left">
          <h1>
            Discover <br />
            Deploy & Monetize <br />
            <span>Decentralized Containers</span>
          </h1>

          <p>
            ChainPort is a Web3-native container registry that transforms containers
            into verifiable digital assets, enabling trustless deployment using
            blockchain and IPFS.
          </p>

          <div className="hero-actions">
            <button
              className="primary"
              onClick={() => navigate("/marketplace")}
            >Explore</button>
          </div>

          <div className="stats">
            <div>
              <strong>432K+</strong>
              <span>Registered Containers</span>
            </div>
            <div>
              <strong>200K+</strong>
              <span>Active Developers</span>
            </div>
            <div>
              <strong>10K+</strong>
              <span>On-chain Deployments</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="glass-card">
            <img src={heroImg} alt="ChainPort Visual" />
            <div className="card-meta">
              <div>
                <p>Total Gas</p>
                <h4>12.35 ETH</h4>
              </div>
              <div>
                <p>Version</p>
                <h4>v1.2.0</h4>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}