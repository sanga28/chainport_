export default function Settings() {
  return (
    <div className="page-container">
      <h1>Settings</h1>

      <div className="card">
        <h3>Application Preferences</h3>

        <div style={{ marginTop: "10px" }}>
          <p>Theme</p>
          <select>
            <option>Dark</option>
            <option>Light</option>
          </select>
        </div>

        <div style={{ marginTop: "10px" }}>
          <p>Language</p>
          <select>
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div>

        <div style={{ marginTop: "15px" }}>
          <button>Save Settings</button>
        </div>
      </div>

      <div className="card" style={{ marginTop: "20px" }}>
        <h3>Security</h3>
        <button>Change Password</button>
        <button style={{ marginLeft: "10px" }}>Reset Wallet Session</button>
      </div>
    </div>
  );
}
