import { useEffect, useState } from "react"
import Header from "../components/Header"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useRouter } from "next/router"
import { crowdFunderABI, crowdFunderAddresses } from "../constants"
import { convertEthToWei } from "../utils/converter"
import { useNotification } from "web3uikit"
import Dropdown from "../components/dropdown"
import axios from "axios"
import ethers from "ethers"
import { FaEthereum } from "react-icons/fa"
const CreateCause = () => {
    const router = useRouter()
    const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const crowdFunderAddress =
        chainId in crowdFunderAddresses ? crowdFunderAddresses[chainId][0] : null
    const dispatch = useNotification()
    const [causeName, setCauseName] = useState("")
    const [goalEth, setGoalEth] = useState("")
    const [goalDoll, setGoalDoll] = useState("")
    const [ethPrice, setEthPrice] = useState(0)
    const [message, setMessage] = useState("")
    const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useState(null)

    //WEB3 VIEW FUNCTIONS
    const { runContractFunction: getMyCauseId } = useWeb3Contract({
        abi: crowdFunderABI,
        contractAddress: crowdFunderAddress,
        functionName: "getMyCauseId",
        params: {},
    })

    //WEB3 PURE FUNCTIONS
    const {
        runContractFunction: createCause,
        isFetching: createCauseIsFetching,
        isLoading: createCauseIsLoading,
    } = useWeb3Contract({
        abi: crowdFunderABI,
        contractAddress: crowdFunderAddress,
        functionName: "createCause",
        params: { causeName: causeName, goal: convertEthToWei(goalEth) },
    })

    //EVENT HANDLER FUNCTIONS
    const handleCreate = async (e) => {
        console.log("creating cause")
        e.preventDefault()
        createCause({
            onSuccess: async (tx) => {
                setIsAwaitingConfirmation(true)
                await tx.wait(1)
                setIsAwaitingConfirmation(false)
                dispatch({
                    title: "New Cause Created",
                    message:
                        "You have created a new cause, please enter description and set Profile picture",
                    position: "topR",
                    type: "success",
                    icon: "bell",
                })
                await updateUI()
            },
            onError: async () => {
                dispatch({
                    title: "Error creating cause",
                    message: "There was an error creating the new cause",
                    position: "topR",
                    type: "error",
                    icon: "bell",
                })
            },
        })
    }

    const updateUI = async () => {
        getMyCauseId().then((res) => {
            if (res?.toString() != "0") {
                router.push(`/causes/${res?.toString()}`)
            }
        })
    }
    const getEthPrice = async () => {
        const res = await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=ETHBUSD")
        setEthPrice(parseFloat(res.data.price))
    }

    //USEEFFECTS
    useEffect(() => {
        getEthPrice()
    }, [])
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled, chainIdHex, account])
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
    return (
        <div>
            <Header amICauseOwner={false} amICrowdFunderOwner={false} />
            <form className="create-cause-form">
                <input
                    type="text"
                    value={causeName}
                    placeholder="Cause Name(eg I needs a new phone)"
                    onChange={(e) => {
                        setCauseName(e.target.value)
                    }}
                    maxLength="30"
                ></input>
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
                            value={goalEth}
                            placeholder="Target(ETH)"
                            onChange={(e) => {
                                setGoalEth(e.target.value)
                                if (e.target.value != "") {
                                    setGoalDoll(
                                        (parseFloat(e.target.value) * ethPrice)
                                            ?.toFixed(2)
                                            ?.toString()
                                    )
                                } else {
                                    setGoalDoll("")
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
                            value={goalDoll}
                            placeholder="Target (USD)"
                            onChange={(e) => {
                                setGoalDoll(e.target.value)
                                if (e.target.value != "") {
                                    setGoalEth(
                                        (parseFloat(e.target.value) / ethPrice)
                                            ?.toFixed(5)
                                            ?.toString()
                                    )
                                } else {
                                    setGoalEth("")
                                }
                            }}
                        ></input>
                        <div style={{ fontWeight: "bolder", fontSize: "1.5em" }}>$</div>
                    </div>
                </div>

                <button
                    onClick={handleCreate}
                    disabled={
                        createCauseIsFetching || createCauseIsLoading || isAwaitingConfirmation
                    }
                >
                    CREATE CAUSE
                </button>
            </form>

            <div>{message}...</div>
        </div>
    )
}

export default CreateCause
