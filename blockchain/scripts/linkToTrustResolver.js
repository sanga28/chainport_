const hre = require("hardhat");

async function main() {
  const resolver = await hre.ethers.getContractAt(
    "TrustResolver",
    "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c"
  );

  // Link attestation
  await resolver.linkAttestation(1, 1);

  // (optional) link drift later
  // await resolver.linkDrift(1, 1);

  console.log("🔗 TrustResolver updated for container 1");
}

main().catch(console.error);
