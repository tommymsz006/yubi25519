import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import 'dotenv/config';

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "ethereum-goerli-testnet",
  networks: {
    'ethereum-goerli-testnet': {
      url: process.env.ETHEREUM_GOERLI_URL || "",
      from: process.env.TESTNET_ACCOUNT || "",
      accounts: process.env.TESTNET_PRIVATE_KEY !== undefined ? [process.env.TESTNET_PRIVATE_KEY] : [],
      allowUnlimitedContractSize: true
    },
  },
};

export default config;
