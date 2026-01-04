import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const connectWallet = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      // ✅ Save token & user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("wallet", res.data.user.email);

      navigate("/dashboard");

    } catch (err) {
      setError("❌ Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">

      {/* LEFT BRAND PANEL */}
      <div className="login-left">
        <h1>ChainPort</h1>
        <p>Decentralized Container Orchestration Platform</p>
        <ul>    
          <li>✔ Secure Blockchain Infrastructure</li>
          <li>✔ Tokenized Container Registry</li>
          <li>✔ Real-Time Deployments</li>
          <li>✔ Trustless Ownership</li>
        </ul>
      </div>

      {/* RIGHT LOGIN PANEL */}
      <div className="login-right">

        <div className="login-box">
          <h2>Sign In</h2>

          <input 
            type="email" 
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button disabled={loading} onClick={connectWallet}>
            {loading ? "Signing In..." : "Login"}
          </button>

          {error && <p className="login-error">{error}</p>}

          <div className="login-divider">OR</div>

          <button className="secondary-btn" onClick={() => navigate("/signup")}>
            Create New Account
          </button>

          <p className="login-footer">
            By continuing you agree to our Terms & Privacy Policy
          </p>
        </div>

      </div>

    </div>
  );
}
