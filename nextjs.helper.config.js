const env = {
    PINATA_API_KEY: "905a55504c721f003c8d",
    PINATA_API_SECRET: "75a6ff49f4db082ad52ffe4fcd128624729b0f0a8c034b6dd839d505f886acd5",
}

const pinataHeaders = {
    pinata_api_key: env.PINATA_API_KEY,
    pinata_secret_api_key: env.PINATA_API_SECRET,
}
const siteURL = "http://localhost:3000"
module.exports = { env, pinataHeaders, siteURL }