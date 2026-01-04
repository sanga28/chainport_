const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VerifierRegistry", function () {
  let registry, owner, verifier;

  beforeEach(async () => {
    [owner, verifier] = await ethers.getSigners();
    const Registry = await ethers.getContractFactory("VerifierRegistry");
    registry = await Registry.deploy();
  });

  it("allows owner to add verifier", async () => {
    await registry.addVerifier(verifier.address);
    expect(await registry.isVerifier(verifier.address)).to.equal(true);
  });

  it("allows owner to remove verifier", async () => {
    await registry.addVerifier(verifier.address);
    await registry.removeVerifier(verifier.address);
    expect(await registry.isVerifier(verifier.address)).to.equal(false);
  });

  it("blocks non-owner from managing verifiers", async () => {
    await expect(
      registry.connect(verifier).addVerifier(verifier.address)
    ).to.be.reverted;
  });
});
