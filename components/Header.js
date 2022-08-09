import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header({doIHaveACause}) {
    return (
        <div className="header">
            {doIHaveACause ? (
                <button>
                    <Link href="">My Cause</Link>
                </button>
            ) : (
                <button>Create Cause</button>
            )}

            <ConnectButton moralisAuth={false} />
        </div>
    )
}
