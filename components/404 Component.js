import Header from "./Header"

const Four0FourComponent = () => {
    const randNum = Math.random() * 10
    const imgArray = [
        "404 images/why is my bowl empty meme.jpeg",
        "404 images/he aint got your money.jpeg",
    ]
    const index = parseInt(randNum) % imgArray.length
    const imgUri = imgArray[index]
    return (
        <div>
            <Header />
            <div className="container-404">
                <h1>&#60;404/&#62;</h1>
                <img src={imgUri}></img>
            </div>
        </div>
    )
}

export default Four0FourComponent
