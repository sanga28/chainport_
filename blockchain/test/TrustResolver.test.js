const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TrustResolver", function () {
  let verifierRegistry, attestation, drift, resolver, owner;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();

    const VerifierRegistry = await ethers.getContractFactory("VerifierRegistry");
    verifierRegistry = await VerifierRegistry.deploy();
    await verifierRegistry.addVerifier(owner.address);

    const Attestation = await ethers.getContractFactory("BehaviorAttestation");
    attestation = await Attestation.deploy(
      await verifierRegistry.getAddress()
    );

    const Drift = await ethers.getContractFactory("BehaviorDrift");
    drift = await Drift.deploy();

    const Resolver = await ethers.getContractFactory("TrustResolver");
    resolver = await Resolver.deploy(
      await attestation.getAddress(),
      await drift.getAddress()
    );
  });

  it("returns VERIFIED when attestation exists", async () => {
    await attestation.mintAttestation(1, "ipfs://cid");

    const state = await resolver.getTrustState(1);
    expect(state).to.equal(1); // VERIFIED
  });

  it("returns DRIFTED when drift exists", async () => {
    await drift.recordDrift(
      1,
      "ipfs://old",
      "ipfs://new"
    );

    const state = await resolver.getTrustState(1);
    expect(state).to.equal(2); // DRIFTED
  });

  it("allows deployment only for VERIFIED containers", async () => {
    await attestation.mintAttestation(1, "ipfs://cid");
    expect(await resolver.canDeploy(1)).to.equal(true);
  });
});