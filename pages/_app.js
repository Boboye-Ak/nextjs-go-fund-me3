import "../styles/globals.css"
import Head from "next/head"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>CrowdFund3r</title>
                <meta
                    name="description"
                    content="A Web3 CrowdFunding Website for the ethereum blockchain"
                />
                <link rel="icon" href="/crowdfunder-tentative-logo.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <NotificationProvider>
                    <Component {...pageProps} />
                </NotificationProvider>
            </MoralisProvider>
        </div>
    )
}

export default MyApp
