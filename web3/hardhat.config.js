require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: 'sepolia',
  networks: {
    hardhat: {},
    sepolia: {
      url: 'https://rpc.ankr.com/eth_sepolia/f2b7f90dfb29cd67b15aeb6fe96a044ef39b064d9dbd7e69fbc613dd5c6c9b7e',
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};
