import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { causeABI, crowdFunderABI, crowdFunderAddresses } from "../constants"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
const Cause = ({ id }) => {
    const { isWeb3Enabled, account, chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const crowdFunderAddress =
        chainId in crowdFunderAddresses ? crowdFunderAddresses[chainId][0] : null
    const [causeAddress, setCauseAddress] = useState("")
    const [amICauseOwner, setAmICauseOwner] = useState(false)
    const [donationAmount, setDonationAmount] = useState("0")
    const [donationAmountG, setDonationAmountG] = useState("0")
    const { runContractFunction: getCauseById } = useWeb3Contract({
        abi: crowdFunderABI,
        contractAddress: crowdFunderAddress,
        functionName: "getCauseById",
        params: { causeId: id },
    })
    const { runContractFunction: getCauseBalance } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "getCauseBalance",
        params: {},
    })
    const { runContractFunction: getCauseOwner } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "getCauseByOwner",
        params: {},
    })
    const { runContractFunction: donate } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "donate",
        params: {},
        msgValue: donationAmount,
    })

    return (
        <div>
            Page for Cause with Cause ID {id}{" "}
            <input
                type="number"
                placeholder="Donation amount in ETH"
                value={donationAmount}
                onChange={(e) => {
                    setDonationAmount(e.target.value)
                }}
            ></input>
            <p>{donationAmount}</p>
            ETH <button>DONATE</button>
        </div>
    )
}

export default Cause
