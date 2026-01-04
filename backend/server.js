console.log("🔥 STARTING CHAINPORT SERVER 🔥");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const deployEngine = require("./deployengine");
const deploymentExplain = require("./ai/deploymentExplain");

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // Essential for reading req.body

// --- ROUTE: AI & PLACEMENT ---
app.post("/ai/deployment-explain", async (req, res) => {
  try {
    const { trustScore } = req.body;

    if (trustScore === undefined) {
      return res.status(400).json({ error: "trustScore is required" });
    }

    // Run Engine
    const placement = deployEngine({ trustScore: Number(trustScore) });

    // Run AI (with internal fallback to prevent 500)
    const result = await deploymentExplain({ trustScore, ...placement });

    res.json({
      placement,
      explanation: result.explanation
    });
  } catch (err) {
    console.error("🔥 Critical Server Error:", err);
    res.status(500).json({ error: "Server could not process request." });
  }
});

const PORT = 5005;
app.listen(PORT, () => console.log(`🚀 Server active on http://localhost:${PORT}`));