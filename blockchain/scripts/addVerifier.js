const hre = require("hardhat");

async function main() {
  const [owner] = await hre.ethers.getSigners();

  const vr = await hre.ethers.getContractAt(
    "VerifierRegistry",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );

  await vr.addVerifier(owner.address);
  console.log("✅ Verifier added:", owner.address);
}

main().catch(console.error);
