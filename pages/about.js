import Header from "../components/Header"
import { supportedChains } from "../constants"

const About = () => {
    return (
        <div className="cause">
            <Header />
            <div className="container">
                <div className="body-and-donors">
                    <div className="cause-body" id="about-cause-body">
                        <div style={{ marginTop: "1em" }}>
                            <div
                                className="cause-name cause-owner-actual-name"
                                style={{ justifyContent: "center", fontSize: "2.5em" }}
                                id="about-the-site"
                            >
                                About The Site
                            </div>
                            <div className="cause-img">
                                <img src="/crowdfunder-tentative-logo.png" alt="" />
                            </div>
                            <h2 id="what-is-crowdfund3r" style={{ textAlign: "center" }}>
                                What is CrowdFund3r?
                            </h2>
                            <div className="about-paragraph">
                                CrowdFund3r is a web3 crowdfunding site built upon the ethereum
                                blockchain. It allows people in need of money to leverage web3
                                technology to get assistance from well meaning members of the public
                                while protecting the interest of the donors by granting them the
                                opportunity to retract their donations should they be provided with
                                new information that makes them want to. The website is controlled
                                at the backend by a{" "}
                                <a
                                    href="https://github.com/Boboye-Ak/hardhat-go-fund-me-3/blob/main/contracts/CrowdFunder.sol"
                                    style={{ color: "blue", textDecoration: "underline" }}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    CrowdFunder contract.
                                </a>{" "}
                                The site was built with NextJS and Solidity. As the site is still in
                                testing, it is only available on select chains({" "}
                                {supportedChains.map((chain, index) => {
                                    return (
                                        <>
                                            {index != 0 && ","}
                                            {chain.name}
                                        </>
                                    )
                                })}
                                ).
                            </div>
                            <h2 id="what-is-a-cause" style={{ textAlign: "center" }}>
                                What is a Cause?
                            </h2>
                            <div className="about-paragraph">
                                A Cause is a unit of the site that allows a user receive donations
                                and other users to make donations to them. Each cause is a product
                                of a{" "}
                                <a
                                    href="https://github.com/Boboye-Ak/hardhat-go-fund-me-3/blob/main/contracts/Cause.sol"
                                    style={{ color: "blue", textDecoration: "underline" }}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Cause contract.
                                </a>{" "}
                                Every cause has a unique numerical ID as well as a hexadecimal
                                (starts with &quot;0x&quot;) address. You can search for a cause
                                using either its ID, contract address or the address of the ethereum
                                wallet used to create it in either the search page or the search bar
                                of the &quot;causes&quot; page(can be reached via dropdown menu at
                                the top left).
                            </div>
                            <div className="cause-img for-pc">
                                <img
                                    src="about images/cause-page.png"
                                    style={{ width: "100%" }}
                                    alt="A typical cause page"
                                />
                            </div>
                            <h2 id="searches" style={{ textAlign: "center" }}>
                                Searches
                            </h2>
                            <div className="about-paragraph">
                                As stated above, the search bars in the home page and the causes can
                                find a cause based on the ID(Numerical Integer such as
                                &quot;1&quot;), cause contract address(hexadecimal beginning with
                                0x) and cause owner wallet address(hexadecimal beginning with 0x).
                                Attempts to search based on the Cause name or keywords will produce
                                no results.
                            </div>
                            <div className="cause-img for-pc">
                                <img
                                    src="about images/search-page.png"
                                    style={{ width: "100%" }}
                                    alt="Search Page"
                                />
                            </div>
                            <div className="cause-img for-pc">
                                <img
                                    src="about images/causes-page.png"
                                    style={{ width: "100%" }}
                                    alt="Causes Page"
                                />
                            </div>
                            <h2 id="donations" style={{ textAlign: "center" }}>
                                Donations
                            </h2>
                            <div className="about-paragraph">
                                Donations are made in ETH (the native token of the Ethereum
                                network). Donations to a cause are stored in the contract of the
                                cause and can only be withdrawn by the owner of the cause. Donations
                                are automatically disabled when the goal of the cause is reached or
                                exceeded. You can make donations to a cause by using the donation
                                module in the cause page or by directly transferring ethereum to the
                                cause contract. DO NOT SEND ERC20 TOKENS, NFTs OR NON-ETHEREUM
                                TOKENS TO THE CAUSE ADDRESS. THEY WILL BE LOST. YOU CAN SEND NFTs
                                AND NON-ETHEREUM TOKENS ON THE ETHEREUM NETWORK TO THE CAUSE OWNER
                                ADDRESS. BOTH THE CAUSE ADDRESS AND CAUSE OWNER ADDRESS ARE ON THE
                                CAUSE PAGE.
                            </div>
                            <h2 id="withdrawal" style={{ textAlign: "center" }}>
                                Withdrawal
                            </h2>
                            <div className="about-paragraph">
                                The owner of a cause can withdraw donations made to his cause at any
                                time irrespective of how much has been donated at the time of
                                withdrawal. 3% of donated funds return to the CrowdFunder contract
                                for the maintenance of the site. Donations can no longer be made
                                after withdrawal.
                            </div>
                            <h2 id="refunds" style={{ textAlign: "center" }}>
                                Refunds
                            </h2>
                            <div className="about-paragraph">
                                Donors to a cause can ask for refunds and get them immediately by
                                clicking the &quot;Demand Refund&quot; button in a cause page. You
                                can still make a donation after getting a refund but you cannot get
                                a refund after the owner of the cause has withdrawn donations.
                            </div>
                            <h2 id="closing" style={{ textAlign: "center" }}>
                                Closing/Opening to Donations
                            </h2>
                            <div className="about-paragraph">
                                The Cause Owner can choose to close his cause to donations. Donors
                                will be unable to make contributions while it is in that state. This
                                is different from locking/unlocking of causes.
                            </div>
                            <h2 id="locking" style={{ textAlign: "center" }}>
                                Locking/Unlocking of causes
                            </h2>
                            <div className="about-paragraph">
                                The site admin can choose to lock/unlock a cause if reports of
                                fraudulence are made. While in this state, donations cannot be made
                                to such a cause and the cause owner will be unable to withdraw the
                                funds in the cause. Donors who already made donations will be able
                                to get refunds. PS: The site admin cannot withdraw the funds in any
                                of the causes. Only the cause owners and donors are able to withdraw
                                money or get refunds respectively from the cause. This is different
                                from Closing/Opening causes to donation
                            </div>
                            <h2 id="sponsor" style={{ textAlign: "center" }}>
                                Sponsoring the Site
                            </h2>
                            <div className="about-paragraph">
                                You can show contribute to the maintenance of the site or show
                                appreciation to the developer(Just one for now) by making a donation
                                via the{" "}
                                <a
                                    href="/sponsor"
                                    style={{ color: "blue", textDecoration: "underline" }}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    sponsor page.
                                </a>{" "}
                            </div>
                            <h2 id="sharing" style={{ textAlign: "center" }}>
                                Sharing
                            </h2>
                            <div className="about-paragraph">
                                You can share the link using the share modal on the right side bar
                                of the cause page. The modal provides the options of sharing via a
                                tweet, a facebook post, Email, downloading a QR code that links to
                                the cause or copying the link to clipboard.
                            </div>
                        </div>{" "}
                        <div style={{ marginTop: "4em" }}>
                            <div
                                className="cause-name cause-owner-actual-name"
                                style={{ justifyContent: "center", fontSize: "2.5em" }}
                                id="about-the-developer"
                            >
                                About The Developer
                            </div>
                            <div className="cause-img">
                                <img
                                    src="/about images/developer-image.jpeg"
                                    style={{ width: "60%" }}
                                    alt=""
                                />
                            </div>
                            <div className="about-paragraph">
                                Akinboboye Akinwande is a self taught developer who believes in
                                innovation. He is a graduate of the University of Lagos where he
                                taught himself to code while pursuing his BSc in
                                Electrical/Electronics Engineering which he obtained in 2021 with
                                second class upper honours. He has built several personal projects
                                in the past using HTML, CSS and Vanilla Javascript in the past. This
                                is his first foray into web3/blockchain development. He got
                                interested in Web3 technology in February 2022 and has been
                                fascinated by the several potential applications to increase the
                                quality of life of people of which this project is one.
                            </div>
                        </div>
                        <h2 id="stack" style={{ textAlign: "center" }}>
                            Developer&apos;s Stack
                        </h2>
                        <div className="stack">
                            <code>
                                <a
                                    href="https://en.wikipedia.org/wiki/HTML"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    HTML
                                </a>
                                <br />
                            </code>
                            <code>
                                <a
                                    href="https://en.wikipedia.org/wiki/CSS"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    CSS
                                </a>
                                <br />
                            </code>
                            <code>
                                <a
                                    href="https://en.wikipedia.org/wiki/JavaScript"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Javascript
                                </a>{" "}
                                <br />
                            </code>
                            <code>
                                <a target="_blank" href="https://reactjs.org/" rel="noreferrer">
                                    ReactJS/NextJS
                                </a>{" "}
                                <br />
                            </code>
                            <code>
                                <a
                                    href="https://docs.soliditylang.org/en/v0.8.16/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Solidity
                                </a>{" "}
                                <br />
                            </code>
                            <code>
                                <a href="https://hardhat.org/" target="_blank" rel="noreferrer">
                                    Hardhat
                                </a>{" "}
                                <br />
                            </code>
                            <code>
                                <a href="https://mochajs.org/" target="_blank" rel="noreferrer">
                                    Mocha
                                </a>{" "}
                                <br />
                            </code>
                            <code>
                                <a href="https://www.python.org/" target="_blank" rel="noreferrer">
                                    Python(Brownie)
                                </a>
                                <br />
                            </code>
                            <code>
                                <a href="https://expressjs.com/" target="_blank" rel="noreferrer">
                                    ExpressJS
                                </a>{" "}
                                <br />
                            </code>
                            <code>
                                <a href="https://www.mongodb.com/" target="_blank" rel="noreferrer">
                                    MongoDB
                                </a>{" "}
                                <br />
                            </code>
                            <code>
                                <a
                                    href="https://www.postgresql.org/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    PostgreSQL
                                </a>{" "}
                                <br />
                            </code>
                            <code>
                                <a href="https://sequelize.org/" target="_blank" rel="noreferrer">
                                    Sequelize
                                </a>{" "}
                                <br />
                            </code>
                            <code>
                                <a href="https://pptr.dev/" target="_blank" rel="noreferrer">
                                    Puppeteer
                                </a>{" "}
                                <br />
                            </code>
                        </div>
                        <div style={{ margin: "1em" }} id="resume">
                            <a
                                download="Boboye-Resume.pdf"
                                href="https://drive.google.com/file/d/1SbxYoIAmrY3PjslKM_nXqzPFTh-5phEl/view?usp=sharing"
                            >
                                <button>VIEW RESUME</button>
                            </a>
                        </div>
                        <h2 id="other-work" style={{ textAlign: "center" }}>
                            Other Work from The Developer
                        </h2>
                        <div className="about-paragraph">
                            I make it a point of duty to educate people on what I and many others
                            believe is the future of the internet. Find attached a link to a lecture
                            I gave to a group of friends about the fundamentals of Web3.
                        </div>
                        <div style={{ margin: "1em" }}>
                            <a
                                href="https://drive.google.com/file/d/1e2tk3vZLDX2ZChh-kz6Z-doKsHdA1fWQ/view?usp=sharing"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <button>VIEW LESSON</button>
                            </a>
                        </div>
                        <div className="about-paragraph">
                            I wrote NFT raffle scripts using NodeJS using Thentic API for NFT
                            commerce.
                        </div>
                        <div style={{ margin: "1em" }}>
                            <a href="https://github.com/Boboye-Ak/thentic-nft-raffle" target="_blank" rel="noreferrer">
                                <button>SEE ON GITHUB</button>
                            </a>
                        </div>
                    </div>
                    <div
                        className="donor-list-and-share navbar"
                        style={{ position: "sticky", top: "0", height: "500px" }}
                    >
                        <div>
                            <div className="navbar-header1">
                                <a href="#about-the-site">About The Site </a>
                            </div>
                            <div className="navbar-header2">
                                <a href="#what-is-crowdfund3r">+ What is CrowdFund3r</a>
                            </div>
                            <div className="navbar-header2">
                                <a href="#what-is-a-cause">+ What is a Cause</a>
                            </div>
                            <div className="navbar-header2">
                                <a href="#searches">+ Searches</a>
                            </div>
                            <div className="navbar-header2">
                                <a href="#donations">+ Donations</a>
                            </div>
                            <div className="navbar-header2">
                                <a href="#withdrawal">+ Withdrawal</a>
                            </div>
                            <div className="navbar-header2">
                                <a href="#refunds">+ Refunds</a>
                            </div>
                            <div className="navbar-header2">
                                <a href="#closing">+ Closing</a>
                            </div>
                            <div className="navbar-header2">
                                <a href="#locking">+ Locking</a>
                            </div>
                            <div className="navbar-header2">
                                <a href="#sponsor">+ Sponsor</a>
                            </div>
                            <div className="navbar-header2">
                                <a href="#sharing">+ Sharing</a>
                            </div>
                        </div>
                        <div>
                            <div className="navbar-header1">
                                <a href="#about-the-developer">About The Developer</a>
                            </div>
                            <div className="navbar-header2">
                                <a href="#about-the-developer">+ About</a>
                            </div>
                            <div className="navbar-header2">
                                <a href="#stack">+ Stack</a>
                            </div>
                            <div className="navbar-header2">
                                <a href="#resume">+ Resume</a>
                            </div>
                            <div className="navbar-header2">
                                <a href="#other-work">+ Other work from the developer</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
