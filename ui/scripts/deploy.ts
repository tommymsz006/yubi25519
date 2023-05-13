import { ethers, network } from "hardhat";

import 'dotenv/config';

async function main() {

  const entryPointAddress = process.env[`${network.name.toUpperCase().replace('-', '_')}_ENTRY_POINT`];
  const ed25519Address = process.env[`${network.name.toUpperCase().replace('-', '_')}_ED25519`];

  console.log(`Contract EntryPoint is located at ${entryPointAddress} on network ${network.name}.`);
  console.log(`Library Ed25519 is located at ${ed25519Address} on network ${network.name}.`);

  if (entryPointAddress && ed25519Address) {
    //const iEntryPoint = await ethers.getContractAt("IEntryPoint", process.env.ETHEREUM_GOERLI_ENTRY_POINT || '');
    const Yubi25519AccountFactory = await ethers.getContractFactory("Yubi25519AccountFactory", { libraries: { Ed25519: ed25519Address} });
    const factory = await Yubi25519AccountFactory.deploy(entryPointAddress);
    await factory.deployed();
    console.log(`Yubi25519AccountFactory is deployed at ${factory.address} on network ${network.name}.`);
  } else {
    console.error('Unable to locate contract EntryPoint and/or library Ed25519');
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
