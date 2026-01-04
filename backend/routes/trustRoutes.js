const express = require("express");
const router = express.Router();

const {
  attestBehavior,
  recordDrift,
  linkAttestation,
  linkDrift,
  getTrustState
} = require("../controllers/trustController");

router.post("/attest", attestBehavior);
router.post("/drift", recordDrift);
router.post("/link-attestation", linkAttestation);
router.post("/link-drift", linkDrift);
router.get("/:id", getTrustState);

module.exports = router;
