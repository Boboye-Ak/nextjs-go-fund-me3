import Link from "next/link"
const Element = ({ title, link, style }) => {
    return (
        <Link href={link}>
            <div className="menu-dropdown-item" style={style}>
                {title}
            </div>
        </Link>
    )
}

export default Element
