const { ethers } = require("ethers");
const { OracleABI } = require("./OracleABI");
const provider = new ethers.providers.JsonRpcProvider("http://localhost:7545");
const signer = provider.getSigner();

const updateOracleContract = async (payload) => {
  const contractUser = await signer.getAddress();
  const contractUserBalance = await provider.getBalance(contractUser);
  const amount = ethers.utils.formatEther(contractUserBalance);

  const Oracle = new ethers.Contract("Oracle", OracleABI, signer);
  const oracle = await Oracle.attach(
    "0xbFf39f031A475c30083CA87571DB7C481663cF24"
  );

  const { from, priceBinance, to } = payload;

  const price = ethers.utils.parseEther(priceBinance);
  const tx = await oracle.connect(signer).addAssets(from, to, price, 18);
  const rc = await tx.wait(1);

  console.log(rc);
  console.log(amount);
};

const getContract = async () => {
  const Oracle = new ethers.Contract("Oracle", OracleABI, signer);
  const oracle = await Oracle.attach(
    "0x1AcbF1bBc3aCa98217C02DaC2Fe99e81097b5aAd"
  );

  return oracle;
};

module.exports = {
  updateOracleContract,
  getContract,
};
