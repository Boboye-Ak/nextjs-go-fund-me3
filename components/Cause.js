import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useRouter } from "next/router"
import { causeABI, crowdFunderABI, crowdFunderAddresses } from "../constants"
import { useNotification } from "web3uikit"
import axios from "axios"
import { ethers } from "ethers"
import { sendFileToIPFS, uploadJSONToIPFS } from "../utils/pinata"
import { convertweiToEth, convertEthToWei } from "../utils/converter"
import Header from "./Header"
import Four0FourComponent from "./404 Component"
const Cause = ({ id }) => {
    const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const crowdFunderAddress =
        chainId in crowdFunderAddresses ? crowdFunderAddresses[chainId][0] : null
    const dispatch = useNotification()
    const router = useRouter()
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
    const [uriString, setUriString] = useState("")
    const [showEditModal, toggleEditModal] = useState(false)
    const [description, setDescription] = useState("")
    const [fileImg, setFileImg] = useState(null)
    const [imgUri, setImgUri] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const [newOwner, setNewOwner] = useState("")
    const [changeOwnershipModal, toggleChangeOwnershipModal] = useState(false)
    const [error, setError] = useState("")

    //WEB3 VIEW FUNCTIONS
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
    const { runContractFunction: handover } = useWeb3Contract({
        abi: crowdFunderABI,
        contractAddress: crowdFunderAddress,
        functionName: "handover",
        params: { newOwner: newOwner },
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
    const { runContractFunction: getCauseURI } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "getCauseURI",
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
    //WEB3 PURE FUNCTIONS
    const {
        runContractFunction: withdraw,
        isFetching: withdrawIsFetching,
        isLoading: withdrawIsLoading,
    } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "withdraw",
        params: {},
    })

    const {
        runContractFunction: demandRefund,
        isFetching: refundIsFetching,
        isLoading: refundIsLoading,
    } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "demandRefund",
        params: {},
    })

    const {
        runContractFunction: donate,
        isFetching: donateIsFetching,
        isLoading: donateIsLoading,
    } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "donate",
        params: {},
        msgValue: donationAmountG,
    })

    const {
        runContractFunction: setCauseURI,
        isFetching: setURIIsFetching,
        isLoading: setURIIsLoading,
    } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "setCauseURI",
        params: { causeURI: uriString },
    })

    const {
        runContractFunction: lock,
        isFetching: lockIsFetching,
        isLoading: lockIsLoading,
    } = useWeb3Contract({
        abi: crowdFunderABI,
        contractAddress: crowdFunderAddress,
        functionName: "lock",
        params: { causeId: id },
    })
    const {
        runContractFunction: unlock,
        isFetching: unlockIsFetching,
        isLoading: unlockIsLoading,
    } = useWeb3Contract({
        abi: crowdFunderABI,
        contractAddress: crowdFunderAddress,
        functionName: "unlock",
        params: { causeId: id },
    })

    const {
        runContractFunction: changeOwnership,
        isFetching: changeOwnershipIsFetching,
        isLoading: changeOwnershipIsLoading,
    } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "changeOwnership",
        params: { newOwner: newOwner },
    })

    //EVENT HANDLER FUNCTIONS
    const updateUI = async () => {
        const causeBalanceFromCall = await getCauseBalance()
        const causeNameFromCall = await getCauseName()
        const goalFromCall = await getGoal()
        const isOpenToDonationsFromCall = await getIsOpenToDonations()
        const isLockedFromCall = await getIsLocked()
        const isWithdrawnFromCall = await getIsWithdrawn()
        const isGoalReachedFromCall = await getIsGoalReached()
        const myDonationFromCall = await getMyDonation()
        const causeURIFromCall = await getCauseURI()
        setUriString(causeURIFromCall?.toString())
        setCauseBalance(causeBalanceFromCall?.toString())
        setCauseName(causeNameFromCall?.toString())
        setGoal(goalFromCall?.toString())
        setIsOpenToDonations(isOpenToDonationsFromCall?.toString())
        setIsWithdrawn(isWithdrawnFromCall)
        setIsGoalReached(isGoalReachedFromCall)
        setIsLocked(isLockedFromCall)
        setMyDonations(myDonationFromCall?.toString())
    }

    const updateMetadata = async () => {
        console.log(uriString)
        try {
            const res = await axios.get(uriString)
            setDescription(res.data.description)
            setImgUri(res.data.img)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDonate = async () => {
        donate({
            onSuccess: async (tx) => {
                await tx.wait(1)
                await updateUI()
                setDonationAmount("")
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
    const handleWithdraw = async () => {
        withdraw({
            onSuccess: async (tx) => {
                await tx.wait(1)
                dispatch({
                    title: "Withdrawal Successful",
                    position: "topR",
                    icon: "bell",
                    message: `You successfully withdrew ${causeBalance} from your cause`,
                })
                await updateUI()
            },
            onError: () => {
                dispatch({
                    title: "Withdrawal Failed",
                    position: "topR",
                    icon: "bell",
                    message: `There was an error processing your withdrawal.`,
                })
            },
        })
    }

    const handleSubmit = async () => {
        try {
            setIsUploading(true)
            const imgLink = await sendFileToIPFS(fileImg)
            console.log(imgLink)
            const causeMetadata = { description: description, img: imgLink }
            uploadJSONToIPFS(causeMetadata)
                .then((res) => {
                    console.log(res)
                    setUriString(res)
                })

                .catch((error) => {
                    console.log(error)
                    setIsUploading(false)
                })
        } catch (error) {
            console.log(error)
            dispatch({
                title: "Error updating cause info",
                message: "We encountered an error while updating information about your cause",
                position: "topR",
                type: "error",
                icon: "bell",
            })
            setIsUploading(false)
        }
    }

    const handleRefund = async () => {
        demandRefund({
            onSuccess: async (tx) => {
                await tx.wait(1)
                await updateUI()
                dispatch({
                    title: "Refund given",
                    message: "We have refunded your donation",
                    position: "topR",
                    type: "success",
                    icon: "bell",
                })
            },
            onError: () => {
                dispatch({
                    title: "Refund failed",
                    message: "We were unable to issue a refund",
                    position: "topR",
                    type: "error",
                    icon: "bell",
                })
            },
        })
    }

    const handleLock = async () => {
        await lock({
            onSuccess: async (tx) => {
                await tx.wait(1)
                await updateUI()
                dispatch({
                    title: "Cause locked",
                    message:
                        "The cause has been successfully locked. Donations and withdrawals cannot be made right now",
                    position: "topR",
                    type: "success",
                    icon: "bell",
                })
            },
            onError: async () => {
                dispatch({
                    title: "Error locking the cause",
                    message: "There was an error locking the cause",
                    position: "topR",
                    type: "error",
                    icon: "bell",
                })
            },
        })
    }
    const handleUnlock = async () => {
        await unlock({
            onSuccess: async (tx) => {
                await tx.wait(1)
                await updateUI()
                dispatch({
                    title: "Cause Unlocked",
                    message:
                        "The cause has been successfully unlocked. Donations and withdrawals can now be made",
                    position: "topR",
                    type: "success",
                    icon: "bell",
                })
            },
            onError: async () => {
                dispatch({
                    title: "Error unlocking cause",
                    message: "There was an error unlocking the cause",
                    position: "topR",
                    type: "error",
                    icon: "bell",
                })
            },
        })
    }

    const handleChangeOwner = async () => {
        changeOwnership({
            onSuccess: async (tx) => {
                await tx.wait(1)

                await handover({
                    onSuccess: async (tx) => {
                        await tx.wait(1)
                        dispatch({
                            title: "Ownership changed successfully",
                            message: `The new owner of this cause is ${newOwner}`,
                            position: "topR",
                            type: "success",
                            icon: "bell",
                        })
                        await updateUI()
                        setNewOwner("")
                    },
                    onError: async () => {
                        dispatch({
                            title: "Error Changing Ownership",
                            message: "There was an error changing the owner of this cause",
                            position: "topR",
                            type: "error",
                            icon: "bell",
                        })
                    },
                })
            },
            onError: (tx) => {
                dispatch({
                    title: "Error Changing Ownership",
                    message: "There was an error changing the owner of this cause",
                    position: "topR",
                    type: "error",
                    icon: "bell",
                })
            },
        })
    }
    //USEEFFECTS

    useEffect(() => {
        if (isWeb3Enabled) {
            getCrowdFunderOwner()
                .then((res) => {
                    setCrowdFunderOwner(res?.toString())
                })
                .then(() => {
                    getCauseById({
                        onError: async () => {
                            router.push("/404")
                        },
                    })
                        .then((res) => {
                            setCauseAddress(res?.toString())
                        })
                        .catch((e) => {
                            console.log(e)
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
            updateUI()
        }
    }, [isWeb3Enabled, causeOwner, account])
    useEffect(() => {
        if (isWeb3Enabled && crowdFunderOwner) {
            if (account?.toLowerCase() == crowdFunderOwner?.toLowerCase()) {
                setAmICrowdFunderOwner(true)
            } else {
                setAmICrowdFunderOwner(false)
            }
            updateUI()
        }
    }, [isWeb3Enabled, crowdFunderOwner, account])
    useEffect(() => {
        if (isWeb3Enabled) {
            setDonationAmountG(convertEthToWei(donationAmount))
        }
    }, [isWeb3Enabled, donationAmount])
    useEffect(() => {
        if (isWeb3Enabled && uriString) {
            if (isUploading) {
                setCauseURI({
                    onSuccess: async (tx) => {
                        await tx.wait(1)
                        dispatch({
                            title: "Edit successful",
                            message: "You have successfully edited cause data",
                            icon: "bell",
                            type: "success",
                            position: "topR",
                        })
                        setIsUploading(false)
                        toggleEditModal(false)
                        await updateUI()
                        await updateMetadata()
                    },
                    onError: async () => {
                        dispatch({
                            title: "Edit failed",
                            message: "There was an error editing cause data",
                            icon: "bell",
                            type: "error",
                            position: "topR",
                        })
                        console.log("error editing")
                        setIsUploading(false)
                    },
                })
            } else {
                updateMetadata()
            }
        }
    }, [isWeb3Enabled, uriString])

    return (
        <div>
            <Header
                id={id}
                amICauseOwner={amICauseOwner}
                amICrowdFunderOwner={amICrowdFunderOwner}
            />
            <div className="cause-body">
                <div className="cause-info">
                    <img src={imgUri} className="cause-img"></img>
                    <h1>{causeName?.toUpperCase()}</h1>
                    <div>{description}</div>
                    <h2>ID: {id}</h2>
                    <h2>
                        CAUSE ADDRESS: {causeAddress}
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(causeAddress)
                            }}
                        >
                            copy
                        </button>
                    </h2>
                    <h2>
                        OWNED BY: {causeOwner}
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(causeOwner)
                            }}
                        >
                            copy
                        </button>
                    </h2>
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
                            <button
                                onClick={handleDonate}
                                disabled={
                                    isWithdrawn ||
                                    isLocked ||
                                    isGoalReached ||
                                    donateIsFetching ||
                                    donateIsLoading
                                }
                            >
                                DONATE
                            </button>
                        </div>
                    )}
                </div>
                {!amICauseOwner && (
                    <div>
                        You have donated {convertweiToEth(myDonations)} to this cause
                        <button
                            onClick={handleRefund}
                            disabled={myDonations == "0" || refundIsFetching || refundIsLoading}
                        >
                            DEMAND REFUND
                        </button>
                    </div>
                )}
                {isWithdrawn &&
                    (amICauseOwner ? (
                        <div>
                            You have withdrawn the donations to this cause to your wallet with
                            address
                            {causeOwner}
                        </div>
                    ) : (
                        <div>
                            The owner of this cause has withdrawn the donations to his wallet{" "}
                            {causeOwner}
                        </div>
                    ))}

                {amICauseOwner && (
                    <button onClick={handleWithdraw} disabled={isWithdrawn || isLocked}>
                        WITHDRAW
                    </button>
                )}
                {amICrowdFunderOwner && !isLocked && (
                    <button onClick={handleLock} disabled={lockIsFetching || lockIsLoading}>
                        LOCK CAUSE
                    </button>
                )}
                {amICrowdFunderOwner && isLocked && (
                    <button onClick={handleUnlock} disabled={unlockIsFetching || unlockIsLoading}>
                        UNLOCK CAUSE
                    </button>
                )}
                {isWithdrawn && (
                    <div>
                        This Cause has been withdrawn from, hence donations and withdrawals can no
                        longer be made.{" "}
                    </div>
                )}
                {isLocked && (
                    <div>
                        This cause is currently locked by the site admin. You cannot make a donation
                        at the moment.
                    </div>
                )}
                {amICauseOwner && (
                    <button
                        onClick={() => {
                            if (showEditModal) {
                                toggleEditModal(false)
                            } else {
                                toggleEditModal(true)
                            }
                        }}
                    >
                        EDIT
                    </button>
                )}

                {amICauseOwner && showEditModal && !isLocked && (
                    <div>
                        <form>
                            <textarea
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value)
                                }}
                                placeholder="Cause Description"
                                required
                            ></textarea>
                            <label>Upload Image</label>
                            <input
                                type="file"
                                accept="image/png, image/gif, image/jpeg"
                                onChange={(e) => {
                                    setFileImg(e.target.files[0])
                                }}
                                required
                            ></input>
                            <button
                                onClick={async (e) => {
                                    e.preventDefault()
                                    await handleSubmit()
                                }}
                                disabled={setURIIsFetching || setURIIsLoading || isUploading}
                            >
                                SUBMIT
                            </button>
                        </form>
                        <button
                            onClick={() => {
                                if (changeOwnershipModal) {
                                    toggleChangeOwnershipModal(false)
                                } else {
                                    toggleChangeOwnershipModal(true)
                                }
                            }}
                        >
                            CHANGE OWNERSHIP
                        </button>
                        {changeOwnershipModal && (
                            <div>
                                <input
                                    type="text"
                                    onChange={(e) => {
                                        setNewOwner(e.target.value)
                                    }}
                                    placeholder="New Owner"
                                ></input>
                                <button
                                    onClick={handleChangeOwner}
                                    disabled={changeOwnershipIsFetching || changeOwnershipIsLoading}
                                >
                                    CHANGE OWNER
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Cause
