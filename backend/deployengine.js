/**
 * Secure Deployment Placement Engine
 * Deterministic, security-first
 */

module.exports = function deployEngine({ trustScore }) {
  if (trustScore >= 75) {
    return {
      environment: "Public Secure Node",
      network: "Public",
      isolation: 6,
      risk: "Low",
    };
  }

  if (trustScore >= 50) {
    return {
      environment: "Private Secure Node",
      network: "Private",
      isolation: 8,
      risk: "Medium",
    };
  }

  return {
    environment: "Isolated Quarantine Node",
    network: "Private",
    isolation: 10,
    risk: "High",
  };
};
