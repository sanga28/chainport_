const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ContainerRegistry", function () {
  it("should deploy", async function () {

    const Registry = await ethers.getContractFactory("ContainerRegistry");
    const registry = await Registry.deploy();
    await registry.deployed();

    expect(await registry.address).to.not.equal(0);
  });
});
