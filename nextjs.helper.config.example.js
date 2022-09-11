const env = {
    PINATA_API_KEY: "pinataapikey",
    PINATA_API_SECRET: "pinataapisecret",
    NFT_STORAGE_API_TOKEN:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDA0MDkyYzAzMTU5NjEyN0ZFQ2QwMDdDRDNEZWMxYjREMGRhNDgzZGUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MjgwMTExMTIzMSwibmFtZSI6ImNyb3dkZnVuZDNyIn0.NcCBEqATT6aIsBfVDHk-KJMsial1VU_gtHCyUpSGG5U",
}

const pinataHeaders = {
    pinata_api_key: env.PINATA_API_KEY,
    pinata_secret_api_key: env.PINATA_API_SECRET,
}
const siteURL = "http://localhost:3000"
module.exports = { env, pinataHeaders, siteURL }
