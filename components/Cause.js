import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { causeABI, crowdFunderABI, crowdFunderAddresses } from "../constants"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
import Header from "./Header"
const Cause = ({ id }) => {
    const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const crowdFunderAddress =
        chainId in crowdFunderAddresses ? crowdFunderAddresses[chainId][0] : null
    const [causeAddress, setCauseAddress] = useState("")
    const [amICauseOwner, setAmICauseOwner] = useState(false)
    const [donationAmount, setDonationAmount] = useState("")
    const [donationAmountG, setDonationAmountG] = useState("0")
    const [causeBalance, setCauseBalance] = useState("0")
    const [goal, setGoal] = useState("0")
    const [causeOwner, setCauseOwner] = useState("")
    const [isOpenToDonations, setIsOpenToDonations] = useState(false)
    const [isGoalReached, setIsGoalReached] = useState(false)
    const [isLocked, setIsLocked] = useState(false)
    const [isWithdrawn, setIsWithdrawn] = useState(false)
    const [error, setError] = useState("")

    const { runContractFunction: getCauseById } = useWeb3Contract({
        abi: crowdFunderABI,
        contractAddress: crowdFunderAddress,
        functionName: "getCauseById",
        params: { causeId: parseInt(id) },
    })
    const { runContractFunction: getCauseBalance } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "getCauseBalance",
        params: {},
    })
    const { runContractFunction: getGoal } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "getGoal",
        params: {},
    })
    const { runContractFunction: getCauseOwner } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "getCauseOwner",
        params: {},
    })
    const { runContractFunction: getIsOpenToDonations } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "getIsOpenToDonations",
        params: {},
    })
    const { runContractFunction: getIsWithdrawn } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "getIsWithdrawn",
        params: {},
    })
    const { runContractFunction: getIsLocked } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "getIsLocked",
        params: {},
    })
    const { runContractFunction: getIsGoalReached } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "getIsGoalReached",
        params: {},
    })

    const { runContractFunction: donate } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "donate",
        params: {},
        msgValue: donationAmount,
    })

    const insertCauseAddress = async () => {
        getCauseById()
            .then((res) => {
                setCauseAddress(res?.toString())
            })
            .then(() => {
                updateUI()
            })
    }

    const updateUI = async () => {
        const causeOwnerFromCall = await getCauseOwner()
        const causeBalanceFromCall = await getCauseBalance()
        const goalFromCall = await getGoal()
        const isOpenToDonationsFromCall = await getIsOpenToDonations()
        const isLockedFromCall = await getIsLocked()
        const isWithdrawnFromCall = await getIsWithdrawn()
        const isGoalReachedFromCall = await getIsGoalReached()
        setCauseOwner(causeOwnerFromCall?.toString())
        setCauseBalance(causeBalanceFromCall?.toString())
        setGoal(goalFromCall?.toString())
        setIsOpenToDonations(isOpenToDonationsFromCall?.toString())
        setIsWithdrawn(isWithdrawnFromCall)
        setIsGoalReached(isGoalReachedFromCall)
        setIsLocked(isLockedFromCall)
        if (account == causeOwner) {
            setAmICauseOwner(true)
        } else {
            setAmICauseOwner(false)
        }
    }

    const handleDonate = async () => {}

    useEffect(() => {
        insertCauseAddress()
    }, [isWeb3Enabled])

    return (
        <div>
            <Header />
            <div>
                <h1>CAUSE ID: {id}</h1>
                <h2>CAUSE ADDRESS: {causeAddress}</h2>
                <h2>OWNED BY: {causeOwner}</h2>
                <h3>
                    DONATIONS: {causeBalance}/{goal}
                </h3>
            </div>
            <input
                type="number"
                placeholder="Donation amount in ETH"
                value={donationAmount}
                onChange={(e) => {
                    setDonationAmount(e.target.value)
                }}
            ></input>
            ETH
            <p>{donationAmount}</p>
            <button onClick={handleDonate} disabled={isWithdrawn || isLocked || isGoalReached}>
                DONATE
            </button>
            <div>{isWeb3Enabled ? <div>Web3 is enabled</div> : <div>Web3 is not enabled</div>}</div>
        </div>
    )
}

export default Cause
