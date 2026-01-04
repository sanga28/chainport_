require("dotenv").config();
const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  // 1️⃣ Read metadata
  const metadata = JSON.parse(
    fs.readFileSync("../container/payment-service/src/container-metadata.json")
  );

  const metadataCID = process.env.METADATA_CID;

  if (!metadataCID) {
    throw new Error("Missing METADATA_CID");
  }

  // 2️⃣ Get signer
  const [deployer] = await ethers.getSigners();
  console.log("Registering from:", deployer.address);

  // 3️⃣ Get deployed contract
  const registry = await ethers.getContractAt(
    "ContainerRegistry",
    process.env.CONTAINER_REGISTRY_ADDRESS
  );

  // 4️⃣ Call mintContainer (IMPORTANT: send mint fee)
  const tx = await registry.mintContainer(
    metadataCID,
    0, // parentVersion = 0 (original container)
    {
      value: ethers.parseEther("0.001")
    }
  );

  console.log("⏳ Tx sent:", tx.hash);
  const receipt = await tx.wait();

  console.log("✅ Container minted on ChainPort");
}

main().catch(console.error);
