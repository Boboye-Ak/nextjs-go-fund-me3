import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import { useNotification } from "web3uikit"
import { useState } from "react"
import { useMoralis } from "react-moralis"
import { crowdFunderAddresses, crowdFunderABI, nullAddress } from "../constants"
import { useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"

export default function Home() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const crowdFunderAddress =
        chainId in crowdFunderAddresses ? crowdFunderAddresses[chainId][0] : null
    const [searchText, setSearchText] = useState("")
    const [causeId, setCauseId] = useState("0")
    const [error, setError] = useState("")

    const dispatch = useNotification()

    //Web3 Functions

    const search = async () => {
        let causeIdFromCall
        if (ethers.utils.isAddress(searchText) || !isNaN(searchText)) {
            if (ethers.utils.isAddress(searchText)) {
                //check if it is a cause Address
                const {
                    runContractFunction: getCauseIdByCauseAddress,
                    isFetching,
                    isLoading,
                } = useWeb3Contract({
                    abi: crowdFunderABI,
                    contractAddress: crowdFunderAddress,
                    functionName: "getCauseIdByCauseAddress",
                    params: { arguments: [searchText] },
                })
                causeIdFromCall = (await getCauseIdByCauseAddress()).toString()
                if (!causeIdFromCall) {
                    //check if it is an owner wallet
                    const {
                        runContractFunction: getCauseIdByOwnerWallet,
                        isFetching: isFetching2,
                        isLoading: isLoading2,
                    } = useWeb3Contract({
                        abi: crowdFunderABI,
                        contractAddress: crowdFunderAddress,
                        functionName: "getCauseIdByOwnerWallet",
                        params: { arguments: [searchText] },
                    })
                    causeIdFromCall = (await getCauseIdByOwnerWallet()).toString()
                }
            }
            if (!isNaN(searchText)) {
                const { runContractFunction: getCauseById } = useWeb3Contract({
                    abi: crowdFunderABI,
                    contractAddress: crowdFunderAddress,
                    functionName: "getCauseById",
                    params: { arguments: [searchText] },
                })
                let addressFromCall=(await getCauseById()).toString()
                if(addressFromCall==nullAddress){
                  setError("Invalid Cause ID entered")
                }else{
                  causeIdFromCall=searchText
                }

            }
            setCauseId(causeIdFromCall)
        } else {
            setError("Please enter an address or Cause ID")
        }
    }
    return (
        <div className={styles.container}>
            <Head>
                <title>Go Fund Me 3</title>
                <meta name="description" content="A Web3 CrowdFunding Website" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <input
                type="text"
                value={searchText}
                onChange={(e) => {
                    setSearchText(e.target.value)
                }}
                placeholder="CAUSE ID, CAUSE OWNER ADDRESS, CAUSE ADDRESS"
            ></input>
            <button>SEARCH</button>
        </div>
    )
}
