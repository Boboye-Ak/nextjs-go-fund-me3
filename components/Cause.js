import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useRouter } from "next/router"
import { causeABI, crowdFunderABI, crowdFunderAddresses } from "../constants"
import { useNotification } from "web3uikit"
import axios from "axios"
import { ethers } from "ethers"
import { sendFileToIPFS, uploadJSONToIPFS } from "../utils/pinata"
import { convertweiToEth, convertEthToWei, convertweiToEthNum } from "../utils/converter"
import { siteURL } from "../nextjs.helper.config"
import Header from "./Header"
import Four0FourComponent from "./404 Component"
import {
    RiFileCopyLine,
    RiArrowDownSLine,
    RiArrowDropRightLine,
    RiUpload2Fill,
    RiInstagramLine,
} from "react-icons/ri"
import { FaShareSquare, FaEthereum } from "react-icons/fa"
import { GiPadlock, GiPadlockOpen } from "react-icons/gi"
import { IoLogoTwitter, IoLogoFacebook } from "react-icons/io"
import { SiGmail } from "react-icons/si"
import ProgressBar from "./progressbar"
const Cause = ({ id }) => {
    const shareURL = `${siteURL}/cause/${id}`
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
    const [donationList, setDonationList] = useState([])
    const [crowdFunderOwner, setCrowdFunderOwner] = useState("")
    const [amICrowdFunderOwner, setAmICrowdFunderOwner] = useState(false)
    const [uriString, setUriString] = useState("")
    const [numDonations, setNumDonations] = useState("0")
    const [numRefunds, setNumRefunds] = useState("0")
    const [showEditModal, toggleEditModal] = useState(false)
    const [showShareModal, toggleShowShareModal] = useState(false)
    const [newDescription, setNewDescription] = useState("")
    const [name, setName] = useState("")
    const [newName, setNewName] = useState("")
    const [description, setDescription] = useState("")
    const [showFullDescription, toggleShowFullDescription] = useState(false)
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
    const { runContractFunction: getNumDonations } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "getNumDonations",
        params: {},
    })
    const { runContractFunction: getNumRefunds } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "getNumRefunds",
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
    const { runContractFunction: getDonationList } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "getDonationList",
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
        runContractFunction: switchIsOpenToDonations,
        isFetching: switchIsOpenToDonationsIsFetching,
        isLoading: switchIsOpenToDonationsIsLoading,
    } = useWeb3Contract({
        abi: causeABI,
        contractAddress: causeAddress,
        functionName: "switchIsOpenToDonations",
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
        const donationListFromCall = await getDonationList()
        const newDonationList = donationListFromCall?.map((donation) => {
            const newDonation = {
                donor: donation[0],
                amount: convertweiToEth(donation[1]?.toString()),
            }
            return newDonation
        })
        console.log(newDonationList)
        const myDonationFromCall = await getMyDonation()
        const causeURIFromCall = await getCauseURI()
        const numDonationsFromCall = await getNumDonations()
        const numRefundsFromCall = await getNumRefunds()
        setUriString(causeURIFromCall?.toString())
        setCauseBalance(causeBalanceFromCall?.toString())
        setCauseName(causeNameFromCall?.toString())
        setGoal(goalFromCall?.toString())
        setIsOpenToDonations(isOpenToDonationsFromCall)
        setIsWithdrawn(isWithdrawnFromCall)
        setIsGoalReached(isGoalReachedFromCall)
        setIsLocked(isLockedFromCall)
        setMyDonations(myDonationFromCall?.toString())
        setNumDonations(numDonationsFromCall?.toString())
        setNumRefunds(numRefundsFromCall?.toString())
        setDonationList(newDonationList?.reverse())
    }

    const updateMetadata = async () => {
        console.log(uriString)
        try {
            const res = await axios.get(uriString)
            setDescription(res.data.description)
            setImgUri(res.data.img)
            setName(res.data.name)
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
            let imgLink, nameToSet, descriptionToSet
            if (fileImg) {
                imgLink = await sendFileToIPFS(fileImg)
            } else {
                imgLink = imgUri
            }
            if (newName) {
                nameToSet = newName
            } else {
                nameToSet = name
            }
            if (newDescription) {
                descriptionToSet = newDescription
            } else {
                descriptionToSet = description
            }
            console.log(imgLink)
            const causeMetadata = { name: nameToSet, description: newDescription, img: imgLink }
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

    const handleOpenToDonations = async () => {
        switchIsOpenToDonations({
            onSuccess: async (tx) => {
                await tx.wait(1)
                await updateUI()
            },
            onError: async () => {
                dispatch({
                    title: "Error",
                    message: "There was an error opening/closing to donations",
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
                            router.push("/")
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

    useEffect(() => {
        if (isWeb3Enabled) {
        }
    }, [isWeb3Enabled, isOpenToDonations])

    //Return Value
    return (
        <div className="cause">
            <Header
                id={id}
                amICauseOwner={amICauseOwner}
                amICrowdFunderOwner={amICrowdFunderOwner}
            />

            <div className="container">
                <div className="body-and-donors">
                    <div className="cause-body">
                        <div className="cause-name">
                            <div>{causeName?.toUpperCase()}</div>
                            <div className="cause-id">#{id}</div>
                        </div>
                        <div className="cause-img">
                            <img src={imgUri}></img>
                        </div>
                        {name && (
                            <div className="cause-owner-name">
                                Donations for{" "}
                                <span className="cause-owner-actual-name">{name}</span>
                            </div>
                        )}
                        <div className={`cause-description ${!showFullDescription && "fade"}`}>
                            {!showFullDescription ? (
                                <>
                                    {description.slice(0, 500)}...
                                    <a
                                        className="read-more-button"
                                        onClick={() => {
                                            toggleShowFullDescription(true)
                                        }}
                                    >
                                        {"  "}read more
                                    </a>
                                </>
                            ) : (
                                <div>
                                    {" "}
                                    {description}
                                    <a
                                        className="read-more-button"
                                        onClick={() => {
                                            toggleShowFullDescription(false)
                                        }}
                                    >
                                        {"  "}
                                        read less
                                    </a>
                                </div>
                            )}
                        </div>

                        <div
                            className="cause-owner"
                            title="The ethereum contract address of the cause You can donate to this cause by transferring ethereum to this address.(You can demand a refund later)"
                        >
                            CAUSE ADDRESS: {causeAddress}
                            {"  "}
                            <RiFileCopyLine
                                onClick={() => {
                                    navigator.clipboard.writeText(causeAddress)
                                    dispatch({
                                        title: "Copied!",
                                        message: "Cause Address Copied To Clipboard",
                                        icon: "bell",
                                        position: "topR",
                                        type: "success",
                                    })
                                }}
                            />
                        </div>
                        <div
                            className="cause-owner"
                            title="The ethereum address of the owner of the cause. You can send ethereum directly to them through this route(Non-refundable)"
                        >
                            OWNED BY: {causeOwner}
                            {"  "}
                            <RiFileCopyLine
                                onClick={() => {
                                    navigator.clipboard.writeText(causeOwner)
                                    dispatch({
                                        title: "Copied!",
                                        message: "Cause Owner Address Copied To Clipboard",
                                        icon: "bell",
                                        position: "topR",
                                        type: "success",
                                    })
                                }}
                            />
                        </div>
                        <div className="progress">
                            {convertweiToEth(causeBalance)} out of {convertweiToEth(goal)}
                            <FaEthereum />
                            <ProgressBar
                                bgcolor={"#6a1b9a"}
                                completed={
                                    (convertweiToEth(causeBalance) / convertweiToEth(goal)) * 100
                                }
                            />
                        </div>

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
                                        !isOpenToDonations ||
                                        isLocked ||
                                        isGoalReached ||
                                        donateIsFetching ||
                                        donateIsLoading
                                    }
                                >
                                    DONATE
                                </button>
                                {!isOpenToDonations && (
                                    <div>This cause is currently closed to donations</div>
                                )}
                                {isWithdrawn && (
                                    <div>
                                        The owner of this cause has withdrawn the balance hence you
                                        cannot donate to it.
                                    </div>
                                )}
                            </div>
                        )}
                        {!amICauseOwner && (
                            <div>
                                <button
                                    onClick={handleRefund}
                                    disabled={
                                        myDonations == "0" || refundIsFetching || refundIsLoading
                                    }
                                >
                                    DEMAND REFUND
                                </button>
                            </div>
                        )}

                        {isWithdrawn &&
                            (amICauseOwner ? (
                                <div>
                                    You have withdrawn the donations to this cause to your wallet
                                    with address
                                    {causeOwner}
                                </div>
                            ) : (
                                <div>
                                    The owner of this cause has withdrawn the donations to his
                                    wallet {causeOwner}
                                </div>
                            ))}

                        {amICauseOwner && (
                            <div className="cause-owner-only">
                                {" "}
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
                                    {showEditModal ? (
                                        <RiArrowDownSLine />
                                    ) : (
                                        <RiArrowDropRightLine />
                                    )}
                                </button>
                            </div>
                        )}
                        {amICauseOwner && showEditModal && !isLocked && (
                            <div className="edit-area">
                                <div className="edit-modal">
                                    <input
                                        type="text"
                                        value={newName}
                                        placeholder="Cause Owner Name"
                                        onChange={(e) => {
                                            setNewName(e.target.value)
                                        }}
                                    ></input>
                                    <textarea
                                        value={newDescription}
                                        onChange={(e) => {
                                            setNewDescription(e.target.value)
                                        }}
                                        placeholder="Cause Description"
                                        required
                                    >
                                        {description}
                                    </textarea>
                                    <label for="cause-image">
                                        Upload picture for cause{"  "}
                                        <RiUpload2Fill />
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/png, image/gif, image/jpeg"
                                        onChange={(e) => {
                                            setFileImg(e.target.files[0])
                                        }}
                                        id="cause-image"
                                        hidden
                                    ></input>
                                    {!fileImg && <p>No file chosen</p>}
                                    <button
                                        onClick={async (e) => {
                                            e.preventDefault()
                                            await handleSubmit()
                                        }}
                                        disabled={
                                            setURIIsFetching || setURIIsLoading || isUploading
                                        }
                                    >
                                        SUBMIT EDIT
                                    </button>
                                </div>
                                <div className="cause-owner-only">
                                    {" "}
                                    <button
                                        onClick={() => {
                                            if (changeOwnershipModal) {
                                                toggleChangeOwnershipModal(false)
                                            } else {
                                                toggleChangeOwnershipModal(true)
                                            }
                                        }}
                                    >
                                        CHANGE OWNERSHIP{"  "}
                                        {changeOwnershipModal ? (
                                            <RiArrowDownSLine />
                                        ) : (
                                            <RiArrowDropRightLine />
                                        )}
                                    </button>
                                </div>

                                {changeOwnershipModal && (
                                    <div className="cause-owner-only">
                                        <input
                                            type="text"
                                            onChange={(e) => {
                                                setNewOwner(e.target.value)
                                            }}
                                            placeholder="New Owner"
                                        ></input>
                                        <button
                                            onClick={handleChangeOwner}
                                            disabled={
                                                changeOwnershipIsFetching ||
                                                changeOwnershipIsLoading
                                            }
                                        >
                                            CHANGE OWNER
                                        </button>
                                    </div>
                                )}
                                {isOpenToDonations ? (
                                    <div className="cause-owner-only">
                                        {" "}
                                        <button
                                            onClick={handleOpenToDonations}
                                            disabled={
                                                isWithdrawn ||
                                                isLocked ||
                                                switchIsOpenToDonationsIsFetching ||
                                                switchIsOpenToDonationsIsLoading
                                            }
                                        >
                                            CLOSE TO DONATIONS
                                        </button>
                                        <GiPadlock size="1.5em" />
                                    </div>
                                ) : (
                                    <div className="cause-owner-only">
                                        {" "}
                                        <button
                                            disabled={
                                                isWithdrawn ||
                                                isLocked ||
                                                switchIsOpenToDonationsIsFetching ||
                                                switchIsOpenToDonationsIsLoading
                                            }
                                            onClick={handleOpenToDonations}
                                        >
                                            OPEN TO DONATIONS
                                        </button>
                                        <GiPadlockOpen size="1.5em" />
                                    </div>
                                )}
                            </div>
                        )}
                        {amICauseOwner && (
                            <div className="cause-owner-only">
                                {" "}
                                <button onClick={handleWithdraw} disabled={isWithdrawn || isLocked}>
                                    WITHDRAW
                                </button>
                            </div>
                        )}

                        {amICrowdFunderOwner && !isLocked && (
                            <button onClick={handleLock} disabled={lockIsFetching || lockIsLoading}>
                                LOCK CAUSE
                            </button>
                        )}
                        {amICrowdFunderOwner && isLocked && (
                            <button
                                onClick={handleUnlock}
                                disabled={unlockIsFetching || unlockIsLoading}
                            >
                                UNLOCK CAUSE
                            </button>
                        )}
                        {isWithdrawn && (
                            <div>
                                This Cause has been withdrawn from, hence donations and withdrawals
                                can no longer be made.{" "}
                            </div>
                        )}
                        {isLocked && (
                            <div>
                                This cause is currently locked by the site admin. You cannot make a
                                donation at the moment.
                            </div>
                        )}
                    </div>
                    <div className="donor-list-and-share">
                        {!amICauseOwner && (
                            <div className="your-donation">
                                You've donated {convertweiToEth(myDonations)}
                                <FaEthereum /> to this cause
                            </div>
                        )}
                        <div className="num-donations">
                            {numDonations} donation{numDonations != "1" && "s"}
                            {"  "}
                            {numRefunds} refund{numRefunds != "1" && "s"}
                        </div>
                        <div className="donor-list">
                            {donationList?.slice(0, 6)?.map((donation, index) => {
                                if (parseFloat(donation.amount) > 0) {
                                    return (
                                        <div key={index} className="donation">
                                            {donation.donor} donated {donation.amount}ETH
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div key={index} className="donation">
                                            {donation.donor} got a refund of {donation.amount}ETH
                                        </div>
                                    )
                                }
                            })}
                            {numDonations > 6 && (
                                <a className="read-more-button">Show full donor list</a>
                            )}
                        </div>
                        <div
                            className="share-module"
                            onMouseEnter={() => {
                                toggleShowShareModal(true)
                            }}
                            onMouseLeave={() => {
                                toggleShowShareModal(false)
                            }}
                        >
                            {showShareModal ? (
                                <>
                                    {" "}
                                    <a
                                        className="share-icon"
                                        href={`https://twitter.com/intent/tweet?text=Donate%20to%20${name.replace(
                                            / /g,
                                            "%20"
                                        )}'s%20campaign%20"${causeName.replace(
                                            / /g,
                                            "%20"
                                        )}"%20${shareURL}`}
                                        target="_blank"
                                    >
                                        <IoLogoTwitter size="2em" />
                                    </a>
                                    <a className="share-icon">
                                        <IoLogoFacebook size="2em" />
                                    </a>
                                    <a className="share-icon">
                                        <SiGmail size="2em" />
                                    </a>
                                    <a className="share-icon">
                                        <RiInstagramLine size="2em" />
                                    </a>
                                    <a className="share-icon">
                                        <RiFileCopyLine
                                            size="2em"
                                            onClick={() => {
                                                navigator.clipboard.writeText(shareURL)
                                            }}
                                        />
                                    </a>
                                </>
                            ) : (
                                <>
                                    <span id="share-text">
                                        SHARE {"  "}
                                        <FaShareSquare />
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cause
