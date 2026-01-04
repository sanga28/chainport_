const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

/* ======================================================
   PATH HELPERS (ABSOLUTE & SAFE)
   ====================================================== */

// project root = ChainPort/
const ROOT = path.join(__dirname, "..", "..");

// frontend/src/contracts
const FRONTEND_CONTRACTS = path.join(
  ROOT,
  "frontend",
  "src",
  "contracts"
);

// backend/blockchain/abi
const BACKEND_ABI = path.join(
  ROOT,
  "backend",
  "blockchain",
  "abi"
);

/* ======================================================
   FILE HELPERS
   ====================================================== */

function readContract(name) {
  const filePath = path.join(FRONTEND_CONTRACTS, `${name}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `❌ ${name}.json not found at:\n${filePath}\nDeploy registry first.`
    );
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function saveContract(name, address, abi) {
  const data = JSON.stringify({ address, abi }, null, 2);

  const targets = [FRONTEND_CONTRACTS, BACKEND_ABI];

  for (const dir of targets) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(path.join(dir, `${name}.json`), data);
  }
}

/* ======================================================
   DEPLOY
   ====================================================== */

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying DeploymentManager with:", deployer.address);

  // ✅ Read ContainerRegistry (merged JSON)
  const registry = readContract("ContainerRegistry");

  const DeploymentManager = await ethers.getContractFactory("DeploymentManager");
  const manager = await DeploymentManager.deploy(registry.address);
  await manager.waitForDeployment();

  console.log("✅ DeploymentManager deployed at:", manager.target);

  saveContract(
    "DeploymentManager",
    manager.target,
    DeploymentManager.interface.formatJson()
  );

  console.log("📦 DeploymentManager JSON saved in BOTH locations");
}

/* ======================================================
   RUN
   ====================================================== */

main().catch((err) => {
  console.error("❌ Deployment failed:", err);
  process.exit(1);
});
