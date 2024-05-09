const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT contract", function () {
  it("Deployment should assign the owner to the signer", async function () {
    const [owner] = await ethers.getSigners();
    const fakeAddress = ethers.Wallet.createRandom(['21321']).address

    const nftContract = await ethers.deployContract("Connektvatar", [owner.address, fakeAddress, "ipfs://fakeurl/"]);

    expect(await nftContract.owner()).to.equal(owner.address);
  });
});