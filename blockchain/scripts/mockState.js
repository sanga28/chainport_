const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  // 🔹 Use addresses from your deploy output
  const ATTEST_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const DRIFT_ADDRESS  = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  // Attach contracts (NO ENS involved)
  const AttestFactory = await ethers.getContractFactory("BehaviorAttestation");
  const attest = AttestFactory.attach(ATTEST_ADDRESS);

  const DriftFactory = await ethers.getContractFactory("BehaviorDrift");
  const drift = DriftFactory.attach(DRIFT_ADDRESS);

  // 🔹 MOCK DATA
  // containerId 0 assumed to exist (minted by teammate)
  await attest.mintAttestation(
    0,
    "QmMockBehaviorCID123"
  );

  await drift.recordDrift(
    0,
    "QmOldBehaviorCID",
    "QmNewBehaviorCID"
  );

  console.log("✅ Mock attestation and drift recorded");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
