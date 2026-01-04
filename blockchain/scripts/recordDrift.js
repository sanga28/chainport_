const hre = require("hardhat");

async function main() {
  const drift = await hre.ethers.getContractAt(
    "BehaviorDrift",
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
  );

  await drift.recordDrift(
    1,
    "ipfs://oldCID",
    "ipfs://newCID"
  );

  console.log("⚠ Drift recorded");
}

main().catch(console.error);
