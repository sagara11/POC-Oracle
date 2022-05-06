const hre = require("hardhat");
const ethers = hre.ethers;

const { deployLottery } = require("./deploy/deploy-lottery");
const {
  requestRandomness,
  fundLottery,
  givePermissionToLottery,
  deployGeneral,
  endLottery,
  resetLottery,
  startLottery,
} = require("./helpful-methods");

const { config } = require("../chainlink.config");
const chainId = hre.network.config.chainId;

const deployOracle = async () => {
  const Oracle = await ethers.getContractFactory("Oracle");
  const oracle = await Oracle.deploy();
  await oracle.deployed();

  console.log("Oracle deployed to:", oracle.address);
  return oracle.address;
};

async function main() {
  const [, addr1, addr2, addr3] = await ethers.getSigners();
  const keyHash = config[chainId].keyHash;

  // Deploy General
  const { vrfCoordinatorV2MockAddress, subIdCurrent } = await deployGeneral();
  // Deploy Lottery
  const oracleAddress = await deployOracle();
  const lottery = await deployLottery(
    subIdCurrent,
    vrfCoordinatorV2MockAddress,
    keyHash,
    oracleAddress
  );

  // Test connection with Oracle
  const result = await lottery.testOracleConnection();
  console.log(`Test Connection ${result}`);

  // Mock assets value oracle
  // const oracle = await ethers.getContractAt("Oracle", oracleAddress);
  // const txOracle = await oracle.addAssets(
  //   "ETH",
  //   "USDT",
  //   ethers.utils.parseEther("2777.11000000"),
  //   18
  // );
  // await txOracle.wait(1);
  // const minimumFee = (await lottery.getMinimumFee()).toString();
  // const minimumFeeFinal = parseFloat(minimumFee) / 100;
  // console.log(`The minimum fee is: ${minimumFeeFinal} ETH`);

  // Give permission to lottery to use service in Subscription Manager
  await givePermissionToLottery(
    vrfCoordinatorV2MockAddress,
    subIdCurrent,
    lottery
  );
  // Start the Lottery
  await startLottery(lottery);

  // 3 Participants take part in the lottery
  // await fundLottery(lottery, addr1, ethers.utils.parseEther("2"));
  // await fundLottery(lottery, addr2, ethers.utils.parseEther("2"));
  // await fundLottery(lottery, addr3, ethers.utils.parseEther("1"));
  // // Send request to get random number
  // await requestRandomness(lottery, vrfCoordinatorV2MockAddress);

  // // End Lottery - Reward the winner
  // await endLottery(lottery);

  // // Reset Lottery for new Lottery
  // await resetLottery(lottery);
}

main();
