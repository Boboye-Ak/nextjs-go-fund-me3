import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { crowdFunderAddresses, crowdFunderABI, causeABI, chains } from "../../constants"
import { useNotification } from "web3uikit"
import Header from "../../components/Header"
import { RiArrowDownSLine } from "react-icons/ri"
import { siteURL } from "../../nextjs.helper.config"
import BigSearchModule from "../../components/big-search-module"
import UnsupportedChain from "../../components/unsupported-chain"
import Link from "next/link"

const Causes = () => {
    const perPage = 10
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
    const [causes, setCauses] = useState([])
    const [numCauses, setNumCauses] = useState(0)
    const [topIndex, setTopIndex] = useState(null)
    const [bottomIndex, setBottomIndex] = useState(null)

    const {
        runContractFunction: getLatestCauseId,
        isFetching: latestCauseIdIsFetching,
        isLoading: latestCauseIdIsLoading,
    } = useWeb3Contract({
        abi: crowdFunderABI,
        contractAddress: crowdFunderAddress,
        functionName: "getLatestCauseId",
        params: {},
    })
    const { runContractFunction: getCauseById } = useWeb3Contract()
    const { runContractFunction: getCauseName } = useWeb3Contract()

    const createCauseArray = async () => {
        let causeAddress, causeName
        let causeArray = []
        let getCauseByIdOptions = {
            abi: crowdFunderABI,
            contractAddress: crowdFunderAddress,
            functionName: "getCauseById",
            params: { causeId: null },
        }
        let getCauseNameOptions = {
            abi: causeABI,
            contractAddress: null,
            functionName: "getCauseName",
            params: {},
        }
        for (let n = topIndex; n > bottomIndex; n--) {
            getCauseByIdOptions.params.causeId = n
            causeAddress = (await getCauseById({ params: getCauseByIdOptions }))?.toString()
            getCauseNameOptions.contractAddress = causeAddress
            causeName = await getCauseName({ params: getCauseNameOptions })
            let causeObject = { causeId: n, causeAddress: causeAddress, causeName: causeName }
            causeArray.push(causeObject)
        }
        setCauses(causeArray)
    }

    //USEEFFECTS
    useEffect(() => {
        if (isWeb3Enabled) {
            getLatestCauseId().then((res) => {
                const newTopIndex = parseInt(res?.toString())
                setTopIndex(newTopIndex)
            })
        }
    }, [isWeb3Enabled, chainIdHex])
    useEffect(() => {
        if (topIndex != null) {
            setBottomIndex((oldValue) => {
                if (topIndex - perPage < 0) {
                    return 0
                } else {
                    return topIndex - perPage
                }
            })
        }
    }, [topIndex])
    useEffect(() => {
        if (bottomIndex != null) {
            createCauseArray()
        }
    }, [bottomIndex])

    return (
        <div>
            <Header />
            {crowdFunderAddress ? (
                <>
                    {" "}
                    <div className="search-and-table">
                        <BigSearchModule />
                        <div className="causes-table">
                            <div className="cause-table-header">
                                <div className="cause-table-item">Cause Name</div>
                                <div className="cause-table-item">Cause ID</div>
                                <div className="cause-table-item address-column">Cause Address</div>
                            </div>
                            <div>
                                {causes.map((cause, index) => {
                                    return (
                                        <div key={cause.causeId}>
                                            <Link href={`/causes/${cause.causeId}`}>
                                                <div
                                                    key={cause.causeId}
                                                    className="cause-table-row"
                                                >
                                                    <div
                                                        className="cause-table-item"
                                                        style={{ color: "black" }}
                                                    >
                                                        {cause.causeName}
                                                    </div>
                                                    <div className="cause-table-id-item">
                                                        <a
                                                            href={
                                                                siteURL + "/causes/" + cause.causeId
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            #{cause.causeId}
                                                        </a>
                                                    </div>
                                                    <div className="cause-table-item cause-table-address-item address-column">
                                                        <a
                                                            href={
                                                                activeChain.etherscan +
                                                                "/address/" +
                                                                cause.causeAddress
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            {cause.causeAddress}
                                                        </a>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        {bottomIndex > 0 && (
                            <div
                                id="show-more-arrow"
                                onClick={() => {
                                    setBottomIndex((oldValue) => {
                                        if (oldValue - perPage < 0) {
                                            return 0
                                        } else {
                                            return oldValue - perPage
                                        }
                                    })
                                }}
                            >
                                <RiArrowDownSLine size="1.5em" color="#298e46" />
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div className="search-and-table">
                        <UnsupportedChain />
                    </div>
                </>
            )}
        </div>
    )
}

export default Causes
