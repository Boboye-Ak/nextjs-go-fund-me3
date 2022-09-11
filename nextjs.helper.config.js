const env = {
    PINATA_API_KEY: process.env.PINATA_API_KEY || "905a55504c721f003c8d",
    PINATA_API_SECRET:
        process.env.PINATA_API_SECRET ||
        "75a6ff49f4db082ad52ffe4fcd128624729b0f0a8c034b6dd839d505f886acd5",
    NFT_STORAGE_API_TOKEN:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDA0MDkyYzAzMTU5NjEyN0ZFQ2QwMDdDRDNEZWMxYjREMGRhNDgzZGUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MjgwMTExMTIzMSwibmFtZSI6ImNyb3dkZnVuZDNyIn0.NcCBEqATT6aIsBfVDHk-KJMsial1VU_gtHCyUpSGG5U",
}

const pinataHeaders = {
    pinata_api_key: env.PINATA_API_KEY,
    pinata_secret_api_key: env.PINATA_API_SECRET,
}
const siteURL = "https://crowdfund3r.netlify.app"
module.exports = { env, pinataHeaders, siteURL }
