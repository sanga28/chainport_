// backend/controllers/statsController.js
const { chainPort } = require("../services/blockchain");

exports.getStats = async (req, res) => {
  try {
    const total = await chainPort.totalContainers();   // or any public view function you have
    res.json({ total: Number(total) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read from blockchain" });
  }
};
