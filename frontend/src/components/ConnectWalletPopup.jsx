export default function ConnectWalletPopup({ onConnected }) {
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    localStorage.setItem("wallet", accounts[0]);
    onConnected(accounts[0]);
  };

  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>
        <h2>Connect MetaMask</h2>
        <p>You must connect your wallet to continue.</p>
        <button onClick={connectWallet}>Connect Wallet</button>
      </div>
    </div>
  );
}

/* inline styles to keep it dead simple */
const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const popupStyle = {
  background: "#111",
  color: "#fff",
  padding: "30px",
  borderRadius: "12px",
  textAlign: "center",
  width: "300px",
};