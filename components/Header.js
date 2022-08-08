import { ConnectButton } from "web3uikit";
import Link from "next/link"

export default function Header() {
  return (
    <div className="header">
      <button><Link href="">My Cause</Link></button>
      <ConnectButton moralisAuth={false} />
    </div>
  );
}
