import Cause from "../../components/Cause"
import { useRouter } from "next/router"

const CausePage = () => {
    const router = useRouter()
    const id=router.query.id
    return (
        <div>
            <Cause id={id} />
        </div>
    )
}

export default CausePage
