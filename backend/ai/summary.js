function generateBehaviorSummary(report) {

  let summary = [];

  if(report.privileged)
      summary.push("⚠️ Runs with elevated privileges");
  else
      summary.push("🟢 Runs with normal privileges");

  if(report.ports && report.ports.length > 0)
      summary.push(`Opens ports: ${report.ports.join(", ")}`);

  if(report.networkCalls && report.networkCalls.length > 0)
      summary.push(`Makes outbound connections to: ${report.networkCalls.join(", ")}`);

  if(report.cpu === "high")
      summary.push("⚠️ High CPU usage detected");
  else
      summary.push("CPU usage normal");

  if(report.suspicious && report.suspicious.length > 0)
      summary.push(`⚠️ Suspicious activity: ${report.suspicious.join(", ")}`);
  else
      summary.push("No suspicious behavior detected");

  return {
    level: (report.suspicious?.length > 0 || report.privileged) ? "WARNING" : "SAFE",
    summary: summary.join(". ")
  };
}

module.exports = generateBehaviorSummary;