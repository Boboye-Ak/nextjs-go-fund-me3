let causeABI = require("./causeabi.json");
let crowdFunderABI = require("./crowdfunderabi.json");
let crowdFunderAddresses = require("./crowdfunderAddresses.json");

crowdFunderABI = crowdFunderABI.abi;
causeABI = causeABI.abi;
const nullAddress="0x0000000000000000000000000000000000000000"
module.exports = { crowdFunderABI, causeABI, crowdFunderAddresses, nullAddress };
