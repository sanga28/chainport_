const {
  behaviorAttestation,
  behaviorDrift,
  trustResolver,
  verifierRegistry
} = require("../blockchain/web3");


// ======================
// 1️⃣ RECORD ATTESTATION
// ======================
exports.attestBehavior = async (req, res) => {
  try {
    const { containerId, behaviorCID } = req.body;

    const tx = await behaviorAttestation.mintAttestation(
      containerId,
      behaviorCID
    );

    await tx.wait();

    res.json({
      status: "success",
      message: "Behavior Attestation Recorded",
      txHash: tx.hash
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};



// ======================
// 2️⃣ RECORD DRIFT
// ======================
exports.recordDrift = async (req, res) => {
  try {
    const { containerId, oldCID, newCID } = req.body;

    const tx = await behaviorDrift.recordDrift(
      containerId,
      oldCID,
      newCID
    );

    await tx.wait();

    res.json({
      status: "warning",
      message: "Behavior Drift Recorded",
      txHash: tx.hash
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};



// ======================
// 3️⃣ LINK ATTESTATION → TRUST
// ======================
exports.linkAttestation = async (req, res) => {
  try {
    const { containerId, attestationId } = req.body;

    const tx = await trustResolver.linkAttestation(
      containerId,
      attestationId
    );

    await tx.wait();

    res.json({
      status: "success",
      message: "Attestation Linked to TrustResolver",
      txHash: tx.hash
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};



// ======================
// 4️⃣ LINK DRIFT → TRUST
// ======================
exports.linkDrift = async (req, res) => {
  try {
    const { containerId, driftId } = req.body;

    const tx = await trustResolver.linkDrift(
      containerId,
      driftId
    );

    await tx.wait();

    res.json({
      status: "warning",
      message: "Drift Linked to TrustResolver",
      txHash: tx.hash
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};



// ======================
// 5️⃣ READ TRUST STATE
// ======================
exports.getTrustState = async (req, res) => {
  try {
    const { id } = req.params;

    const state = await trustResolver.getTrustState(id);

    const states = ["UNVERIFIED", "VERIFIED", "DRIFTED"];

    res.json({
      containerId: id,
      trustState: states[state]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};
