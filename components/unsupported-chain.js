import { AiFillInfoCircle } from "react-icons/ai"
import { ConnectButton } from "web3uikit"
import { chains, crowdFunderAddresses, supportedChains } from "../constants"
import Link from "next/link"
const UnsupportedChain = () => {
    return (
        <div className="container-404">
            <div className="text-404">
                <h1>UNSUPPORTED CHAIN/NO WALLET</h1>
                <p>PLEASE SWITCH TO A SUPPORTED NETWORK AND CONNECT YOUR WALLET</p>
                <div>
                    Supported Networks:{" "}
                    {supportedChains.map((chain, index) => {
                        return (
                            <span key={index}>
                                {index != 0 && ","}
                                {chain.name}
                            </span>
                        )
                    })}
                </div>
                <Link href="/about">
                    {" "}
                    <button>
                        GO TO ABOUT PAGE{"  "}
                        <AiFillInfoCircle />
                    </button>
                </Link>
            </div>

            <img src="/unsupported chain/unsupported-chain-img.jpeg"></img>
        </div>
    )
}

export default UnsupportedChain
