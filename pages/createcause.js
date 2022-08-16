import { useEffect, useState } from "react"
import Header from "../components/Header"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useRouter } from "next/router"
import { crowdFunderABI, crowdFunderAddresses } from "../constants"
import { useNotification } from "web3uikit"
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

    //WEB3 VIEW FUNCTION
    const { runContractFunction: getMyCauseId } = useWeb3Contract({
        abi: crowdFunderABI,
        contractAddress: crowdFunderAddress,
        functionName: "getMyCauseId",
        params: {},
    })

    //EVENT HANDLER FUNCTIONS
    const handleCreate = async (e) => {
        e.preventDefault()
    }

    //USEEFFECTS
    useEffect(() => {
        if (isWeb3Enabled) {
            getMyCauseId().then((res) => {
                if (res?.toString() != "0") {
                    router.push(`/cause/${res?.toString()}`)
                }
            })
        }
    }, [isWeb3Enabled])
    return (
        <div>
            <Header />
            Create Cause Page
            <form>
                <input
                    type="text"
                    value={causeName}
                    placeholder="Cause Name"
                    onChange={(e) => {
                        setCauseName(e.target.value)
                    }}
                ></input>
                <input
                    type="number"
                    value={goal}
                    placeholder="Target Amount for Donations(in ETH)"
                    onChange={(e) => {
                        setGoal(e.target.value)
                    }}
                ></input>
                <button onClick={handleCreate}>CREATE CAUSE</button>
            </form>
        </div>
    )
}

export default CreateCause
