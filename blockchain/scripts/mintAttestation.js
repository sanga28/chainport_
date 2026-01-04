const hre = require("hardhat");

async function main() {
  const attestationAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // from deploy.js output

  const att = await hre.ethers.getContractAt(
    "BehaviorAttestation",
    attestationAddress
  );

  const tx = await att.mintAttestation(
    1, // containerId minted by Mint Engineer
    "ipfs://QmBehaviorLogCID"
  );

  await tx.wait();
  console.log("✅ Behavior attestation minted for container 1");
}

main().catch(console.error);
