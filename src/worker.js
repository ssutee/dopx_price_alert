require("dotenv").config();

const {
  BSC_RPC,
  KUSD_ADDRESS,
  SENDER_PRIVATE_KEY
} = process.env;

const { fromWei } = require("web3-utils");

const bluebird = require('bluebird');
const redis = require("redis");
bluebird.promisifyAll(redis.RedisClient.prototype);
const client = redis.createClient();

const axios = require('axios').default;

const Web3 = require("web3");
const web3 = new Web3(BSC_RPC);

web3.eth.accounts.wallet.add(SENDER_PRIVATE_KEY);
const sender = web3.eth.accounts.wallet[0];

const { abi: kusdABI } = require("./KUSD.json");
const kusd = new web3.eth.Contract(kusdABI, KUSD_ADDRESS);

const main = async () => {
  const requestURL = 'https://api.coingecko.com/api/v3/simple/token_price/binance-smart-chain?contract_addresses=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c%2C0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d&vs_currencies=usd'
  const response = await axios.get(requestURL);
  client.set("bnb-price", response.data['0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c']['usd'], redis.print);
  client.set("usdc-price", response.data['0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d']['usd'], redis.print);
  const kusdPrice = await kusd.methods.getSynthPrice().call({
    from: sender.address
  });
  client.set("kusd-price", fromWei(kusdPrice.toString()), redis.print);
}
setInterval(main, 30000); // every 30 seconds
