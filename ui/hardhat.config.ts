// import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-deploy';
import '@typechain/hardhat';
import { HardhatUserConfig } from 'hardhat/types';
import * as fs from 'fs';
import '@nomiclabs/hardhat-etherscan';

import 'dotenv/config';

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  typechain: {
    outDir: 'src/pages/Account/account-api/typechain-types',
  },
  networks: {
    'ethereum-goerli': {
      url: process.env.ETHEREUM_GOERLI_URL || "",
      from: process.env.TESTNET_ACCOUNT || "",
      accounts: process.env.TESTNET_PRIVATE_KEY !== undefined ? [process.env.TESTNET_PRIVATE_KEY] : [],
      allowUnlimitedContractSize: true
    },
    'ethereum-sepolia': {
      url: process.env.ETHEREUM_SEPOLIA_URL || "",
      from: process.env.TESTNET_ACCOUNT || "",
      accounts: process.env.TESTNET_PRIVATE_KEY !== undefined ? [process.env.TESTNET_PRIVATE_KEY] : [],
      allowUnlimitedContractSize: true
    },
  },
};

export default config;
