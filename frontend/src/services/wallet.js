import { ethers } from "ethers";

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask not found");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);

  // Request wallet connection
  const accounts = await provider.send("eth_requestAccounts", []);
  const address = accounts[0];

  // Save to localStorage (used by Mint page)
  localStorage.setItem("wallet", address);

  return {
    address,
    provider,
  };
}

export async function getConnectedWallet() {
  const address = localStorage.getItem("wallet");
  return address || null;
}
