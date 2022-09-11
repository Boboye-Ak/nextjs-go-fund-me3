import { NFTStorage, File } from "nft.storage"
import { env } from "../nextjs.helper.config"
const client = new NFTStorage({ token: env.NFT_STORAGE_API_TOKEN })
const sendFileToNFTStorage = async ({ fileImg, name, description }) => {
    if (fileImg) {
        try {
            const metadata = await client.store({
                name: name || "*Please set name in Name modal*",
                image: fileImg,
                description: description || "*Please give a decription in edit modal.*",
            })
            return metadata.url
        } catch (e) {
            console.log(e)
        }
    }
}

const toImgObject = async (url) => {
    const res = await fetch(url)
    const blob = await res.blob()
    return blob
}

module.exports = { sendFileToNFTStorage, toImgObject }
