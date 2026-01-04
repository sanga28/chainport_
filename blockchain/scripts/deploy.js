const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

/* ======================================================
   PATH SETUP (ABSOLUTE & CONSISTENT)
   ====================================================== */

// Project root: ChainPort/
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
   SAVE HELPER
   ====================================================== */

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
  const [deployer] = await hre.ethers.getSigners();
  console.log("🚀 Deploying with:", deployer.address);

  /* --------------------------------------------------
     1️⃣ ContainerRegistry (NEW & REQUIRED)
     -------------------------------------------------- */
  const ContainerRegistry = await hre.ethers.getContractFactory("ContainerRegistry");
  const containerRegistry = await ContainerRegistry.deploy();
  await containerRegistry.waitForDeployment();

  saveContract(
    "ContainerRegistry",
    containerRegistry.target,
    ContainerRegistry.interface.formatJson()
  );

  /* --------------------------------------------------
     2️⃣ VerifierRegistry
     -------------------------------------------------- */
  const VerifierRegistry = await hre.ethers.getContractFactory("VerifierRegistry");
  const verifierRegistry = await VerifierRegistry.deploy();
  await verifierRegistry.waitForDeployment();

  saveContract(
    "VerifierRegistry",
    verifierRegistry.target,
    VerifierRegistry.interface.formatJson()
  );

  /* --------------------------------------------------
     3️⃣ BehaviorAttestation (depends on VerifierRegistry)
     -------------------------------------------------- */
  const BehaviorAttestation = await hre.ethers.getContractFactory("BehaviorAttestation");
  const behaviorAttestation = await BehaviorAttestation.deploy(
    verifierRegistry.target
  );
  await behaviorAttestation.waitForDeployment();

  saveContract(
    "BehaviorAttestation",
    behaviorAttestation.target,
    BehaviorAttestation.interface.formatJson()
  );

  /* --------------------------------------------------
     4️⃣ BehaviorDrift
     -------------------------------------------------- */
  const BehaviorDrift = await hre.ethers.getContractFactory("BehaviorDrift");
  const behaviorDrift = await BehaviorDrift.deploy();
  await behaviorDrift.waitForDeployment();

  saveContract(
    "BehaviorDrift",
    behaviorDrift.target,
    BehaviorDrift.interface.formatJson()
  );

  /* --------------------------------------------------
     5️⃣ TrustResolver
     -------------------------------------------------- */
  const TrustResolver = await hre.ethers.getContractFactory("TrustResolver");
  const trustResolver = await TrustResolver.deploy();
  await trustResolver.waitForDeployment();

  saveContract(
    "TrustResolver",
    trustResolver.target,
    TrustResolver.interface.formatJson()
  );

  console.log("✅ ALL contracts deployed & JSONs saved in BOTH locations");
}

/* ======================================================
   RUN
   ====================================================== */

main().catch((err) => {
  console.error("❌ Deployment failed:", err);
  process.exit(1);
});
