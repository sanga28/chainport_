const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BehaviorAttestation", function () {
  let attestation, verifierRegistry, owner;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();

    const VerifierRegistry = await ethers.getContractFactory("VerifierRegistry");
    verifierRegistry = await VerifierRegistry.deploy();

    // Add owner as verifier
    await verifierRegistry.addVerifier(owner.address);

    const Attestation = await ethers.getContractFactory("BehaviorAttestation");
    attestation = await Attestation.deploy(
      await verifierRegistry.getAddress()
    );
  });

  it("allows authorized verifier to mint attestation", async () => {
    await attestation.mintAttestation(1, "ipfs://behaviorCID");

    const record = await attestation.attestations(1);
    expect(record.containerId).to.equal(1);
    expect(record.behaviorCID).to.equal("ipfs://behaviorCID");
    expect(record.verifier).to.equal(owner.address);
  });

  it("rejects unauthorized verifier", async () => {
    const [, attacker] = await ethers.getSigners();

    await expect(
      attestation.connect(attacker).mintAttestation(1, "ipfs://badCID")
    ).to.be.revertedWith("Not an authorized verifier");
  });
});
