import { ethers, network } from "hardhat";

import 'dotenv/config';

async function main() {

  const entryPointAddress = process.env[`${network.name.toUpperCase().replace('-', '_')}_ENTRY_POINT`];
  console.log(`Contract EntryPoint is located at ${entryPointAddress} on network ${network.name}.`);

  if (entryPointAddress) {
    //const iEntryPoint = await ethers.getContractAt("IEntryPoint", process.env.ETHEREUM_GOERLI_ENTRY_POINT || '');
    const Yubi25519AccountFactory = await ethers.getContractFactory("Yubi25519AccountFactory");//, { libraries: { Ed25519: ed25519Address} });
    const factory = await Yubi25519AccountFactory.deploy(entryPointAddress);
    await factory.deployed();
    console.log(`Yubi25519AccountFactory is deployed at ${factory.address} on network ${network.name}.`);
    /*
    const Yubi25519Account = await ethers.getContractFactory("Yubi25519Account");
    const account = await Yubi25519Account.deploy(entryPointAddress);
    await account.deployed();
    console.log(`Yubi25519Account is deployed at ${account.address} on network ${network.name}.`);

    const TestEd25519 = await ethers.getContractFactory("TestEd25519");
    const test = await TestEd25519.deploy();
    await test.deployed();
    console.log(`TestEd25519 is deployed at ${test.address} on network ${network.name}.`);
    */
  } else {
    console.error('Unable to locate contract EntryPoint');
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
