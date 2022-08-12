import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { causeABI, crowdFunderABI, crowdFunderAddresses } from "../constants"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
import { convertweiToEth, convertEthToWei } from "../utils/converter"
import Header from "./Header"
const Cause = ({ id }) => {
    const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const crowdFunderAddress =
        chainId in crowdFunderAddresses ? crowdFunderAddresses[chainId][0] : null
    const dispatch = useNotification()
    const [causeAddress, setCauseAddress] = useState("")
    const [causeName, setCauseName] = useState("")
    const [amICauseOwner, setAmICauseOwner] = useState(false)
    const [donationAmount, setDonationAmount] = useState("")
    const [donationAmountG, setDonationAmountG] = useState("0")
    const [causeBalance, setCauseBalance] = useState("0")
    const [goal, setGoal] = useState("0")
    const [causeOwner, setCauseOwner] = useState("")
    const [isOpenToDonations, setIsOpenToDonations] = useState(false)
    const [myDonations, setMyDonations] = useState("0")
    const [isGoalReached, setIsGoalReached] = useState(false)
    const [isLocked, setIsLocked] = useState(false)
    const [isWithdrawn, setIsWithdrawn] = useState(false)
    const [crowdFunderOwner, setCrowdFunderOwner] = useState("")
    const [amICrowdFunderOwner, setAmICrowdFunderOwner] = useState(false)
    const [error, setError] = useState("")

    const { runContractFunction: getCauseById } = useWeb3Contract({
        abi: crowdFunderABI,
        contractAddress: crowdFunderAddress,
        functionName: "getCauseById",
        params: { causeId: parseInt(id) },
    })
    const { runContractFunction: getCrowdFunderOwner } = useWeb3Contract({
        abi: crowdFunderABI,
        contractAddress: crowdFunderAddress,
        functionName: "getContractOwner",
        params: {},
    })
    const { runContractFunction: getCauseName } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "getCauseName",
        params: {},
    })
    const { runContractFunction: getCauseBalance } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "getCauseBalance",
        params: {},
    })
    const { runContractFunction: getMyDonation } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "getMyDonation",
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

    const {
        runContractFunction: donate,
        isFetching,
        isLoading,
    } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "donate",
        params: {},
        msgValue: donationAmountG,
    })

    const updateUI = async () => {
        const causeBalanceFromCall = await getCauseBalance()
        const causeNameFromCall = await getCauseName()
        const goalFromCall = await getGoal()
        const isOpenToDonationsFromCall = await getIsOpenToDonations()
        const isLockedFromCall = await getIsLocked()
        const isWithdrawnFromCall = await getIsWithdrawn()
        const isGoalReachedFromCall = await getIsGoalReached()
        const myDonationFromCall = await getMyDonation()
        setCauseBalance(causeBalanceFromCall?.toString())
        setCauseName(causeNameFromCall?.toString())
        setGoal(goalFromCall?.toString())
        setIsOpenToDonations(isOpenToDonationsFromCall?.toString())
        setIsWithdrawn(isWithdrawnFromCall)
        setIsGoalReached(isGoalReachedFromCall)
        setIsLocked(isLockedFromCall)
        setMyDonations(myDonationFromCall?.toString())
    }

    const handleDonate = async () => {
        donate({
            onSuccess: async () => {
                dispatch({
                    title: "Donation Successful",
                    position: "topR",
                    icon: "bell",
                    message: `You successfully donated ${donationAmount} eth`,
                })
                
            },
            onError: () => {
                dispatch({
                    title: "Donation Failed",
                    position: "topR",
                    icon: "bell",
                    message: `There was an error processing your donation`,
                })
            },
        })
    }
    const handleWithdraw = async () => {}

    useEffect(() => {
        if (isWeb3Enabled) {
            getCrowdFunderOwner()
                .then((res) => {
                    setCrowdFunderOwner(res?.toString())
                })
                .then(() => {
                    getCauseById().then((res) => {
                        setCauseAddress(res?.toString())
                    })
                })
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        if (isWeb3Enabled && causeAddress) {
            getCauseOwner()
                .then((res) => {
                    setCauseOwner(res?.toString())
                })
                .then((res) => {
                    updateUI()
                })
        }
    }, [isWeb3Enabled, causeAddress])

    useEffect(() => {
        if (isWeb3Enabled && causeOwner) {
            if (account?.toLowerCase() == causeOwner?.toLowerCase()) {
                setAmICauseOwner(true)
            } else {
                setAmICauseOwner(false)
            }
        }
    }, [isWeb3Enabled, causeOwner, account])
    useEffect(() => {
        if (isWeb3Enabled && crowdFunderOwner) {
            if (account?.toLowerCase() == crowdFunderOwner?.toLowerCase()) {
                setAmICrowdFunderOwner(true)
            } else {
                setAmICrowdFunderOwner(false)
            }
        }
    }, [isWeb3Enabled, crowdFunderOwner, account])
    useEffect(() => {
        if (isWeb3Enabled) {
            setDonationAmountG(convertEthToWei(donationAmount))
        }
    }, [isWeb3Enabled, donationAmount])


    return (
        <div>
            <Header />
            <div>
                <h1>CAUSE NAME: {causeName}</h1>
                <h2>CAUSE ID: {id}</h2>
                <h2>CAUSE ADDRESS: {causeAddress}</h2>
                <h2>OWNED BY: {causeOwner}</h2>
                <h3>
                    DONATIONS: {convertweiToEth(causeBalance)}/{convertweiToEth(goal)}ETH
                </h3>
            </div>

            <div>
                {!amICauseOwner && (
                    <div>
                        {" "}
                        <input
                            type="number"
                            placeholder="Donation amount in ETH"
                            value={donationAmount}
                            onChange={(e) => {
                                setDonationAmount(e.target.value)
                            }}
                        ></input>
                        ETH
                        <p>{donationAmount}</p>{" "}
                        <button
                            onClick={handleDonate}
                            disabled={
                                isWithdrawn || isLocked || isGoalReached || isFetching || isLoading
                            }
                        >
                            DONATE
                        </button>
                    </div>
                )}
            </div>
            <div>
                {amICauseOwner ? <div>I am Cause owner</div> : <div>I am not cause owner</div>}
            </div>
            {!amICauseOwner && (
                <div>You have donated {convertweiToEth(myDonations)} to this cause</div>
            )}
            {isWithdrawn &&
                (amICauseOwner ? (
                    <div>
                        You have withdrawn the donations to this cause to your wallet with address
                        {causeOwner}
                    </div>
                ) : (
                    <div>
                        The owner of this cause has withdrawn the donations to his wallet{" "}
                        {causeOwner}
                    </div>
                ))}

            {amICauseOwner && <button onClick={handleWithdraw}>WITHDRAW</button>}
            {amICrowdFunderOwner && <div>I am CrowdFunder Owner</div>}
        </div>
    )
}

export default Cause
