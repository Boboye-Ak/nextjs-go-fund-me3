let causeABI = require("./causeabi.json");
let crowdFunderABI = require("./crowdfunderabi.json");
let crowdFunderAddresses = require("./crowdfunderAddresses.json");

crowdFunderABI = crowdFunderABI.abi;
causeABI = causeABI.abi;
module.exports = { crowdFunderABI, causeABI, crowdFunderAddresses };
