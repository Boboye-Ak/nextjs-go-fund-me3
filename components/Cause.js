import { useEffect, useRef, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import QRCode from "qrcode"
import { useRouter } from "next/router"
import { causeABI, chains, crowdFunderABI, crowdFunderAddresses } from "../constants"
import { useNotification } from "web3uikit"
import axios from "axios"
import { sendFileToIPFS, uploadJSONToIPFS } from "../utils/pinata"
import { convertweiToEth, convertEthToWei, convertweiToEthNum } from "../utils/converter"
import { siteURL } from "../nextjs.helper.config"
import Header from "./Header"
import {
    RiFileCopyLine,
    RiArrowDownSLine,
    RiArrowUpSLine,
    RiArrowDropRightLine,
    RiUpload2Fill,
    RiQrCodeLine,
    RiArrowDropUpLine,
} from "react-icons/ri"
import { FaShareSquare, FaEthereum } from "react-icons/fa"
import { GiPadlock, GiPadlockOpen } from "react-icons/gi"
import { IoLogoTwitter, IoLogoFacebook } from "react-icons/io"
import { SiGmail } from "react-icons/si"
import ProgressBar from "./progressbar"
import UnsupportedChain from "./unsupported-chain"
const Cause = ({ id }) => {
    const shareURL = `${siteURL}/causes/${id}`
    const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const crowdFunderAddress =
        chainId in crowdFunderAddresses ? crowdFunderAddresses[chainId][0] : null

    let activeChain = chains.filter((chain) => {
        if (chain.chainId == chainId) {
            return chain
        }
    })
    activeChain = activeChain[0]
    const dispatch = useNotification()
    const router = useRouter()
    const editModal = useRef(null)
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
    const [iconSize, setIconSize] = useState({
        twitter: "2em",
        faceBook: "2em",
        instagram: "2em",
        email: "2em",
        copyToClip: "2em",
    })
    const [listTopIndex, setListTopIndex] = useState(0)
    const [listBottomIndex, setListBottomIndex] = useState(5)
    const [ethPrice, setEthPrice] = useState(0)
    const [dollarEquivalent, setDollarEquivalent] = useState("")
    const [qrCode, setQRCode] = useState("")
    const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useState(null)

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
        generateQRCode()
    }

    const updateMetadata = async () => {
        try {
            const res = await axios.get(uriString)
            if (!res.data.description || !res.data.img || (!res.data.name && amICauseOwner)) {
                toggleEditModal(true)
                editModal.current.scrollIntoView()
                dispatch({
                    title: "Edit Cause",
                    message: "Please complete the information about your cause",
                    type: "warning",
                    icon: "bell",
                    position: "topR",
                })
            }
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
                setIsAwaitingConfirmation(true)
                await tx.wait(1)
                setIsAwaitingConfirmation(false)
                setIsAwaitingConfirmation(null)
                await updateUI()
                setDonationAmount("")
                setDollarEquivalent("")
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
                setIsAwaitingConfirmation(true)
                await tx.wait(1)
                setIsAwaitingConfirmation(false)
                setIsAwaitingConfirmation(null)
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
            const causeMetadata = {
                causeId: id,
                name: nameToSet,
                description: newDescription,
                img: imgLink,
            }
            uploadJSONToIPFS(causeMetadata)
                .then((res) => {
                    setUriString(res)
                    setNewDescription("")
                    setNewName("")
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
                setIsAwaitingConfirmation(true)
                await tx.wait(1)
                setIsAwaitingConfirmation(false)
                setIsAwaitingConfirmation(null)
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
                setIsAwaitingConfirmation(true)
                await tx.wait(1)
                setIsAwaitingConfirmation(false)
                setIsAwaitingConfirmation(null)
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
                setIsAwaitingConfirmation(true)
                await tx.wait(1)
                setIsAwaitingConfirmation(false)
                setIsAwaitingConfirmation(null)
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
                setIsAwaitingConfirmation(true)
                await tx.wait(1)
                setIsAwaitingConfirmation(false)
                setIsAwaitingConfirmation(null)

                await handover({
                    onSuccess: async (tx) => {
                        setIsAwaitingConfirmation(true)
                        await tx.wait(1)
                        setIsAwaitingConfirmation(false)
                        setIsAwaitingConfirmation(null)
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
                setIsAwaitingConfirmation(true)
                await tx.wait(1)
                setIsAwaitingConfirmation(false)
                setIsAwaitingConfirmation(null)
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

    const getEthPrice = async () => {
        const res = await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=ETHBUSD")
        setEthPrice(parseFloat(res.data.price))
    }
    const generateQRCode = () => {
        QRCode.toDataURL(shareURL, (err, qrUrl) => {
            if (err) {
                return console.error(err)
            }
            setQRCode(qrUrl)
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
        if (isWeb3Enabled && donationAmount) {
            setDonationAmountG(convertEthToWei(donationAmount))
        }
    }, [isWeb3Enabled, donationAmount])
    useEffect(() => {
        if (isWeb3Enabled && uriString) {
            if (isUploading) {
                setCauseURI({
                    onSuccess: async (tx) => {
                        setIsAwaitingConfirmation(true)
                        await tx.wait(1)
                        setIsAwaitingConfirmation(false)
                        setIsAwaitingConfirmation(null)
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
        getEthPrice()
    }, [])

    useEffect(() => {
        if (isAwaitingConfirmation != null) {
            if (isAwaitingConfirmation === true) {
                dispatch({
                    title: "Awaiting block confirmation",
                    message: "Please wait for 1 block to be confirmed",
                    type: "info",
                    icon: "bell",
                    position: "topR",
                })
            }
            if (isAwaitingConfirmation === false) {
                dispatch({
                    title: "Block Confirmed",
                    message: "Your transaction was completed and confirmed",
                    type: "info",
                    icon: "bell",
                    position: "topR",
                })
            }
        }
    }, [isAwaitingConfirmation])

    //Return Value

    return (
        <div className="cause">
            <Header
                id={id}
                amICauseOwner={amICauseOwner}
                amICrowdFunderOwner={amICrowdFunderOwner}
            />
            {crowdFunderAddress ? (
                <>
                    {" "}
                    <div className="container">
                        <div className="body-and-donors">
                            <div
                                className="cause-body"
                                style={!causeName?.length ? { opacity: "0" } : { opacity: "1" }}
                            >
                                <div className="cause-name">
                                    <div>{causeName?.toUpperCase()}</div>
                                    <div className="cause-id">#{id}</div>
                                </div>
                                <div className="cause-img">
                                    <img
                                        src={
                                            imgUri
                                                ? imgUri
                                                : "/blank-profile-picture-g68da58bec_1280.png"
                                        }
                                    ></img>
                                </div>
                                {name && (
                                    <div className="cause-owner-name">
                                        Donations for{" "}
                                        <span className="cause-owner-actual-name">{name}</span>
                                    </div>
                                )}
                                <div
                                    className={`cause-description ${
                                        !showFullDescription && "fade"
                                    }`}
                                >
                                    {!showFullDescription ? (
                                        <>
                                            {description.slice(0, 560)}
                                            {description && description.length > 560 && (
                                                <div className="read-more-button">
                                                    <RiArrowDownSLine
                                                        className="read-more-button-circle"
                                                        size="1.5em"
                                                        onClick={() => {
                                                            toggleShowFullDescription(true)
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div>
                                            {" "}
                                            {description}
                                            <a className="read-more-button">
                                                <RiArrowDropUpLine
                                                    className="read-more-button-circle"
                                                    size="1.5em"
                                                    onClick={() => {
                                                        toggleShowFullDescription(false)
                                                    }}
                                                />
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div
                                    className="cause-owner"
                                    title="The ethereum contract address of the cause You can donate to this cause by transferring ethereum to this address.(You can demand a refund later)"
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
                                >
                                    CAUSE ADDRESS: {causeAddress}
                                    {"  "}
                                    <span className="copy-icon">
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
                                    </span>
                                </div>
                                <div
                                    className="cause-owner"
                                    title="The ethereum address of the owner of the cause. You can send ethereum directly to them through this route(Non-refundable)"
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
                                >
                                    OWNED BY: {causeOwner}
                                    {"  "}
                                    <span className="copy-icon">
                                        <RiFileCopyLine
                                            onClick={() => {
                                                navigator.clipboard.writeText(causeOwner)
                                                dispatch({
                                                    title: "Copied!",
                                                    message:
                                                        "Cause Owner Address Copied To Clipboard",
                                                    icon: "bell",
                                                    position: "topR",
                                                    type: "success",
                                                })
                                            }}
                                        />
                                    </span>
                                </div>
                                <div className="progress" style={{ fontWeight: "bolder" }}>
                                    {convertweiToEth(causeBalance)} out of {convertweiToEth(goal)}{" "}
                                    ($
                                    {parseFloat(convertweiToEth(causeBalance) * ethPrice)?.toFixed(
                                        2
                                    )}
                                    /$
                                    {parseFloat(convertweiToEth(goal) * ethPrice)?.toFixed(2)})
                                    <FaEthereum color="#298e46" />
                                    <ProgressBar
                                        bgcolor={"#02ba23"}
                                        completed={
                                            (convertweiToEth(causeBalance) /
                                                convertweiToEth(goal)) *
                                                100 <
                                            100
                                                ? (
                                                      (convertweiToEth(causeBalance) /
                                                          convertweiToEth(goal)) *
                                                      100
                                                  ).toFixed(2)
                                                : 100
                                        }
                                    />
                                </div>

                                {!amICauseOwner &&
                                    !isWithdrawn &&
                                    !isGoalReached &&
                                    isOpenToDonations &&
                                    !isLocked && (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <div className="input-bar">
                                                <input
                                                    type="number"
                                                    value={donationAmount}
                                                    placeholder="(ETH)"
                                                    onChange={(e) => {
                                                        setDonationAmount(e.target.value)
                                                        if (parseFloat(e.target.value) < 0) {
                                                            setDonationAmount("0")
                                                            setDollarEquivalent("0")
                                                        }
                                                        if (e.target.value != "") {
                                                            setDollarEquivalent(
                                                                (
                                                                    parseFloat(e.target.value) *
                                                                    ethPrice
                                                                )
                                                                    ?.toFixed(2)
                                                                    ?.toString()
                                                            )
                                                        } else {
                                                            setDollarEquivalent("")
                                                        }
                                                    }}
                                                ></input>
                                                <span>
                                                    <FaEthereum />
                                                </span>
                                            </div>
                                            <div style={{ fontWeight: "bolder" }}>OR</div>
                                            <div className="input-bar">
                                                <input
                                                    type="number"
                                                    value={dollarEquivalent}
                                                    placeholder="(USD)"
                                                    onChange={(e) => {
                                                        setDollarEquivalent(e.target.value)
                                                        if (parseFloat(e.target.value) < 0) {
                                                            setDollarEquivalent("0")
                                                            setDonationAmount("0")
                                                        }
                                                        if (
                                                            e.target.value != "" &&
                                                            parseFloat(e.target.value) >= 0
                                                        ) {
                                                            setDonationAmount(
                                                                (
                                                                    parseFloat(e.target.value) /
                                                                    ethPrice
                                                                )
                                                                    ?.toFixed(8)
                                                                    ?.toString()
                                                            )
                                                        } else {
                                                            setDonationAmount("")
                                                        }
                                                    }}
                                                ></input>
                                                <div
                                                    style={{
                                                        fontWeight: "bolder",
                                                        fontSize: "1.5em",
                                                    }}
                                                >
                                                    $
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleDonate}
                                                disabled={
                                                    isWithdrawn ||
                                                    !isOpenToDonations ||
                                                    isLocked ||
                                                    isGoalReached ||
                                                    donateIsFetching ||
                                                    donateIsLoading ||
                                                    !donationAmount ||
                                                    !isWeb3Enabled ||
                                                    isAwaitingConfirmation
                                                }
                                            >
                                                DONATE
                                            </button>
                                        </div>
                                    )}
                                {!amICauseOwner && myDonations != "0" && !isWithdrawn && (
                                    <div>
                                        <button
                                            onClick={handleRefund}
                                            disabled={
                                                myDonations == "0" ||
                                                refundIsFetching ||
                                                refundIsLoading ||
                                                isAwaitingConfirmation
                                            }
                                            className="demand-refund-button"
                                        >
                                            DEMAND REFUND
                                        </button>
                                    </div>
                                )}

                                {isWithdrawn &&
                                    (amICauseOwner ? (
                                        <div className="withdrawal-info">
                                            You have withdrawn the donations to this cause to your
                                            wallet with address
                                            {causeOwner}
                                        </div>
                                    ) : (
                                        <div className="withdrawal-info">
                                            The owner of this cause has withdrawn the donations to
                                            his wallet {causeOwner}
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
                                        <div className="edit-modal" ref={editModal}>
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
                                            <label htmlFor="cause-image">
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
                                                    setURIIsFetching ||
                                                    setURIIsLoading ||
                                                    isUploading ||
                                                    isAwaitingConfirmation
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
                                                        changeOwnershipIsLoading ||
                                                        isAwaitingConfirmation
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
                                                        switchIsOpenToDonationsIsLoading ||
                                                        isAwaitingConfirmation
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
                                                        switchIsOpenToDonationsIsLoading ||
                                                        isAwaitingConfirmation
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
                                        <button
                                            onClick={handleWithdraw}
                                            disabled={
                                                isWithdrawn ||
                                                withdrawIsFetching ||
                                                withdrawIsLoading ||
                                                isLocked ||
                                                isAwaitingConfirmation
                                            }
                                        >
                                            WITHDRAW
                                        </button>
                                    </div>
                                )}

                                {amICrowdFunderOwner && !isLocked && (
                                    <button
                                        onClick={handleLock}
                                        disabled={
                                            lockIsFetching ||
                                            lockIsLoading ||
                                            isAwaitingConfirmation
                                        }
                                    >
                                        LOCK CAUSE
                                    </button>
                                )}
                                {amICrowdFunderOwner && isLocked && (
                                    <button
                                        onClick={handleUnlock}
                                        disabled={
                                            unlockIsFetching ||
                                            unlockIsLoading ||
                                            isAwaitingConfirmation
                                        }
                                    >
                                        UNLOCK CAUSE
                                    </button>
                                )}
                                {isWithdrawn && (
                                    <div className="red-info">
                                        This Cause has been withdrawn from, hence donations can no
                                        longer be made and refunds can no longer be demanded.{" "}
                                    </div>
                                )}
                                {isLocked && (
                                    <div className="red-info">
                                        This cause is currently locked by the site admin. You cannot
                                        make a donation or withdrawal at the moment.
                                    </div>
                                )}
                                {!isOpenToDonations && (
                                    <div>
                                        This cause is currently closed to donations by{" "}
                                        {amICauseOwner
                                            ? "you, the cause owner."
                                            : "the cause owner"}
                                    </div>
                                )}
                            </div>
                            <div
                                className="donor-list-and-share"
                                style={
                                    !causeName?.length
                                        ? { opacity: "0" }
                                        : { position: "sticky", top: "0", opacity:"1" }
                                }
                            >
                                {!amICauseOwner && (
                                    <div className="your-donation">
                                        You've donated {convertweiToEth(myDonations)}
                                        <FaEthereum /> ($
                                        {(parseFloat(convertweiToEth(myDonations)) * ethPrice)
                                            ?.toFixed(2)
                                            ?.toString()}
                                        ) to this cause
                                    </div>
                                )}
                                <div className="num-donations">
                                    {numDonations} donation{numDonations != "1" && "s"}
                                    {"  "}
                                    {numRefunds} refund{numRefunds != "1" && "s"}
                                </div>
                                <div className="donor-list">
                                    <div className="read-more-button">
                                        {listTopIndex != 0 && (
                                            <RiArrowUpSLine
                                                className="read-more-button-circle"
                                                onClick={() => {
                                                    setListTopIndex((oldValue) => {
                                                        if (oldValue != 0) {
                                                            return oldValue - 1
                                                        }
                                                    })
                                                    setListBottomIndex((oldValue) => {
                                                        if (oldValue != 5) {
                                                            return oldValue - 1
                                                        }
                                                    })
                                                }}
                                                size="1.5em"
                                            />
                                        )}
                                    </div>
                                    {donationList
                                        ?.slice(listTopIndex, listBottomIndex)
                                        ?.map((donation, index) => {
                                            if (parseFloat(donation.amount) > 0) {
                                                return (
                                                    <div key={index} className="donation">
                                                        <a
                                                            href={
                                                                activeChain.etherscan +
                                                                `/address/${donation.donor}`
                                                            }
                                                            target="_blank"
                                                        >
                                                            {" "}
                                                            <FaEthereum color="#02ba23" />
                                                            <div>
                                                                {account.toLowerCase() !=
                                                                donation.donor.toLowerCase()
                                                                    ? donation.donor
                                                                    : "You"}{" "}
                                                                donated {donation.amount}ETH
                                                            </div>
                                                        </a>
                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <div key={index} className="donation refund">
                                                        <a
                                                            href={
                                                                "https://etherscan.io/address/" +
                                                                `${donation.donor}`
                                                            }
                                                            target="_blank"
                                                        >
                                                            {" "}
                                                            <FaEthereum color="#02ba23" />
                                                            <div>
                                                                {account.toLowerCase() !=
                                                                donation.donor.toLowerCase()
                                                                    ? donation.donor
                                                                    : "You"}{" "}
                                                                got a refund of {donation.amount}
                                                                ETH
                                                            </div>
                                                        </a>
                                                    </div>
                                                )
                                            }
                                        })}
                                    {numDonations > 5 &&
                                        listBottomIndex != donationList.length - 1 && (
                                            <a className="read-more-button">
                                                <RiArrowDownSLine
                                                    className="read-more-button-circle"
                                                    onClick={() => {
                                                        setListTopIndex((oldValue) => {
                                                            return oldValue + 1
                                                        })
                                                        setListBottomIndex((oldValue) => {
                                                            return oldValue + 1
                                                        })
                                                    }}
                                                    size="1.5em"
                                                />
                                            </a>
                                        )}
                                </div>
                                <div
                                    className="share-module"
                                    onMouseEnter={() => {
                                        toggleShowShareModal(true)
                                    }}
                                    onClick={() => {
                                        if (!showShareModal) {
                                            toggleShowShareModal(true)
                                        }
                                    }}
                                >
                                    {showShareModal ? (
                                        <>
                                            {" "}
                                            <a
                                                className="share-icon"
                                                href={`https://twitter.com/intent/tweet?text=Donate%20to%20${name?.replace(
                                                    / /g,
                                                    "%20"
                                                )}'s%20campaign%20"${causeName?.replace(
                                                    / /g,
                                                    "%20"
                                                )}"%20${shareURL}`}
                                                target="_blank"
                                            >
                                                <IoLogoTwitter
                                                    color="#02ba23"
                                                    size={iconSize.twitter}
                                                    onMouseEnter={(e) => {
                                                        setIconSize({ ...iconSize, twitter: "3em" })
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        setIconSize({ ...iconSize, twitter: "2em" })
                                                    }}
                                                />
                                            </a>
                                            <a
                                                className="share-icon"
                                                href={`https://www.facebook.com/sharer/sharer.php?u=${shareURL}`}
                                                target="_blank"
                                                rel="noopener"
                                            >
                                                <IoLogoFacebook
                                                    color="#02ba23"
                                                    size={iconSize.faceBook}
                                                    onMouseEnter={(e) => {
                                                        setIconSize({
                                                            ...iconSize,
                                                            faceBook: "3em",
                                                        })
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        setIconSize({
                                                            ...iconSize,
                                                            faceBook: "2em",
                                                        })
                                                    }}
                                                />
                                            </a>
                                            <a
                                                className="share-icon"
                                                href={`mailto:sample@gmail.com?subject=Donate%20to%20${name?.replace(
                                                    / /g,
                                                    "%20"
                                                )}'s%20campaign%20"${causeName?.replace(
                                                    / /g,
                                                    "%20"
                                                )}"%20${shareURL}`}
                                                target="_blank"
                                            >
                                                <SiGmail
                                                    color="#02ba23"
                                                    size={iconSize.email}
                                                    onMouseEnter={(e) => {
                                                        setIconSize({ ...iconSize, email: "3em" })
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        setIconSize({ ...iconSize, email: "2em" })
                                                    }}
                                                />
                                            </a>
                                            <a
                                                className="share-icon"
                                                href={qrCode}
                                                download={`${id}-${causeName}-QRCode.png`}
                                            >
                                                <RiQrCodeLine
                                                    color="#02ba23"
                                                    size={iconSize.instagram}
                                                    onMouseEnter={(e) => {
                                                        setIconSize({
                                                            ...iconSize,
                                                            instagram: "3em",
                                                        })
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        setIconSize({
                                                            ...iconSize,
                                                            instagram: "2em",
                                                        })
                                                    }}
                                                />
                                            </a>
                                            <a className="share-icon">
                                                <RiFileCopyLine
                                                    color="#02ba23"
                                                    size={iconSize.copyToClip}
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(shareURL)
                                                        dispatch({
                                                            title: "Copied!",
                                                            message:
                                                                "Campaign link copied to clipboard",
                                                            icon: "bell",
                                                            position: "topR",
                                                            type: "success",
                                                        })
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        setIconSize({
                                                            ...iconSize,
                                                            copyToClip: "3em",
                                                        })
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        setIconSize({
                                                            ...iconSize,
                                                            copyToClip: "2em",
                                                        })
                                                    }}
                                                />
                                            </a>
                                        </>
                                    ) : (
                                        <>
                                            <span id="share-text">
                                                SHARE {"  "}
                                                <FaShareSquare color="#02ba23" />
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <UnsupportedChain />
                </>
            )}
        </div>
    )
}

export default Cause
