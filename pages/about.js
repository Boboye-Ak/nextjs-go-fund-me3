import Header from "../components/Header"
import { supportedChains } from "../constants"

const About = () => {
    const aboutText =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque accumsan non nisi eu vulputate. Nulla faucibus massa sit amet turpis ultrices, eget rutrum mi sagittis. Vestibulum quis lorem eu dui euismod gravida. Ut sollicitudin tellus diam, quis ullamcorper risus vehicula eget. Fusce varius nisl orci. Sed vitae est at tortor tincidunt pharetra. Cras placerat erat ut commodo eleifend. Aliquam feugiat ex nec metus ultricies volutpat. Maecenas vel dictum tortor. Vestibulum vitae hendrerit arcu. Maecenas sed accumsan ipsum. Ut vel facilisis velit. Sed id facilisis quam, vitae consequat tellus. Curabitur id ornare lorem, ultrices egestas dui. Proin fringilla elit sit amet suscipit imperdiet. Aliquam ut rutrum massa, ac condimentum massa. Aliquam sollicitudin magna in erat dapibus, sit amet facilisis tellus varius. Aenean fermentum, metus in ultrices lacinia, tortor eros pulvinar sem, et pellentesque nunc velit eget est. Nulla tincidunt, orci ac ornare volutpat, dolor nulla pharetra dolor, sit amet mattis leo risus non arcu. Curabitur fermentum dolor convallis, gravida elit vitae, pulvinar arcu. Nunc mattis blandit nisi sit amet accumsan. Phasellus risus neque, bibendum sit amet euismod non, facilisis a lectus. Integer fermentum massa sit amet leo blandit hendrerit. Sed porttitor elit non luctus volutpat.Duis tincidunt, erat nec ullamcorper dapibus, enim dolor convallis sapien, a ultricies metus sem vitae eros. Praesent pulvinar odio eget sapien bibendum fermentum. Pellentesque convallis rhoncus justo, hendrerit placerat urna luctus in. Ut id magna viverra, sagittis quam id, condimentum ex. Sed non arcu in ante pellentesque auctor id sit amet risus. Sed imperdiet eget purus viverra ornare. Aenean eget tempus tortor. Aliquam at arcu vel leo tincidunt molestie ornare ut massa. Suspendisse posuere neque odio, et rutrum dui condimentum vel.Donec volutpat non massa et commodo. Quisque id convallis velit. Ut quis faucibus massa. Proin efficitur pharetra erat. Nunc at neque cursus, semper libero sit amet, finibus massa. Suspendisse dapibus ligula ligula, in sagittis sapien blandit in. Nullam tincidunt eros sed tristique tristique. Cras convallis in lacus at iaculis. Curabitur accumsan, erat ut convallis porttitor, nisl enim accumsan ante, vel malesuada ligula nunc et odio. Praesent tempus sodales sodales. Maecenas bibendum risus eu arcu accumsan, a gravida lectus tempus. Donec facilisis risus justo, quis varius enim congue sit amet.In mollis eros nulla, et gravida urna elementum ac. Fusce purus lorem, tempus eget velit nec, aliquet vestibulum justo. Aliquam erat volutpat. Nunc non nunc porta, tristique nisl ac, convallis nulla. Proin dapibus purus id pellentesque facilisis. Nulla sed sodales tellus. Sed dolor eros, varius a fermentum ac, sagittis at purus. Mauris eget pretium magna. Nunc est tellus, tempor facilisis erat et, rutrum efficitur nulla. Cras egestas viverra facilisis. Integer a aliquam mauris. Maecenas non condimentum massa, at commodo dui. Praesent bibendum vestibulum erat"
    return (
        <div className="cause">
            <Header />
            <div className="container">
                <div className="body-and-donors">
                    <div className="cause-body" style={{ width: "75%" }}>
                        {" "}
                        <div
                            className="cause-name cause-owner-actual-name"
                            style={{ justifyContent: "center", fontSize: "2.5em" }}
                            id="about-the-site"
                        >
                            About The Site
                        </div>
                        <div className="cause-img">
                            <img src="/crowdfunder-tentative-logo.png" />
                        </div>
                        <h2 id="what-is-crowdfund3r">What is CrowdFund3r?</h2>
                        <div className="about-paragraph">
                            CrowdFund3r is a web3 crowdfunding site built upon the ethereum
                            blockchain. It allows people in need of money to leverage web3
                            technology to get assistance from well meaning members of the public
                            while protecting the interest of the donors by granting them the
                            opportunity to retract their donations should they be provided with new
                            information that makes them want to. The website is controlled at the
                            backend by a{" "}
                            <a
                                href="https://github.com/Boboye-Ak/hardhat-go-fund-me-3/blob/main/contracts/CrowdFunder.sol"
                                style={{ color: "blue", textDecoration: "underline" }}
                                target="_blank"
                            >
                                CrowdFunder contract.
                            </a>{" "}
                            The site was built with NextJS and Solidity. As the site is still in
                            testing, it is only available on testnets({" "}
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
                        <h2>What is a Cause?</h2>
                        <div className="about-paragraph">
                            A Cause is a unit of the site that allows a user receive donations and
                            other users to make donations to them. Each cause is a product of a{" "}
                            <a
                                href="https://github.com/Boboye-Ak/hardhat-go-fund-me-3/blob/main/contracts/Cause.sol"
                                style={{ color: "blue", textDecoration: "underline" }}
                                target="_blank"
                            >
                                Cause contract.
                            </a>{" "}
                            Every cause has a unique numerical ID as well as a hexadecimal (starts
                            with "0x") address. You can search for a cause using either its ID,
                            contract address or the address of the ethereum wallet used to create it
                            in either the search page or the search bar of the "causes" page(can be
                            reached via dropdown menu at the top left).
                        </div>
                        <div className="cause-img">
                            <img
                                src="about images/cause-page.png"
                                style={{ width: "100%" }}
                                alt="A typical cause page"
                            />
                        </div>
                        <div className="cause-img">
                            <img
                                src="about images/search-page.png"
                                style={{ width: "100%" }}
                                alt="Search Page"
                            />
                        </div>
                        <div className="cause-img">
                            <img
                                src="about images/causes-page.png"
                                style={{ width: "100%" }}
                                alt="Causes Page"
                            />
                        </div>
                    </div>
                    <div
                        className="donor-list-and-share"
                        style={{ position: "sticky", top: "0", height: "500px" }}
                    ></div>
                </div>
            </div>
        </div>
    )
}

export default About
