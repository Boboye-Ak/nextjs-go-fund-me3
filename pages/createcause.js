import { useEffect, useState } from "react"
import Header from "../components/Header"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useRouter } from "next/router"
import { crowdFunderABI, crowdFunderAddresses } from "../constants"
import { convertEthToWei } from "../utils/converter"
import { useNotification } from "web3uikit"
import ethers from "ethers"
const CreateCause = () => {
    const router = useRouter()
    const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const crowdFunderAddress =
        chainId in crowdFunderAddresses ? crowdFunderAddresses[chainId][0] : null
    const dispatch = useNotification()
    const [causeName, setCauseName] = useState("")
    const [goal, setGoal] = useState("")
    const [hasCause, setHasCause] = useState(null)

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
        params: { causeName: causeName, goal: convertEthToWei(goal) },
    })

    //EVENT HANDLER FUNCTIONS
    const handleCreate = async (e) => {
        console.log("creating cause")
        e.preventDefault()
        createCause({
            onSuccess: async (tx) => {
                await tx.wait(1)
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

    //USEEFFECTS
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])
    return (
        <div>
            <Header amICauseOwner={false} amICrowdFunderOwner={false} />
            <form className="create-cause-form">
                <input
                    type="text"
                    value={causeName}
                    placeholder="Cause Name"
                    onChange={(e) => {
                        setCauseName(e.target.value)
                    }}
                    maxlength="30"
                ></input>
                <input
                    type="number"
                    value={goal}
                    placeholder="Target Amount for Donations(in ETH)"
                    onChange={(e) => {
                        setGoal(e.target.value)
                    }}
                ></input>
                <button
                    onClick={handleCreate}
                    disabled={createCauseIsFetching || createCauseIsLoading}
                >
                    CREATE CAUSE
                </button>
            </form>
        </div>
    )
}

export default CreateCause
