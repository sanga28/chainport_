// backend/services/blockchain.js
const { ethers } = require("ethers");
const ChainPortArtifact = require("./ChainPort.json"); // ABI file you copied

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const chainPort = new ethers.Contract(
  process.env.CHAINPORT_ADDRESS,
  ChainPortArtifact.abi,
  wallet
);

module.exports = { provider, wallet, chainPort };
