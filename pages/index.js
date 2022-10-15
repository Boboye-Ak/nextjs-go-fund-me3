
import Image from "next/image"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import Link from "next/link"
import { RiSearch2Line } from "react-icons/ri"
import { useNotification } from "web3uikit"
import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useRouter } from "next/router"
import { crowdFunderAddresses, crowdFunderABI, nullAddress } from "../constants"
import { ethers } from "ethers"
import BigSearchModule from "../components/big-search-module"
import UnsupportedChain from "../components/unsupported-chain"

export default function Home() {
    const router = useRouter()
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const crowdFunderAddress =
        chainId in crowdFunderAddresses ? crowdFunderAddresses[chainId][0] : null
    const [searchText, setSearchText] = useState("")
    const [causeId, setCauseId] = useState("0")
    const [crowdFunderOwner, setCrowdFunderOwner] = useState("")
    const [amICrowdFunderOwner, setAmICrowdFunderOwner] = useState(false)
    const [error, setError] = useState("")
    const dispatch = useNotification()

    //Web3 Functions
    const {
        runContractFunction: getCauseIdByCauseAddress,
        isFetching,
        isLoading,
    } = useWeb3Contract({
        abi: crowdFunderABI,
        contractAddress: crowdFunderAddress,
        functionName: "getCauseIdByCauseAddress",
        params: { causeAddress: searchText },
    })

    const { runContractFunction: getCauseIdByOwnerAddress } = useWeb3Contract({
        abi: crowdFunderABI,
        contractAddress: crowdFunderAddress,
        functionName: "getCauseIdByOwnerAddress",
        params: { owner: searchText },
    })

    const { runContractFunction: getCauseById } = useWeb3Contract({
        abi: crowdFunderABI,
        contractAddress: crowdFunderAddress,
        functionName: "getCauseById",
        params: { causeId: searchText },
    })

    const { runContractFunction: getContractOwner } = useWeb3Contract({
        abi: crowdFunderABI,
        contractAddress: crowdFunderAddress,
        functionName: "getContractOwner",
        params: {},
    })

    const updateUI = async () => {
        const crowdFunderOwnerFromCall = (await getContractOwner())?.toString()
        setCrowdFunderOwner(crowdFunderOwnerFromCall)
    }

    useEffect(() => {
        updateUI()
    }, [isWeb3Enabled])

    useEffect(() => {
        if (isWeb3Enabled && crowdFunderOwner) {
            if (crowdFunderOwner?.toLowerCase() == account.toLowerCase()) {
                setAmICrowdFunderOwner(true)
            } else {
                setAmICrowdFunderOwner(false)
            }
        }
    }, [isWeb3Enabled, crowdFunderOwner, account, chainIdHex])

    return (
        <div>

            <Header amICauseOwner={false} amICrowdFunderOwner={amICrowdFunderOwner} />
            {crowdFunderAddress ? (
                <>
                    {" "}
                    <div className="big-search">
                        <BigSearchModule />
                    </div>
                    <div style={{ textAlign: "center", textDecoration: "underline" }}>
                        <Link href="/causes">All Causes</Link>
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
