const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();

  const registryAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

  const Registry = await hre.ethers.getContractFactory(
    "ContainerRegistry",
    signer
  );

  const registry = Registry.attach(registryAddress);

  const tx = await registry.mintContainer(
    "ipfs://QmContainerMetadataCID",
    0
  );

  await tx.wait();
  console.log("✅ Container NFT minted");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
