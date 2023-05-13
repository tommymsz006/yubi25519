# Yubi25519 Hardhat Project

Create a .env file with the following lines (see also .env.example):

```shell
TESTNET_ACCOUNT='<test account public address>'
TESTNET_PRIVATE_KEY='<test account private key>'

ETHEREUM_GOERLI_URL='<goerli RPC address>'
ETHEREUM_GOERLI_ENTRY_POINT='<goerli AA entry point>'
ETHEREUM_GOERLI_ED25519='<library address for Ed25519 after running deploy-libraries.ts>'

ETHEREUM_SEPOLIA_URL='<sepolia RPC address>'
ETHEREUM_SEPOLIA_ENTRY_POINT='<sepolia AA entry point>'
ETHEREUM_SEPOLIA_ED25519='<library address for Ed25519 after running deploy-libraries.ts>'
```

To build the project, try the following.

```shell
# deploy the libraries
npx hardhat run scripts/deploy-libraries.ts --network <network>
# note the library address of Ed25519 deployed and update .env, then run the below to deploy the account factory contract
npx hardhat run scripts/deploy.ts --network <network>
```
