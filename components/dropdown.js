import Element from "./element"
import { useState } from "react"
import { RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri"
import { AiOutlineMenu } from "react-icons/ai"
import { ImMenu } from "react-icons/im"

const Dropdown = ({ title, items }) => {
    const [display, setDisplay] = useState(false)

    function handleClick() {
        if (!display) {
            setDisplay(true)
        } else {
            setDisplay(false)
        }
    }
    return (
        <div>
            <div
                onClick={handleClick}
                className="dropdown-menu-button"
                style={
                    display
                        ? { backgroundColor: "#298e46", color: "white" }
                        : { backgroundColor: "white", color: "#298e46" }
                }
            >
                <ImMenu />
            </div>
            <div
                className="menu-dropdown-items"
                onMouseLeave={() => {
                    setDisplay(false)
                }}
                style={
                    !display
                        ? { width: "0", height: "0", fontSize: "0" }
                        : { width: "auto", height: "auto" }
                }
            >
                {items?.map((item, index) => {
                    return (
                        <Element
                            title={item.name}
                            link={item.link}
                            key={index}
                            style={{
                                opacity: display ? 1 : 0,
                                transition: `all 200ms linear ${
                                    display ? `${index * 100}ms` : `${500 - index * 150}ms`
                                }`,
                                height: display ? "2.5em" : "0",
                                width: display ? "30vw" : "0",
                            }}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default Dropdown
