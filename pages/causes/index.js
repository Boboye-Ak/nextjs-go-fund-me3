import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { crowdFunderAddresses, crowdFunderABI, causeABI } from "../../constants"
import { useNotification } from "web3uikit"
import Header from "../../components/Header"

const Causes = () => {
    const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const crowdFunderAddress =
        chainId in crowdFunderAddresses ? crowdFunderAddresses[chainId][0] : null
    const dispatch = useNotification()
    const [causes, setCauses] = useState([])
    const [numCauses, setNumCauses] = useState(0)

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
        let numCausesFromCall = await getLatestCauseId()
        numCausesFromCall = parseInt(numCausesFromCall?.toString())
        setNumCauses(numCausesFromCall)
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
        for (let n = numCausesFromCall; n > 0; n--) {
            getCauseByIdOptions.params.causeId = n
            causeAddress = (await getCauseById({ params: getCauseByIdOptions }))?.toString()
            console.log(causeAddress)
            getCauseNameOptions.contractAddress = causeAddress
            causeName = await getCauseName({ params: getCauseNameOptions })
            let causeObject = { causeId: n, causeAddress: causeAddress, causeName: causeName }
            console.log(causeObject)
            causeArray.push(causeObject)
        }
        setCauses(causeArray)
    }

    //USEEFFECTS
    useEffect(() => {
        if (isWeb3Enabled) {
            createCauseArray()
        }
    }, [isWeb3Enabled])
    useEffect(() => {
        if (isWeb3Enabled && numCauses) {
        }
    }, [isWeb3Enabled, numCauses])
    return (
        <div>
            <Header />
            <div className="causes-table">
                <div className="cause-table-header">
                    <div className="cause-table-item">Cause Name</div>
                    <div className="cause-table-item">Cause ID</div>
                    <div className="cause-table-item">Cause Address</div>
                </div>
                {causes.map((cause) => {
                    return (
                        <div key={cause.causeId} className="cause-table-row">
                            <div className="cause-table-item">{cause.causeName}</div>
                            <div className="cause-table-item">{cause.causeId}</div>
                            <div className="cause-table-item">{cause.causeAddress}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Causes
