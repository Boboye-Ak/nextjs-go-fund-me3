import { ethers } from "ethers"

const convertweiToEth = (wei) => {
    let result = Number(wei) / 1000000000000000000
    result = result.toFixed(2).toString()
    return result
}

const convertEthTowei = (eth) => {
    let result
    if (eth != "") {
        result = ethers.utils.parseEther(eth)
    } else {
        result = "0"
    }
    return result
}

module.exports = { convertweiToEth, convertEthTowei }
