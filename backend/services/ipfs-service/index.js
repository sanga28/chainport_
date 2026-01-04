require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // to parse JSON body

// Health check route (optional)
app.get("/", (req, res) => {
  res.send("IPFS Metadata Service is running ✅");
});

// MAIN ROUTE: upload metadata to IPFS via Pinata
app.post("/upload-metadata", async (req, res) => {
  try {
    const {
      containerName,
      version,
      imageHash,
      description,
      owner,
    } = req.body;

    // Basic validation
    if (!containerName || !version) {
      return res.status(400).json({
        success: false,
        message: "containerName and version are required",
      });
    }

    // Build metadata object (you can add more fields if needed)
    const metadata = {
      containerName,
      version,
      imageHash,
      description,
      owner,
      createdAt: new Date().toISOString(),
    };

    // Call Pinata pinJSONToIPFS
    const pinataUrl = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

    const response = await axios.post(pinataUrl, metadata, {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
    });

    // Pinata returns an IpfsHash (CID)
    const cid = response.data.IpfsHash;

    return res.json({
      success: true,
      cid,
      metadataUri: `ipfs://${cid}`,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${cid}`,
    });
  } catch (error) {
    console.error("Error uploading to IPFS:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to upload metadata to IPFS",
      details: error.response?.data || error.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 IPFS Metadata Service running on http://localhost:${PORT}`);
});
