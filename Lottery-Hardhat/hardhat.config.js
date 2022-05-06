require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@openzeppelin/hardhat-upgrades");

require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "develop",
  networks: {
    hardhat: {},
    develop: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
    },
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      chainId: 4,
      gas: 2100000,
      gasPrice: 8000000000,
      accounts: [
        process.env.PRIVATE_KEY_DEPLOYER,
        process.env.PRIVATE_KEY_USER_2,
        process.env.PRIVATE_KEY_USER_3,
        process.env.PRIVATE_KEY_USER_4,
      ],
    },
  },
  etherscan: {
    apiKey: {
      rinkeby: process.env.ETHERSCAN_API_KEY_RINKEBY,
    },
  },
  solidity: {
    version: "0.8.4",
    optimizer: {
      enabled: true,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000,
  },
};
