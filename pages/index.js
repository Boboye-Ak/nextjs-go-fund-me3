import Head from "next/head"
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
    const handleTextChange = (e) => {
        setSearchText(e.target.value)
    }

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

    const searchByCauseId = async () => {
        const causeIdFromCall = await getCauseById({
            onError: (error) => {
                setError("Invalid Cause ID")
                dispatch({
                    type: "info",
                    title: "Cannot Find Cause",
                    position: "topR",
                    icon: "bell",
                    message: "Please Enter a valid Cause ID",
                })
            },
            onSuccess: () => {
                setCauseId(searchText)
                setError("")
            },
        })
    }

    const searchByAddress = async () => {
        let causeIdFromCall
        let errorObject = { error: true }
        let successObject = { success: true }
        causeIdFromCall = await getCauseIdByCauseAddress()
        if (!causeIdFromCall || causeIdFromCall?.toString() == "0") {
            causeIdFromCall = await getCauseIdByOwnerAddress({
                onSuccess: () => {},
                onError: () => {
                    dispatch({
                        title: "Error getting cause",
                        message: "There was an error getting the cause please try again",
                        type: "error",
                        icon: "bell",
                        position: "topR",
                    })
                },
            })

            if (!causeIdFromCall || causeIdFromCall?.toString() == "0") {
                setError("This Address is not a cause and has no cause")
                return errorObject
            }

            setCauseId(causeIdFromCall?.toString())
        }
        setError("")
        setCauseId(causeIdFromCall?.toString())
    }

    const search = async () => {
        let res
        if (ethers.utils.isAddress(searchText)) {
            res = await searchByAddress()
        } else if (!isNaN(searchText)) {
            await searchByCauseId()
        } else {
            setError("Please enter a valid address or Cause ID")
        }
    }

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
    }, [isWeb3Enabled, crowdFunderOwner, account])

    return (
        <div>
            <Head>
                <title>Go Fund Me 3</title>
                <meta name="description" content="A Web3 CrowdFunding Website" />
                <link rel="icon" href="/crowdfunder-tentative-logo.ico" />
            </Head>
            <Header amICauseOwner={false} amICrowdFunderOwner={amICrowdFunderOwner} />
            <div className="big-search">
                <BigSearchModule />
            </div>
        </div>
    )
}
