let causeABI = require("./causeabi.json")
let crowdFunderABI = require("./crowdfunderabi.json")
let crowdFunderAddresses = require("./crowdfunderAddresses.json")
let chains = require("./chains.json")

crowdFunderABI = crowdFunderABI.abi
causeABI = causeABI.abi
chains = chains.chains
const supportedChains = chains.filter((chain) => {
    if (crowdFunderAddresses[chain.chainId]) {
        return chain
    }
})
const nullAddress = "0x0000000000000000000000000000000000000000"
module.exports = { crowdFunderABI, causeABI, crowdFunderAddresses, nullAddress, chains, supportedChains }
