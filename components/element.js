import Link from "next/link"
const Element = ({ title, link }) => {
    return (
        <Link href={link}>
            <div className="menu-dropdown-item">{title}</div>
        </Link>
    )
}

export default Element
