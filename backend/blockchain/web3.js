const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Load contract addresses
const addresses = JSON.parse(
  fs.readFileSync(path.join(__dirname, "contracts-address.json"))
);

// Load ABIs
const BehaviorAttestationABI = require("./abi/BehaviorAttestation.json").abi;
const BehaviorDriftABI = require("./abi/BehaviorDrift.json").abi;
const TrustResolverABI = require("./abi/TrustResolver.json").abi;
const VerifierRegistryABI = require("./abi/VerifierRegistry.json").abi;

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// ⭐ Hardhat Account #0 Private Key — MUST include 0x
const signer = new ethers.Wallet(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  provider
);

module.exports = {
  provider,
  signer,

  behaviorAttestation: new ethers.Contract(
    addresses.BehaviorAttestation,
    BehaviorAttestationABI,
    signer
  ),

  behaviorDrift: new ethers.Contract(
    addresses.BehaviorDrift,
    BehaviorDriftABI,
    signer
  ),

  trustResolver: new ethers.Contract(
    addresses.TrustResolver,
    TrustResolverABI,
    signer
  ),

  verifierRegistry: new ethers.Contract(
    addresses.VerifierRegistry,
    VerifierRegistryABI,
    signer
  )
};
