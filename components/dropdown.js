import Element from "./element"
import { useState } from "react"
import { RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri"

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
            <div onClick={handleClick} className="dropdown-menu-button">
                {title}
                {!display ? (
                    <RiArrowRightSLine size="1em" className="read-more-button-circle" />
                ) : (
                    <RiArrowDownSLine size="1em" className="read-more-button-circle" />
                )}
            </div>
            <div
                className="menu-dropdown-items"
                onMouseLeave={() => {
                    setDisplay(false)
                }}
            >
                {items?.map((item, index) => {
                    return (
                        <Element
                            title={item.name}
                            link={item.link}
                            style={{
                                opacity: display ? 1 : 0,
                                transition: `opacity 500ms ease-in-out ${
                                    display ? `${index * 100}ms` : `${500 - index * 150}ms`
                                }`,
                            }}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default Dropdown
