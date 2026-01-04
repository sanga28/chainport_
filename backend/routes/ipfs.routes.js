const express = require("express");
const axios = require("axios");

const router = express.Router();

// Upload metadata to IPFS via Pinata
router.post("/upload-metadata", async (req, res) => {
  try {
    const {
      containerName,
      version,
      imageHash,
      description,
      owner,
    } = req.body;

    if (!containerName || !version) {
      return res.status(400).json({
        success: false,
        message: "containerName and version are required",
      });
    }

    const metadata = {
      containerName,
      version,
      imageHash,
      description,
      owner,
      createdAt: new Date().toISOString(),
    };

    const pinataUrl = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

    const response = await axios.post(pinataUrl, metadata, {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
    });

    const cid = response.data.IpfsHash;

    return res.json({
      success: true,
      cid,
      metadataUri: `ipfs://${cid}`,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${cid}`,
    });

  } catch (error) {
    console.error("IPFS upload error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to upload metadata to IPFS",
    });
  }
});

module.exports = router;