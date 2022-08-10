import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import Link from "next/link"
import { useNotification } from "web3uikit"
import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useRouter } from "next/router"
import { crowdFunderAddresses, crowdFunderABI, nullAddress } from "../constants"
import { ethers } from "ethers"

export default function Home() {
    const router = useRouter()
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const crowdFunderAddress =
        chainId in crowdFunderAddresses ? crowdFunderAddresses[chainId][0] : null
    const [searchText, setSearchText] = useState("")
    const [causeId, setCauseId] = useState("0")
    const [myCauseId, setMyCauseId] = useState("0")
    const [causeAddress, setCauseAddress] = useState("")
    const [error, setError] = useState("")
    const [doIHaveACause, setDoIHaveACause] = useState(false)
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
    const { runContractFunction: getMyCauseId } = useWeb3Contract({
        abi: crowdFunderABI,
        contractAddress: crowdFunderAddress,
        functionName: "getMyCauseId",
        params: {},
    })

    const searchByCauseId = async () => {
        console.log("searching by cause ID")
        const causeIdFromCall = await getCauseById({
            onError: (error) => {
                console.log(error)
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
        console.log("trying to get Cause ID by Cause Address")
        causeIdFromCall = await getCauseIdByCauseAddress()
        if (!causeIdFromCall || causeIdFromCall?.toString() == "0") {
            console.log("trying to get cause Id from Owner wallet")
            causeIdFromCall = await getCauseIdByOwnerAddress({
                onSuccess: () => {
                    console.log("gotten causeID from owner wallet")
                },
            })
            console.log(causeIdFromCall?.toString())
            console.log(causeIdFromCall?.toString())
            if (!causeIdFromCall || causeIdFromCall?.toString() == "0") {
                setError("This Address is not a cause and has no cause")
            }
            setError("")
            setCauseId(causeIdFromCall?.toString())
        }
        setError("")
        setCauseId(causeIdFromCall?.toString())
    }

    const search = async () => {
        if (ethers.utils.isAddress(searchText)) {
            await searchByAddress()
        } else if (!isNaN(searchText)) {
            await searchByCauseId()
        } else {
            setError("Please enter a valid address or Cause ID")
        }
    }

    const updateUI = async () => {
        const myCauseFromCall = (await getMyCauseId())?.toString()
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
    }, [isWeb3Enabled, account, myCauseId])

    useEffect(() => {
        if (isWeb3Enabled) {
            router.push(`./cause/${causeId}`)
        }
    }, [causeId])
    return (
        <div className={styles.container}>
            <Head>
                <title>Go Fund Me 3</title>
                <meta name="description" content="A Web3 CrowdFunding Website" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header/>
            <input
                type="text"
                onChange={(e) => {
                    handleTextChange(e)
                }}
                value={searchText}
                placeholder="CAUSE ID, CAUSE OWNER ADDRESS, CAUSE ADDRESS"
            ></input>
            <p>{error ? error : causeId}</p>
            <button
                onClick={async (e) => {
                    await search()
                }}
            >
                SEARCH
            </button>
            <Link href="/cause/1">Link to Cause with ID 1</Link>
        </div>
    )
}
