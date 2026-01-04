const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ContainerRegistry", function () {
  let registry, owner;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    const Registry = await ethers.getContractFactory("ContainerRegistry");
    registry = await Registry.deploy();
  });

  it("mints container NFT correctly", async () => {
    await registry.mintContainer("ipfs://cid1", 0);

    expect(await registry.ownerOf(1)).to.equal(owner.address);
    const data = await registry.containerData(1);
    expect(data.metadataCID).to.equal("ipfs://cid1");
  });
});
