const express = require("express");
const router = express.Router();

const { compareContainers } = require("../deepMetrics/scoreEngine");

router.post("/compare", async (req, res) => {
  const { containerA, containerB } = req.body;

  if (!containerA || !containerB) {
    return res.status(400).json({
      success: false,
      message: "containerA and containerB are required",
    });
  }

  const result = await compareContainers(containerA, containerB);

  res.json(result);
});

module.exports = router;