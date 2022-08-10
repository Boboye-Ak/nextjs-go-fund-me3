import { ConnectButton } from "web3uikit"
import Link from "next/link"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { crowdFunderABI, crowdFunderAddresses } from "../constants"

export default function Header() {
    const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const crowdFunderAddress =
        chainId in crowdFunderAddresses ? crowdFunderAddresses[chainId][0] : null
    const [doIHaveACause, setDoIHaveACause] = useState(false)
    const [myCauseId, setMyCauseId] = useState("0")
    const { runContractFunction: getMyCauseId } = useWeb3Contract({
        abi: crowdFunderABI,
        contractAddress: crowdFunderAddress,
        functionName: "getMyCauseId",
        params: {},
    })
    const updateUI = async () => {
        const myCauseFromCall = (await getMyCauseId()).toString()
        if (myCauseFromCall != "0") {
            setDoIHaveACause(true)
            setMyCauseId(myCauseFromCall)
        } else {
            setDoIHaveACause(false)
            setMyCauseId(myCauseFromCall)
        }
    }
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled, account])
    return (
        <div className="header">
            {doIHaveACause ? (
                <button>
                    <Link href="">My Cause</Link>
                </button>
            ) : (
                <button>Create Cause</button>
            )}

            <ConnectButton moralisAuth={false} />
        </div>
    )
}
