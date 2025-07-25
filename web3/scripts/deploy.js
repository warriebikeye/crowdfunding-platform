const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Crowdfund = await ethers.getContractFactory("CrowdFunding");
  const crowdfund = await Crowdfund.deploy(); // Already deployed

  console.log("Crowdfund contract deployed to:", crowdfund.target); // Ethers v6 uses `target`
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
