import { AiFillInfoCircle } from "react-icons/ai"
import { ConnectButton } from "web3uikit"
const UnsupportedChain = () => {
    return (
        <div className="container-404">
            <div className="text-404">
                <h1>UNSUPPORTED CHAIN/NO WALLET</h1>
                <p>PLEASE SWITCH TO RINKEBY NETWORK AND CONNECT YOUR WALLET</p>
                <a href="/about">
                    {" "}
                    <button>
                        GO TO ABOUT PAGE{"  "}
                        <AiFillInfoCircle />
                    </button>
                </a>
            </div>

            <img src="/unsupported chain/unsupported-chain-img.jpeg"></img>
        </div>
    )
}

export default UnsupportedChain
