import { useState } from "react"
import Header from "../components/Header"
import { useRouter } from "next/router"
const CreateCause = () => {
    const [causeName, setCauseName] = useState("")
    const [goal, setGoal] = useState("")
    const [hasCause, setHasCause] = useState(null)

    const handleCreate = async (e) => {
        e.preventDefault()
    }
    return (
        <div>
            <Header />
            Create Cause Page
            <form>
                <input
                    type="text"
                    value={causeName}
                    placeholder="Cause Name"
                    onChange={(e) => {
                        setCauseName(e.target.value)
                    }}
                ></input>
                <input
                    type="number"
                    value={goal}
                    placeholder="Target Amount for Donations(in ETH)"
                    onChange={(e) => {
                        setGoal(e.target.value)
                    }}
                ></input>
                <button onClick={handleCreate}>CREATE CAUSE</button>
            </form>
        </div>
    )
}

export default CreateCause
