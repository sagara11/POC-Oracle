const axios = require("axios").default;

const getPriceBinance = async (payload) => {
  try {
    const response = await axios.get(
      `https://api.binance.com/api/v3/ticker/price?symbol=${payload}`
    );
    const { data } = response;
    return data.price;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getPriceBinance: getPriceBinance,
};
