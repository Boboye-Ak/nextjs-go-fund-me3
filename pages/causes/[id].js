import Cause from "../../components/Cause"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useMoralis } from "react-moralis"

const CausePage = () => {
    const router = useRouter()
    const { isWeb3Enabled } = useMoralis()
    const id = router.query.id



    return (
        <div>
            <Cause id={id} />
        </div>
    )
}

export default CausePage
