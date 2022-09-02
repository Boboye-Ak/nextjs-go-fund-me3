import { ConnectButton } from "web3uikit"
import Link from "next/link"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { crowdFunderABI, crowdFunderAddresses } from "../constants"
import Dropdown from "./dropdown"
import Causes from "../pages/causes"

export default function Header({ amICauseOwner, amICrowdFunderOwner }) {
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
        const myCauseFromCall = (await getMyCauseId())?.toString()
        if (myCauseFromCall != "0") {
            setDoIHaveACause(true)
            setMyCauseId(myCauseFromCall?.toString())
        } else {
            setDoIHaveACause(false)
            setMyCauseId(myCauseFromCall?.toString())
        }
    }
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled, account])
    return (
        <div
            className="header"
            style={
                !chainId?.length
                    ? { position: "relative", bottom: "100%" }
                    : { position: "relative", bottom: "0" }
            }
        >
            <div className="dropdown-menu">
                {" "}
                <Dropdown
                    title="MENU"
                    items={[
                        { name: "SEARCH", link: "/" },
                        { name: "CAUSES", link: `/causes/` },
                        {
                            name: doIHaveACause ? "MY CAUSE" : "CREATE CAUSE",
                            link: doIHaveACause ? `/causes/${myCauseId}` : "/createcause",
                        },
                        { name: "ABOUT SITE", link: "/about" },
                        { name: "SPONSOR SITE", link: "" },
                    ]}
                />
            </div>

            <div>
                <Link href="/">
                    <img src="/crowdfunder-tentative-logo.png" className="header-image"></img>
                </Link>
            </div>

            <div>
                {" "}
                {amICauseOwner && <div>Logged in as the Cause Owner</div>}
                {amICrowdFunderOwner && (
                    <div className="logged-in-as">Logged in as the Site Admin</div>
                )}
                <div className="connect-button">
                    <ConnectButton moralisAuth={false} />
                </div>
            </div>
        </div>
    )
}
