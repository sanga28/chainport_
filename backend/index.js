/**
 * ChainPort Backend - Main Server (Monolith)
 * - IPFS Metadata
 * - Deep Metrics
 * - Trust / Auth Routes
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

/* =========================
   GLOBAL MIDDLEWARES
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("🚀 ChainPort Backend is running successfully");
});

/* =========================
   ROUTES
========================= */
app.use("/api/ipfs", require("./routes/ipfs.routes"));
app.use("/api/deep-metrics", require("./routes/routes-deepMetrics.routes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/trust", require("./routes/trustRoutes"));

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ ChainPort Backend running on http://localhost:${PORT}`);
});
