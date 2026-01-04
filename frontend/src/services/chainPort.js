import { ethers } from "ethers";
import ContainerRegistryArtifact from "../contracts/ContainerRegistry.json";
import deployed from "../contracts/ContainerRegistry-address.json";

/**
 * DIRECT HARDHAT RPC (NO METAMASK)
 * For local development/demo only.
 */

const RPC_URL = "http://127.0.0.1:8545";

// ⚠️ PRIVATE KEY OF HARDHAT ACCOUNT #0
// This is public and for local dev only, never use like this on real networks.
const HARDHAT_PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(HARDHAT_PRIVATE_KEY, provider);

function getContractAddress() {
  const addr =
    deployed?.address ||
    deployed?.contractAddress ||
    deployed?.Address ||
    null;

  if (!addr) {
    console.error("❌ ContainerRegistry contract address missing:", deployed);
    throw new Error("ContainerRegistry address not configured correctly");
  }

  return addr;
}

function getContract() {
  const address = getContractAddress();
  console.log("Using ContainerRegistry at:", address);
  console.log("Using signer:", signer.address);

  return new ethers.Contract(
    address,
    ContainerRegistryArtifact.abi,
    signer
  );
}

/**
 * Solidity: mintContainer(address to, string memory ipfsCID)
 * JS:       mintContainerNFT(cid)
 */
export async function mintContainerNFT(cid) {
  if (!cid) throw new Error("CID is required");

  const contract = getContract();
  const to = signer.address; // Hardhat account #0

  console.log("Calling mintContainer with:", { to, cid });

  const tx = await contract.mintContainer(to, cid);
  return tx.wait();
}
