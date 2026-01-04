const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BehaviorDrift", function () {
  let drift;

  beforeEach(async () => {
    const Drift = await ethers.getContractFactory("BehaviorDrift");
    drift = await Drift.deploy();
  });

  it("records drift immutably", async () => {
    await drift.recordDrift(
      1,
      "ipfs://oldCID",
      "ipfs://newCID"
    );

    const record = await drift.drifts(1);
    expect(record.oldBehaviorCID).to.equal("ipfs://oldCID");
    expect(record.newBehaviorCID).to.equal("ipfs://newCID");
  });
});
