import { RiSearch2Line } from "react-icons/ri"
import { crowdFunderAddresses, crowdFunderABI } from "../constants"
import { useNotification } from "web3uikit"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { ethers } from "ethers"
import { useState } from "react"

const BigSearchModule = () => {
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const crowdFunderAddress =
        chainId in crowdFunderAddresses ? crowdFunderAddresses[chainId][0] : null
    const dispatch = useNotification()
    const [searchText, setSearchText] = useState("")
    const [causeId, setCauseId] = useState("0")
    const [searched, setSearched] = useState(false)

    const {
        runContractFunction: getCauseIdByCauseAddress,
        isFetching: causeIdByCauseAddressIsFetching,
        isLoading: causeIdByCauseAddressIsLoading,
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

    const searchByAddress = async () => {
        let causeIdFromCall
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
                return "0"
            }
            return causeIdFromCall?.toString()
        }

        return causeIdFromCall?.toString()
    }

    const searchByCauseId = async () => {
        const causeIdFromCall = await getCauseById({
            onError: (error) => {
                console.log(error)
                setCauseId("0")
                setSearched(true)
            },
            onSuccess: () => {
                setCauseId(searchText)
                setSearched(true)
            },
        })
    }
    const search = async () => {
        let res
        if (ethers.utils.isAddress(searchText)) {
            res = await searchByAddress()
            if (res && res != "0") {
                setCauseId(res)
                setSearched(true)
            }
        } else if (!isNaN(searchText)) {
            await searchByCauseId()
        } else {
            setSearched(true)
        }
    }

    return (
        <div className="big-search-module">
            <div className="big-search-bar">
                {" "}
                <input
                    id="big-search-bar-input"
                    type="text"
                    onChange={(e) => {
                        setSearchText(e.target.value)
                    }}
                    value={searchText}
                    placeholder="CAUSE ID, CAUSE OWNER ADDRESS, CAUSE ADDRESS"
                ></input>
                <RiSearch2Line
                    size="2.2em"
                    onClick={async (e) => {
                        await search()
                    }}
                />
            </div>
            {searched &&
                (causeId != "0" ? (
                    <a href={`/causes/${causeId}`} target="_blank">
                        <div className="big-search-result">Cause #{causeId}</div>
                    </a>
                ) : (
                    <div className="big-search-result">No result was found for this search</div>
                ))}
        </div>
    )
}

export default BigSearchModule
