import Header from "./Header"
import { AiFillHome } from "react-icons/ai"

const Four0FourComponent = () => {
    const randNum = Math.random() * 10
    const imgArray = [
        "404 images/why is my bowl empty meme.jpeg",
        "404 images/he aint got your money.jpeg",
        "404 images/I don't know Goodluck Charlie.jpeg",
        "404 images/I cant find it meme.jpeg",
        "Ive looked but I cant find it meme.jpeg",
    ]
    const index = parseInt(randNum) % imgArray.length
    const imgUri = imgArray[index]
    return (
        <div>
            <Header />
            <div className="container-404">
                <div className="text-404">
                    <h1>&#60;404/&#62;</h1>
                    <p>The resource you are looking for does not exist or could not be found.</p>
                    <a href="/">
                        {" "}
                        <button>
                            RETURN TO HOME{"  "}
                            <AiFillHome />
                        </button>
                    </a>
                </div>

                <img src={imgUri}></img>
            </div>
        </div>
    )
}

export default Four0FourComponent
