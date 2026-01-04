import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { uploadContainerMetadata } from "../services/ipfs";

import ContainerDNA from "../components/ContainerDNA";
import DNACompare from "../components/DNACompare";

/* ERC-721 Container Registry */
import ContainerRegistry from "../contracts/ContainerRegistry.json";

export default function Mint() {
  const navigate = useNavigate();

  /* ================= FORM STATE ================= */
  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [imageHash, setImageHash] = useState("");
  const [description, setDescription] = useState("");
  const [parentVersion, setParentVersion] = useState(0);

  /* ================= DNA ================= */
  const [preMintDNA, setPreMintDNA] = useState(null);
  const [postMintDNA, setPostMintDNA] = useState(null);

  /* ================= WALLET ================= */
  const [walletAddress, setWalletAddress] = useState("");

  /* ================= STATUS ================= */
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState("idle");

  /* ================= RESULT ================= */
  const [tokenId, setTokenId] = useState(null);
  const [signature, setSignature] = useState("");

  /* ================= OWNERSHIP ================= */
  const [similarityScore, setSimilarityScore] = useState(null);
  const [ownershipModel, setOwnershipModel] = useState(null);

  /* ================= LOAD WALLET ================= */
  useEffect(() => {
    const saved = localStorage.getItem("wallet");
    if (saved) setWalletAddress(saved);
  }, []);

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    if (!walletAddress) {
      setMessage("Wallet connection required to register a container.");
      return false;
    }

    if (!name || !version || !imageHash) {
      setMessage("Container name, version, and image digest are mandatory.");
      return false;
    }

    if (!imageHash.startsWith("sha256:")) {
      setMessage("Image digest must be a valid SHA-256 identifier.");
      return false;
    }

    return true;
  };

  /* ================= OWNERSHIP DERIVATION ================= */
  const deriveOwnership = (similarity) => {
    if (similarity <= 0.3) {
      return {
        type: "ORIGINAL",
        label: "Original Work",
        creatorShare: 100,
        parentShare: 0,
      };
    }

    if (similarity > 0.3 && similarity <= 0.7) {
      return {
        type: "DERIVED",
        label: "Derived Work",
        creatorShare: 60,
        parentShare: 40,
      };
    }

    return {
      type: "SHARED",
      label: "Shared Ownership",
      creatorShare: 50,
      parentShare: 50,
    };
  };

  /* ================= AUTHORIZE ================= */
  const authorizeRegistration = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const payload = `Authorize container registration: ${name}:${version}`;
    const sig = await signer.signMessage(payload);
    setSignature(sig);
    return sig;
  };

  /* ================= MINT ================= */
  const handleMint = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setMessage("");
      setTokenId(null);

      /* ---------- DETERMINISTIC SIMILARITY ---------- */
      const similarity =
        parentVersion > 0 ? 0.45 : 0.15; // deterministic placeholder

      const ownership = deriveOwnership(similarity);

      setSimilarityScore(similarity);
      setOwnershipModel(ownership);

      /* ---------- PRE-MINT DNA ---------- */
      const dnaSnapshot = {
        containerName: name,
        version,
        imageHash,
        description,
        parentVersion,
        trustScore: 0.6,
        similarityScore: similarity,
        ownershipModel: ownership,
      };
      setPreMintDNA(dnaSnapshot);

      /* ---------- AUTH ---------- */
      setStep("authorization");
      setMessage("Authorizing registration request...");
      await authorizeRegistration();

      /* ---------- METADATA ---------- */
      setStep("metadata");
      setMessage("Persisting container metadata...");

      // 🔒 EXPLICIT METADATA (NO SPREAD, NO SHAPE BUGS)
      const metadata = {
        containerName: name,
        version,
        imageHash,
        description,
        parentVersion,

        similarityScore: similarity,
        ownershipModel: {
          type: ownership.type,
          label: ownership.label,
          creatorShare: ownership.creatorShare,
          parentShare: ownership.parentShare,
        },

        trustScore: 0.6,
        owner: walletAddress,
        signature,
        createdAt: new Date().toISOString(),
      };

      const ipfsResult = await uploadContainerMetadata(metadata);
      if (!ipfsResult?.cid) {
        throw new Error("Metadata persistence failed.");
      }

      const cid = ipfsResult.cid;

      /* ---------- ON-CHAIN ---------- */
      setStep("registration");
      setMessage("Registering container in registry...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      if (network.chainId !== 31337n) {
        throw new Error("Connected network is not supported.");
      }

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        ContainerRegistry.address,
        ContainerRegistry.abi,
        signer
      );

      const tx = await contract.mintContainer(cid, parentVersion, {
        value: ethers.parseEther("0.001"),
      });

      const receipt = await tx.wait();
      const TRANSFER_TOPIC = ethers.id("Transfer(address,address,uint256)");
      const transferLog = receipt.logs.find(
        (log) =>
          log.address.toLowerCase() ===
            ContainerRegistry.address.toLowerCase() &&
          log.topics[0] === TRANSFER_TOPIC
      );

      if (!transferLog) {
        throw new Error("Registration confirmation not detected.");
      }

      const mintedTokenId = Number(
        ethers.toBigInt(transferLog.topics[3])
      );

      setTokenId(mintedTokenId);
      setStep("completed");
      setMessage(
        `Container registered successfully. Registry ID: ${mintedTokenId}`
      );

      /* ---------- POST-MINT DNA ---------- */
      setPostMintDNA({
        ...dnaSnapshot,
        trustScore: 0.7,
      });

      setTimeout(() => navigate("/marketplace"), 3500);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Container registration failed.");
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="page-container">
      <h1>Container Registry</h1>
      <p style={{ opacity: 0.75 }}>
        Register a container image with immutable identity and visual DNA.
      </p>

      <div className="card" style={{ marginBottom: 24 }}>
        <b>Registration Process</b>
        <ol style={{ marginTop: 10 }}>
          <li>Request authorization</li>
          <li>Persist metadata</li>
          <li>Register container</li>
          <li>DNA locked on-chain</li>
        </ol>
        {step !== "idle" && (
          <p style={{ marginTop: 8, opacity: 0.8 }}>
            Current status: <b>{step}</b>
          </p>
        )}
      </div>

      <div className="card">
        <h3>Container Details</h3>

        <input placeholder="Container name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Version (e.g. 1.0.0)" value={version} onChange={(e) => setVersion(e.target.value)} />
        <input placeholder="Image digest (sha256:...)" value={imageHash} onChange={(e) => setImageHash(e.target.value)} />
        <input type="number" placeholder="Parent registry ID (optional)" value={parentVersion} onChange={(e) => setParentVersion(Number(e.target.value))} />
        <input placeholder="Optional description" value={description} onChange={(e) => setDescription(e.target.value)} />

        <div style={{ marginTop: 30 }}>
          <h3>🧬 Live Container DNA</h3>
          <ContainerDNA metadata={{ containerName: name, version, imageHash, description, parentVersion, trustScore: 0.6 }} />
        </div>

        {similarityScore !== null && ownershipModel && (
          <div className="card" style={{ marginTop: 30 }}>
            <h3>📊 Ownership Analysis</h3>
            <p><b>Similarity:</b> {(similarityScore * 100).toFixed(2)}%</p>
            <p><b>Type:</b> {ownershipModel.label}</p>
            <ul>
              <li>Creator Share: {ownershipModel.creatorShare}%</li>
              <li>Parent Share: {ownershipModel.parentShare}%</li>
            </ul>
          </div>
        )}

        <button onClick={handleMint} disabled={loading} style={{ marginTop: 20 }}>
          {loading ? "Registering…" : "Register Container"}
        </button>

        {message && <p style={{ marginTop: 12 }}>{message}</p>}
        {tokenId !== null && <p><b>Registry ID:</b> {tokenId}</p>}
      </div>

      {preMintDNA && postMintDNA && (
        <div className="card" style={{ marginTop: 40 }}>
          <h3>🧬 DNA Mutation After Mint</h3>
          <DNACompare before={preMintDNA} after={postMintDNA} />
        </div>
      )}
    </div>
  );
}
