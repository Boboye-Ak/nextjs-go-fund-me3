import { AiFillInfoCircle } from "react-icons/ai"
const UnsupportedChain = () => {
    return (
        <div className="container-404">
            <div className="text-404">
                <h1>UNSUPPORTED CHAIN</h1>
                <p>WE DO NOT CURRENTLY HAVE A CONTRACT ON THIS CHAIN. PLEASE SWITCH TO RINKEBY</p>
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
