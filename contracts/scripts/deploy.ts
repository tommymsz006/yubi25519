import { ethers } from "hardhat";

import 'dotenv/config';

async function main() {
  console.log(`Contract EntryPoint is located at ${process.env.ETHEREUM_GOERLI_ENTRY_POINT}.`);
  console.log(`Library Ed25519 is located at ${process.env.ETHEREUM_GOERLI_ED25519}.`);

  if (process.env.ETHEREUM_GOERLI_ENTRY_POINT && process.env.ETHEREUM_GOERLI_ED25519) {
    //const iEntryPoint = await ethers.getContractAt("IEntryPoint", process.env.ETHEREUM_GOERLI_ENTRY_POINT || '');
    const Yubi25519AccountFactory = await ethers.getContractFactory("Yubi25519AccountFactory", { libraries: { Ed25519: process.env.ETHEREUM_GOERLI_ED25519} });
    const factory = await Yubi25519AccountFactory.deploy(process.env.ETHEREUM_GOERLI_ENTRY_POINT);
    await factory.deployed();
    console.log(`Yubi25519AccountFactory is deployed at ${factory.address}.`);
  } else {
    console.error('Unable to locate EntryPoint and/or Ed25519');
  }
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
