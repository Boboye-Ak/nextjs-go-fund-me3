import Link from "next/link"
const Element = ({ title, link, style }) => {
    return (
        <a href={link}>
            <div className="menu-dropdown-item" style={style}>
                {title}
            </div>
        </a>
    )
}

export default Element
