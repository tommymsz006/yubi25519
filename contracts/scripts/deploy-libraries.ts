import { ethers } from "hardhat";

import 'dotenv/config';

async function main() {
  // libraries are deployed separately to ensure the bytecode is constrained
  // Reference: https://ethereum.org/en/developers/tutorials/downsizing-contracts-to-fight-the-contract-size-limit/
  console.log('Deploying Sha512...');
  const Sha512 = await ethers.getContractFactory("Sha512");
  const sha512Lib = await Sha512.deploy();
  await sha512Lib.deployed();
  console.log(`Library Sha512 is deployed at ${sha512Lib.address}.`);

  console.log('Deploying Ed25519...');
  const Ed25519 = await ethers.getContractFactory("Ed25519", {libraries: {Sha512: sha512Lib.address} });
  const ed25519Lib = await Ed25519.deploy();
  await ed25519Lib.deployed();
  console.log(`Library Ed25519 is deployed at ${ed25519Lib.address}.`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
