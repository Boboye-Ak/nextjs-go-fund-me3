import { env } from "../nextjs.helper.config"
import axios from "axios"

const sendFileToIPFS = async (fileImg) => {
    if (fileImg) {
        try {
            const formData = new FormData()
            formData.append("file", fileImg)

            const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                headers: {
                    pinata_api_key: env.PINATA_API_KEY,
                    pinata_secret_api_key: env.PINATA_API_SECRET,
                    "Content-Type": "multipart/form-data",
                },
            })

            const ImgHash = `ipfs://${resFile.data.IpfsHash}`
            return ImgHash
        } catch (error) {
            console.log("Error sending File to IPFS: ")
            console.log(error)
        }
    }
}

const uploadJSONToIPFS = async (causeMetadata) => {
    try {
        const data = JSON.stringify(causeMetadata)
        const res = await axios({
            method: "post",
            url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
            headers: {
                pinata_api_key: env.PINATA_API_KEY,
                pinata_secret_api_key: env.PINATA_API_SECRET,
                "Content-Type": "application/json",
            },
            data: data,
        })
        const fileHash = `ipfs://${res.data.IpfsHash}`
        return fileHash
    } catch (error) {
        console.log("Error Uploading Metadata")
        console.log(error)
    }
}

module.exports = { sendFileToIPFS, uploadJSONToIPFS }
