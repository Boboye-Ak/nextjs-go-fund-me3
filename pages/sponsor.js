import axios from "axios"
import Header from "../components/Header"
import { crowdFunderAddresses, crowdFunderABI } from "../constants"
import { convertEthToWei } from "../utils/converter"
import UnsupportedChain from "../components/unsupported-chain"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import { useEffect, useState } from "react"
import { FaEthereum } from "react-icons/fa"

const Sponsor = () => {
    const dispatch = useNotification()
    const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const crowdFunderAddress =
        chainId in crowdFunderAddresses ? crowdFunderAddresses[chainId][0] : null

    const [donationAmount, setDonationAmount] = useState("")
    const [dollarEquivalent, setDollarEquivalent] = useState("")
    const [donationAmountW, setDonationAmountW] = useState("0")
    const [ethPrice, setEthPrice] = useState(0)

    const {
        runContractFunction: sponsorSite,
        isFetching: sponsorIsFetching,
        isLoading: sponsorIsLoading,
    } = useWeb3Contract({
        abi: crowdFunderABI,
        contractAddress: crowdFunderAddress,
        functionName: "sponsorSite",
        params: {},
        msgValue: donationAmountW,
    })

    const handleDonate = async () => {
        await sponsorSite({
            onSuccess: async (tx) => {
                await tx.wait(1)
                dispatch({
                    type: "success",
                    title: "Sponsorship successful",
                    message: "The developer greatly appreciates your contribution.",
                    position: "topR",
                    icon: "bell",
                })
            },
            onError: () => {
                dispatch({
                    type: "error",
                    title: "Sponsorship Error",
                    message: "There was an error processing your contribution",
                    position: "topR",
                    icon: "bell",
                })
            },
        })
    }

    const getEthPrice = async () => {
        const res = await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=ETHBUSD")
        setEthPrice(parseFloat(res.data.price))
    }

    useEffect(() => {
        getEthPrice()
    }, [])

    useEffect(() => {
        if (donationAmount) {
            setDonationAmountW(convertEthToWei(donationAmount))
        }
    }, [donationAmount])
    return (
        <div>
            <Header />
            {crowdFunderAddress ? (
                <>
                    <div
                        style={{
                            height: "80vh",
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div className="sponsor-donate-module">
                            {" "}
                            <div className="input-bar">
                                <input
                                    type="number"
                                    value={donationAmount}
                                    placeholder="(ETH)"
                                    onChange={(e) => {
                                        setDonationAmount(e.target.value)
                                        if (parseFloat(e.target.value) < 0) {
                                            setDonationAmount("0")
                                            setDollarEquivalent("0")
                                        }
                                        if (e.target.value != "") {
                                            setDollarEquivalent(
                                                (parseFloat(e.target.value) * ethPrice)
                                                    ?.toFixed(2)
                                                    ?.toString()
                                            )
                                        } else {
                                            setDollarEquivalent("")
                                        }
                                    }}
                                ></input>
                                <span>
                                    <FaEthereum />
                                </span>
                            </div>
                            <div style={{ fontWeight: "bolder" }}>OR</div>
                            <div className="input-bar">
                                <input
                                    type="number"
                                    value={dollarEquivalent}
                                    placeholder="(USD)"
                                    onChange={(e) => {
                                        setDollarEquivalent(e.target.value)
                                        if (parseFloat(e.target.value) < 0) {
                                            setDollarEquivalent("0")
                                            setDonationAmount("0")
                                        }
                                        if (
                                            e.target.value != "" &&
                                            parseFloat(e.target.value) >= 0
                                        ) {
                                            setDonationAmount(
                                                (parseFloat(e.target.value) / ethPrice)
                                                    ?.toFixed(8)
                                                    ?.toString()
                                            )
                                        } else {
                                            setDonationAmount("")
                                        }
                                    }}
                                ></input>
                                <div style={{ fontWeight: "bolder", fontSize: "1.5em" }}>$</div>
                            </div>
                            <button
                                onClick={handleDonate}
                                disabled={sponsorIsFetching || sponsorIsLoading}
                            >
                                SPONSOR
                            </button>
                        </div>
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

export default Sponsor
